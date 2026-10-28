import { a } from './shared.jsx'

// Background-free cutouts framed alike (same head size and position) over each card's colour
export const ORGANIZERS = [
  { name: 'SRI ANUMULA REVANTH REDDY', role: ['Chief Minister of Telangana'], bg: '#db5f3d', img: 'organizers/revanth-reddy.webp' },
  { name: 'SRI BHATTI VIKRAMARKA MALLU', role: ['Deputy Chief Minister, Telangana'], bg: '#c8a046', img: 'organizers/bhatti-vikramarka.webp' },
  { name: 'SRI DUDDILLA SRIDHAR BABU', role: ['Minister for Information', 'Technology, Telangana'], bg: '#105755', img: 'organizers/sridhar-babu.webp' },
  { name: 'SRI NALAMADA UTTAM KUMAR REDDY', role: ['Minister for Irrigation and CAD,', 'Telangana'], bg: '#13345f', img: 'organizers/uttam-kumar-reddy.webp' },
]

export const ORGANIZER_PROFILES = ORGANIZERS.map((o) => ({
  name: o.name,
  role: o.role.join(' '),
  bio: `${o.role.join(' ')}, and one of the organisers of Bharat Summit 2026, hosted by the Government of Telangana.`,
  bg: o.bg,
  img: a(o.img),
}))
