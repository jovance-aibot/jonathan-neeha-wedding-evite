export function parseDateDisplay(display: string) {
  const [weekday, rest] = display.split(', ')
  const match = rest?.match(/^(\d+)\s+(\S+)\s+(\d+)$/)
  if (!weekday || !match) return null
  return { weekday, day: match[1], month: match[2], year: match[3] }
}
