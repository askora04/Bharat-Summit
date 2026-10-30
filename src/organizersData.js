import { a } from './shared.jsx'

// Background-free cutouts framed alike (same head size and position) over each card's colour.
// bio: the profile's text; highlight: the part of it shown in bold, the person's name
export const ORGANIZERS = [
  { name: 'SRI ANUMULA REVANTH REDDY', bg: '#db5f3d', img: 'organizers/revanth-reddy.webp',
    bio: 'Anumula Revanth Reddy is an Indian politician who is serving as the second and current Chief Minister of Telangana. He is also the minister for Municipal Administration and Urban Development, General Administration, Law & Order.',
    highlight: 'Anumula Revanth Reddy' },
  { name: 'SRI BHATTI VIKRAMARKA MALLU', bg: '#c8a046', img: 'organizers/bhatti-vikramarka.webp',
    bio: 'Mallu Bhatti Vikramarka is currently serving as the Deputy Chief Minister of Telangana since December 2023. He represents Madhira constituency in the Telangana Legislative assembly.',
    highlight: 'Mallu Bhatti Vikramarka' },
  { name: 'SRI DUDDILLA SRIDHAR BABU', bg: '#105755', img: 'organizers/sridhar-babu.webp',
    bio: 'Duddilla Sridhar Babu is Minister in the Telangana Government holding the crucial portfolios of Information Technology, Electronics & Communication, Industry & Commerce and Legislative Affairs.',
    highlight: 'Duddilla Sridhar Babu' },
  { name: 'SRI NALAMADA UTTAM KUMAR REDDY', bg: '#13345f', img: 'organizers/uttam-kumar-reddy.webp',
    bio: 'Nalamada Uttam Kumar Reddy is Minister of Irrigation, Food & Civil Supplies in Government of Telangana.',
    highlight: 'Nalamada Uttam Kumar Reddy' },
]

export const ORGANIZER_PROFILES = ORGANIZERS.map((o) => ({
  name: o.name,
  bio: o.bio,
  highlight: o.highlight,
  bg: o.bg,
  img: a(o.img),
}))
