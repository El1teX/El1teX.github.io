import { useEffect, useRef } from 'react'
import { animate } from 'animejs'

// Пасхалка: «цифровой дождь» поверх страницы. Закрывается кликом или Esc.
export default function Matrix({ onClose }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const size = 16
    let w, h, drops
    const resize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
      drops = Array.from({ length: Math.ceil(w / size) }, () => Math.random() * -50)
      ctx.fillStyle = '#0a0d0b'
      ctx.fillRect(0, 0, w, h)
    }
    resize()
    const css = getComputedStyle(document.documentElement)
    const color = css.getPropertyValue('--accent').trim() || '#39ff88'
    const bg = css.getPropertyValue('--bg').trim() || '#0a0d0b'
    const chars = 'アイウエオカキクケコサシスセソ0123456789ELITEX<>/{}'
    let raf
    const draw = () => {
      ctx.globalAlpha = 0.12
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)
      ctx.globalAlpha = 1
      ctx.font = `${size}px JetBrains Mono, monospace`
      drops.forEach((y, i) => {
        ctx.fillStyle = Math.random() > 0.975 ? '#ffffff' : color
        ctx.fillText(chars[(Math.random() * chars.length) | 0], i * size, y * size)
        drops[i] = y * size > h && Math.random() > 0.975 ? 0 : y + 1
      })
      raf = requestAnimationFrame(draw)
    }
    draw()

    animate(canvas, { opacity: [0, 1], duration: 600, ease: 'outQuad' })
    const close = () =>
      animate(canvas, { opacity: 0, duration: 400, ease: 'inQuad', onComplete: onClose })
    const onKey = (e) => e.key === 'Escape' && close()
    canvas.addEventListener('click', close)
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', resize)
    const auto = setTimeout(close, 9000)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(auto)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', resize)
    }
  }, [onClose])

  return <canvas ref={canvasRef} className="matrix" />
}
