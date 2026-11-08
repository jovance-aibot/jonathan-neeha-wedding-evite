import type { Ref } from 'react'
import { coupleLabel, eventConfig, type EventConfig } from '../config/event.ts'

type CoupleHeadingProps = {
  config?: EventConfig
  headingRef?: Ref<HTMLHeadingElement>
  focusable?: boolean
}

export function CoupleHeading({
  config = eventConfig,
  headingRef,
  focusable = false,
}: CoupleHeadingProps) {
  const label = coupleLabel(config)
  const first = (name: string) => name.split(' ')[0]
  return (
    <h1 ref={headingRef} tabIndex={focusable ? -1 : undefined} aria-label={label}>
      <span className="name short">{first(config.couple.partnerA.display)}</span>
      <span className="and short" aria-hidden="true">
        &amp;
      </span>
      <span className="name short">{first(config.couple.partnerB.display)}</span>
      <span className="name full">{config.couple.partnerA.display}</span>
      <span className="and full" aria-hidden="true">
        &amp;
      </span>
      <span className="name full">{config.couple.partnerB.display}</span>
    </h1>
  )
}
