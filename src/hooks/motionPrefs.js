// Нужно ли выключить анимации. По умолчанию следуем системе (prefers-reduced-motion:
// в Windows это «Эффекты анимации»), но посетитель может переопределить выбор
// переключателем на сайте — он хранится в localStorage.
const KEY = 'motion'

export const systemReducesMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function getMotionOverride() {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'on' || v === 'off' ? v : null
  } catch {
    return null
  }
}

export const prefersReducedMotion = () => {
  const o = getMotionOverride()
  return o ? o === 'off' : systemReducesMotion()
}

// Анимации запускаются при монтировании компонентов, поэтому после смены — перезагрузка.
export function setMotion(on) {
  try {
    localStorage.setItem(KEY, on ? 'on' : 'off')
  } catch {
    // без localStorage переключатель просто не запомнится
  }
  location.reload()
}

// Класс на <html>, чтобы CSS тоже знал итоговый выбор, а не только системный.
if (typeof document !== 'undefined') {
  document.documentElement.classList.toggle('reduce-motion', prefersReducedMotion())
}
