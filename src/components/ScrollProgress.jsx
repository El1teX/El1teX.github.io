import { useEffect, useRef } from 'react'

const CELLS = 10

// Прогресс прокрутки в духе консоли: [#####-----] 50%. Обновляем DOM напрямую, без ре-рендеров React.
export default function ScrollProgress() {
  const textRef = useRef(null)
  const barRef = useRef(null)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0
      const filled = Math.round(p * CELLS)
      textRef.current.textContent = `[${'#'.repeat(filled)}${'-'.repeat(CELLS - filled)}] ${String(Math.round(p * 100)).padStart(3, ' ')}%`
      barRef.current.style.transform = `scaleX(${p})`
    }
    const onScroll = () => (raf ||= requestAnimationFrame(update))
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <>
      <span className="progress__text muted" ref={textRef} aria-hidden="true" />
      <span className="progress__bar" ref={barRef} aria-hidden="true" />
    </>
  )
}
