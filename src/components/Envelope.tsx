import { eventConfig } from '../config/event.ts'
import { parseDateDisplay } from '../lib/dateDisplay.ts'

const waxPath =
  'M692.30,993.00 L693.78,997.91 L693.14,1002.79 L691.79,1007.54 L690.57,1012.25 L689.00,1016.85 L686.56,1021.13 L683.87,1025.20 L681.96,1029.49 L680.66,1034.10 L678.57,1038.36 L674.91,1041.64 L670.82,1044.45 L668.26,1048.27 L667.62,1053.89 L667.05,1060.05 L664.35,1064.46 L659.27,1066.19 L653.53,1066.68 L648.77,1068.10 L645.05,1071.02 L641.29,1074.04 L636.86,1075.78 L632.05,1076.50 L627.45,1077.47 L623.10,1079.20 L618.70,1080.97 L614.13,1082.23 L609.52,1083.61 L604.87,1085.84 L600.00,1088.10 L595.01,1088.27 L590.29,1085.34 L586.05,1081.07 L581.84,1078.44 L577.08,1078.55 L571.90,1079.47 L567.17,1078.53 L563.36,1075.29 L559.87,1071.76 L555.60,1069.90 L550.34,1069.47 L545.02,1068.68 L540.64,1066.30 L537.24,1062.70 L534.25,1058.75 L531.59,1054.59 L529.72,1049.91 L528.53,1044.92 L526.79,1040.54 L523.38,1037.24 L518.98,1034.28 L515.72,1030.52 L514.81,1025.70 L514.89,1020.65 L513.42,1016.20 L509.70,1012.19 L505.93,1007.90 L504.94,1002.99 L507.15,997.87 L510.30,993.00 L512.03,988.39 L512.14,983.77 L512.03,979.07 L512.54,974.41 L513.21,969.74 L513.47,964.89 L513.96,959.97 L515.69,955.46 L518.50,951.47 L520.95,947.36 L522.27,942.52 L523.58,937.47 L526.82,933.74 L532.37,932.10 L538.35,931.35 L542.57,929.21 L544.74,924.75 L546.55,919.43 L549.65,915.46 L554.05,913.40 L558.67,911.88 L562.83,909.51 L566.83,906.58 L571.21,904.38 L575.99,903.40 L580.86,902.95 L585.66,902.47 L590.50,902.61 L595.34,904.09 L600.00,906.10 L604.53,906.51 L609.32,904.34 L614.52,901.31 L619.68,900.42 L624.18,902.75 L628.14,906.38 L632.39,908.62 L637.39,909.02 L642.50,909.59 L646.60,912.28 L649.46,916.83 L651.99,921.44 L655.18,924.86 L659.02,927.45 L662.95,930.05 L666.84,932.81 L671.16,935.37 L675.77,937.95 L679.43,941.42 L681.00,946.24 L681.14,951.66 L681.98,956.50 L684.72,960.48 L687.98,964.41 L689.22,969.09 L687.72,974.35 L685.68,979.43 L685.94,983.97 L688.90,988.34Z'

type EnvelopeGateProps = {
  opening: boolean
  onOpen: () => void
  onRecedeEnd: () => void
}

