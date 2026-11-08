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
  return (
    <h1 ref={headingRef} tabIndex={focusable ? -1 : undefined} aria-label={label}>
      <span className="name">{config.couple.partnerA.display}</span>
      <span className="and" aria-hidden="true">
        &amp;
      </span>
      <span className="name">{config.couple.partnerB.display}</span>
    </h1>
  )
}
