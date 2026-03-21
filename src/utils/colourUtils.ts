// ─── Hex ↔ HSL helpers ────────────────────────────────────────────────────────

function hue2rgb(p: number, q: number, t: number): number {
  let tt = t
  if (tt < 0) tt += 1
  if (tt > 1) tt -= 1
  if (tt < 1 / 6) return p + (q - p) * 6 * tt
  if (tt < 1 / 2) return q
  if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6
  return p
}

function hexToHSL(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }

  return [h * 360, s * 100, l * 100]
}

function hslToHex(h: number, s: number, l: number): string {
  const hh = h / 360
  const ss = s / 100
  const ll = l / 100
  let r: number, g: number, b: number

  if (ss === 0) {
    r = g = b = ll
  } else {
    const q = ll < 0.5 ? ll * (1 + ss) : ll + ss - ll * ss
    const p = 2 * ll - q
    r = hue2rgb(p, q, hh + 1 / 3)
    g = hue2rgb(p, q, hh)
    b = hue2rgb(p, q, hh - 1 / 3)
  }

  return (
    '#' +
    [r, g, b]
      .map((x) =>
        Math.round(Math.min(255, Math.max(0, x * 255)))
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  )
}

// ─── Public helpers ────────────────────────────────────────────────────────────

/** Lighten a hex colour by `amount` lightness percentage points (0–100). */
export function lighten(hex: string, amount: number): string {
  try {
    if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return hex
    const [h, s, l] = hexToHSL(hex)
    return hslToHex(h, s, Math.min(95, l + amount))
  } catch {
    return hex
  }
}

/** Darken a hex colour by `amount` lightness percentage points (0–100). */
export function darken(hex: string, amount: number): string {
  try {
    if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return hex
    const [h, s, l] = hexToHSL(hex)
    return hslToHex(h, s, Math.max(5, l - amount))
  } catch {
    return hex
  }
}

/** Apply accent colour CSS vars to :root. Falls back gracefully on invalid hex. */
export function applyAccent(hex: string): void {
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return
  const root = document.documentElement
  root.style.setProperty('--lapis', hex)
  root.style.setProperty('--lapis-mid', lighten(hex, 10))
  root.style.setProperty('--lapis-bright', lighten(hex, 25))
  root.style.setProperty('--lapis-deep', darken(hex, 25))
}
