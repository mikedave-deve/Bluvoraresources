import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Attach a scroll-triggered fade-up animation to a container element.
 * Children with [data-animate] are staggered.
 *
 * @param {object} options
 * @param {string}  options.selector — child selector (default: '[data-animate]')
 * @param {number}  options.stagger  — stagger between items (default: 0.1)
 * @param {number}  options.y        — initial Y offset (default: 40)
 * @param {string}  options.start    — ScrollTrigger start (default: 'top 85%')
 */
export function useScrollAnimation({
  selector = '[data-animate]',
  stagger  = 0.1,
  y        = 40,
  start    = 'top 85%',
} = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const targets = ref.current?.querySelectorAll(selector)
      if (!targets?.length) return

      gsap.fromTo(
        targets,
        { y, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ref.current,
            start,
            once: true,
          },
        }
      )
    }, ref)

    return () => ctx.revert()
  }, [selector, stagger, y, start])

  return ref
}

/**
 * Animate a single element into view on scroll.
 */
export function useReveal({ y = 30, delay = 0, start = 'top 88%' } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { y, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.75, delay,
          ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start, once: true },
        }
      )
    })
    return () => ctx.revert()
  }, [y, delay, start])

  return ref
}
