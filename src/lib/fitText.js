import { useLayoutEffect, useRef } from 'react'

// Sizes a heading so its justified lines come out nearly full on their own: fewer stretched gaps between words.
// Scales the font so the text, laid out on one line, is a whole number of column widths (a little under, so the
// words always fit), then shrinks a step at a time if word breaks still spill onto an extra line.
export function useFitText(text, { min = 20, max = 34, fill = 0.95 } = {}) {
  const ref = useRef(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const fit = () => {
      el.style.fontSize = ''
      const base = parseFloat(getComputedStyle(el).fontSize)
      const width = el.clientWidth
      el.style.whiteSpace = 'nowrap'
      const natural = el.scrollWidth
      el.style.whiteSpace = ''
      if (!width || !natural) return
      const lines = Math.max(1, Math.round(natural / width))
      let size = Math.min(max, Math.max(min, base * (lines * width * fill) / natural))
      el.style.fontSize = `${size}px`
      const lineHeight = () => parseFloat(getComputedStyle(el).lineHeight)
      for (let i = 0; i < 12 && size > min && Math.round(el.clientHeight / lineHeight()) > lines; i++) {
        size = Math.max(min, size * 0.98)
        el.style.fontSize = `${size}px`
      }
    }
    fit()
    document.fonts?.ready.then(fit) // web fonts change the text's width once they load
    let lastWidth = el.parentElement.clientWidth
    // refit only on width changes: the new font size itself changes the parent's height
    const ro = new ResizeObserver(() => { const w = el.parentElement.clientWidth; if (w !== lastWidth) { lastWidth = w; fit() } })
    ro.observe(el.parentElement)
    return () => ro.disconnect()
  }, [text, min, max, fill])
  return ref
}
