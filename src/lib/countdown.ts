export type CountdownStatus = 'remaining' | 'expired' | 'invalid'

export type CountdownParts = {
  status: CountdownStatus
  days: number
  hours: number
  minutes: number
  seconds: number
  totalSeconds: number
}

const empty: CountdownParts = {
  status: 'invalid',
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  totalSeconds: 0,
}

export function getCountdown(now: Date, targetIso: string): CountdownParts {
  const target = new Date(targetIso)
  if (Number.isNaN(now.getTime()) || Number.isNaN(target.getTime())) {
    return empty
  }

  const diff = target.getTime() - now.getTime()
  if (diff <= 0) {
    return { ...empty, status: 'expired' }
  }

  const totalSeconds = Math.floor(diff / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return {
    status: 'remaining',
    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
  }
}

export function unitWord(value: number, singular: string, plural: string): string {
  return value === 1 ? singular : plural
}