export function EnvelopeGate({ opening, onOpen, onRecedeEnd }: EnvelopeGateProps) {
  const { partnerA, partnerB } = eventConfig.couple
  const monogram = `${partnerA.initial} & ${partnerB.initial}`
  const gateDate = parseDateDisplay(eventConfig.when.display)
  return (
    <main className="gate">
      <div className="gate-body">
        <header className="gate-intro">
          <p className="gate-kicker">Please join us to celebrate</p>
          <p className="gate-names">
            {partnerA.display.split(' ')[0]} <span className="amp">&amp;</span> {partnerB.display.split(' ')[0]}
          </p>
          <p className="gate-date">
            {gateDate ? (
              <>
                <span className="date-word">{gateDate.weekday}</span>
                <span className="date-sep"> · </span>
                <span className="numeral">{gateDate.day}</span> <span className="date-word">{gateDate.month}</span>{' '}
                <span className="numeral">{gateDate.year}</span>
              </>
            ) : (
              eventConfig.when.display
            )}
          </p>
        </header>
        <button
          type="button"
          id="open-invitation"
          className="envelope-open"
          aria-label={eventConfig.gate.openLabel}
          onClick={onOpen}
        >
          <div
            className={opening ? 'envelope-wrap is-opening' : 'envelope-wrap'}
            onAnimationEnd={(event) => {
              if (event.animationName !== 'envelope-recede') return
              if (event.target !== event.currentTarget) return
              onRecedeEnd()
            }}
          >
            <svg className="envelope" viewBox="120 650 960 610" aria-hidden="true">
              <defs>
                <linearGradient id="wine-body" x2="0.4" y2="1">
                  <stop stopColor="#713845" />
                  <stop offset="1" stopColor="#3f1e2b" />
                </linearGradient>
                <linearGradient id="wine-pocket" x2="0" y2="1">
                  <stop stopColor="#713845" />
                  <stop offset="1" stopColor="#572a39" />
                </linearGradient>
                <linearGradient id="wine-flap" x2="0.2" y2="1">
                  <stop stopColor="#8a4554" />
                  <stop offset="0.55" stopColor="#713845" />
                  <stop offset="1" stopColor="#572a39" />
                </linearGradient>
                <linearGradient id="wine-ribbon">
                  <stop stopColor="#ad8e62" />
                  <stop offset="0.22" stopColor="#ecd6ad" />
                  <stop offset="0.54" stopColor="#e9d4b1" />
                  <stop offset="0.85" stopColor="#bea174" />
                  <stop offset="1" stopColor="#f2dfbf" />
                </linearGradient>
                <radialGradient id="wine-wax" cx="0.34" cy="0.23" r="0.8">
                  <stop stopColor="#f0d7ac" />
                  <stop offset="0.64" stopColor="#d7bb8b" />
                  <stop offset="1" stopColor="#f0d7ac" />
                </radialGradient>
                <filter id="wine-grain" x="0" y="0" width="100%" height="100%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4" />
                  <feColorMatrix type="saturate" values="0" />
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.16" />
                  </feComponentTransfer>
                </filter>
                <clipPath id="wine-clip">
                  <rect x="120" y="650" width="960" height="610" rx="9" />
                </clipPath>
                <clipPath id="sheet-clip">
                  <rect x="140" y="0" width="920" height="1236" />
                </clipPath>
              </defs>
              <g clipPath="url(#wine-clip)">
                <rect x="120" y="650" width="960" height="610" fill="#2a1218" />
                <rect x="120" y="650" width="960" height="610" fill="url(#wine-body)" />
                <rect x="120" y="650" width="960" height="610" filter="url(#wine-grain)" opacity="0.55" />
              </g>
              <g clipPath="url(#sheet-clip)">
                <g className="riser">
                  <rect x="150" y="320" width="900" height="920" rx="6" fill="#fbf6ee" stroke="#3e5144" strokeOpacity="0.22" />
                  <text x="600" y="408" textAnchor="middle" fontSize="58" fill="#2a2420">
                    <tspan fontFamily="Bodoni Moda, serif" fontWeight="700">
                      {partnerA.initial}
                    </tspan>
                    <tspan fontFamily="Great Vibes, cursive" fontSize="64">
                      {' '}
                      &amp;{' '}
                    </tspan>
                    <tspan fontFamily="Bodoni Moda, serif" fontWeight="700">
                      {partnerB.initial}
                    </tspan>
                  </text>
                  <text x="600" y="462" textAnchor="middle" fontSize="22" fill="#2a2420">
                    <tspan fontFamily="Bodoni Moda, serif" fontWeight="700">
                      {partnerA.display}
                    </tspan>
                    <tspan fontFamily="Great Vibes, cursive" fontSize="28">
                      {' '}
                      &amp;{' '}
                    </tspan>
                    <tspan fontFamily="Bodoni Moda, serif" fontWeight="700">
                      {partnerB.display}
                    </tspan>
                  </text>
                  <text x="600" y="500" textAnchor="middle" fontSize="22" fill="#4a403a">
                    <tspan fontFamily="Cormorant Garamond, serif" fontStyle="italic">
                      {gateDate?.weekday ?? ''}
                      {', '}
                    </tspan>
                    <tspan fontFamily="Bodoni Moda, serif" fontWeight="500">
                      {gateDate?.day ?? ''}
                    </tspan>
                    <tspan fontFamily="Cormorant Garamond, serif" fontStyle="italic">
                      {' '}
                      {gateDate?.month ?? ''}{' '}
                    </tspan>
                    <tspan fontFamily="Bodoni Moda, serif" fontWeight="500">
                      {gateDate?.year ?? ''}
                    </tspan>
                  </text>
                  <path d="M430 528 H520 M680 528 H770" fill="none" stroke="#3e5144" strokeOpacity="0.4" strokeWidth="1.4" />
                  <path d="M600 520 l7 8 -7 8 -7 -8 Z" fill="#3e5144" opacity="0.5" />
                  <text x="600" y="572" textAnchor="middle" fontFamily="Bodoni Moda, serif" fontWeight="700" fontSize="28" fill="#2a2420">
                    {eventConfig.ceremony.venueName}
                  </text>
                  <text
                    x="600"
                    y="606"
                    textAnchor="middle"
                    fontFamily="Cormorant Garamond, serif"
                    fontSize="20"
                    fontStyle="italic"
                    fill="#4a403a"
                  >
                    {eventConfig.ceremony.locality}
                  </text>
                  <text
                    x="600"
                    y="658"
                    textAnchor="middle"
                    fontFamily="Cormorant Garamond, serif"
                    fontWeight="600"
                    fontSize="16"
                    letterSpacing="3"
                    fill="#3e5144"
                  >
                    CEREMONY
                  </text>
                  <text x="600" y="688" textAnchor="middle" fontSize="24" fill="#2a2420">
                    <tspan fontFamily="Bodoni Moda, serif" fontWeight="500">
                      {eventConfig.ceremony.timeDisplay.split(' - ')[0]}
                    </tspan>
                    <tspan fontFamily="Cormorant Garamond, serif" fontWeight="600">
                      {' - '}
                    </tspan>
                    <tspan fontFamily="Bodoni Moda, serif" fontWeight="500">
                      {eventConfig.ceremony.timeDisplay.split(' - ')[1]}
                    </tspan>
                  </text>
                  <text
                    x="600"
                    y="716"
                    textAnchor="middle"
                    fontFamily="Cormorant Garamond, serif"
                    fontSize="18"
                    fontStyle="italic"
                    fill="#4a403a"
                  >
                    {eventConfig.ceremony.room}
                  </text>
                  <text
                    x="600"
                    y="748"
                    textAnchor="middle"
                    fontFamily="Cormorant Garamond, serif"
                    fontWeight="600"
                    fontSize="16"
                    letterSpacing="3"
                    fill="#3e5144"
                  >
                    RECEPTION
                  </text>
                  <text x="600" y="776" textAnchor="middle" fontSize="24" fill="#2a2420">
                    <tspan fontFamily="Bodoni Moda, serif" fontWeight="500">
                      {eventConfig.reception.timeDisplay.split(' - ')[0]}
                    </tspan>
                    <tspan fontFamily="Cormorant Garamond, serif" fontWeight="600">
                      {' - '}
                    </tspan>
                    <tspan fontFamily="Bodoni Moda, serif" fontWeight="500">
                      {eventConfig.reception.timeDisplay.split(' - ')[1]}
                    </tspan>
                  </text>
                  <text
                    x="600"
                    y="802"
                    textAnchor="middle"
                    fontFamily="Cormorant Garamond, serif"
                    fontSize="18"
                    fontStyle="italic"
                    fill="#4a403a"
                  >
                    Outdoor space
                  </text>
                </g>
              </g>
              <g clipPath="url(#wine-clip)">
                <path d="M122 659 L662 1037 L122 1257Z" fill="#572a39" />
                <path d="M1078 659 L538 1037 L1078 1257Z" fill="#572a39" />
                <g className="flap">
                  <path
                    d="M122 652 H1078 L645 1003 Q600 1035 555 1003Z"
                    fill="url(#wine-flap)"
                    stroke="#3f1e2b"
                    strokeOpacity="0.4"
                    strokeWidth="1.5"
                  />
                  <path d="M142 700 H548 M652 700 H1058" fill="none" stroke="#cbb087" strokeOpacity="0.55" strokeWidth="1.5" />
                </g>
              </g>
              <g className="pocket">
                <path d="M122 1260 L122 1234 L552 942 Q600 913 648 942 L1078 1234 L1078 1260Z" fill="url(#wine-pocket)" />
                <path d="M126 1235 L553 944 M647 944 L1074 1235" fill="none" stroke="#3f1e2b" strokeOpacity="0.32" strokeWidth="2" />
              </g>
              <g className="closure">
                <path className="ribbon" d="M564 652 H636 V1258 H564Z" fill="url(#wine-ribbon)" />
                <path d="M571 654 V1256 M629 654 V1256" stroke="#fbebcb" strokeOpacity="0.6" />
                <g className="seal">
                  <path d={waxPath} fill="#23161c" opacity="0.2" transform="translate(0 6)" />
                  <path d={waxPath} fill="url(#wine-wax)" stroke="#d7bb8b" strokeWidth="2" />
                  <circle cx="600" cy="993" r="73" fill="none" stroke="#73513c" strokeOpacity="0.48" strokeWidth="2" />
                  <circle cx="600" cy="993" r="68" fill="none" stroke="#73513c" strokeOpacity="0.24" />
                  <text x="600" y="1006" textAnchor="middle" fontFamily="Bodoni Moda, serif" fontWeight="700" fontSize="36" fill="#73513c">
                    {monogram}
                  </text>
                </g>
              </g>
            </svg>
          </div>
          <span className="open-cue">{eventConfig.gate.openLabel}</span>
        </button>
        <div className="gate-divider" aria-hidden="true">
          <span />
        </div>
        <section className="gate-venue" aria-label="Venue">
          <p className="gate-kicker">The venue</p>
          <p className="gate-venue-name">{eventConfig.ceremony.venueName}</p>
          <p className="gate-locality">{eventConfig.ceremony.locality}</p>
        </section>
      </div>
    </main>
  )
}
