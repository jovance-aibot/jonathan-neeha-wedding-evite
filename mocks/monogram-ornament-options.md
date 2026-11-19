# Monogram ornament mocks

Render-only options for the letterhead at the existing rise peak. None of these marks are in the invitation. The letter still draws only the centred J & N monogram.

Captured on the local preview at 3.25s, after the rise finishes at 3.2s and before the fade at 3.3s. Timing, peak offset, and page positions are unchanged. Strokes use the existing champagne gold `#a8925e`, with the inner ring of D in `#c6a56e`.

The monogram sits at `x="600" y="493"`. Ornaments are drawn in the same riser, just before the monogram, so they travel with the letter.

## A — single hairlines

```svg
<path d="M470 406 H730" fill="none" stroke="#a8925e" stroke-width="2.2" stroke-linecap="round" />
<path d="M470 580 H730" fill="none" stroke="#a8925e" stroke-width="2.2" stroke-linecap="round" />
```

## B — double rules with a centre diamond

```svg
<path d="M505 378 H555 M645 378 H695" fill="none" stroke="#a8925e" stroke-width="1.5" stroke-linecap="round" />
<path d="M490 394 H710" fill="none" stroke="#a8925e" stroke-width="1.5" stroke-linecap="round" />
<path d="M505 592 H555 M645 592 H695" fill="none" stroke="#a8925e" stroke-width="1.5" stroke-linecap="round" />
<path d="M490 608 H710" fill="none" stroke="#a8925e" stroke-width="1.5" stroke-linecap="round" />
<path d="M600 370 l4.6 7 -4.6 7 -4.6 -7 Z" fill="#a8925e" />
<path d="M600 584 l4.6 7 -4.6 7 -4.6 -7 Z" fill="#a8925e" />
```

## C — thin gold circle

```svg
<circle cx="599" cy="493" r="120" fill="none" stroke="#a8925e" stroke-width="2.2" />
```

## D — double gold ring

```svg
<circle cx="599" cy="493" r="127" fill="none" stroke="#a8925e" stroke-width="2" />
<circle cx="599" cy="493" r="118" fill="none" stroke="#c6a56e" stroke-width="1" />
```

## E — circle with side marks

```svg
<circle cx="599" cy="493" r="118" fill="none" stroke="#a8925e" stroke-width="2" />
<path d="M462 493 H478 M720 493 H736" fill="none" stroke="#a8925e" stroke-width="2" stroke-linecap="round" />
<circle cx="454" cy="493" r="3.1" fill="#a8925e" />
<circle cx="744" cy="493" r="3.1" fill="#a8925e" />
```
