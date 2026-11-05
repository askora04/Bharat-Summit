// Public agenda, from "Bharat Summit 2026 — Public Agenda & Schedule" (tentative programme).

// Session themes, each with a brand colour from the colour sheet
// color: the theme's brand colour; ink: a darker shade of it that reads on white
export const THEMES = {
  india: { name: 'India and the World', color: '#fbaa12', ink: '#a86400' },
  tech: { name: 'Technology, Cloud Capitalism & AI', color: '#39cfdc', ink: '#0e7f8c' },
  economic: { name: 'Economic Justice — Inequality and New Political Economy', color: '#ef7047', ink: '#bf4a22' },
  social: { name: 'Social Justice — People Power', color: '#24afa0', ink: '#16796e' },
  security: { name: 'Security, Multilateralism and Geopolitics', color: '#13345f', ink: '#13345f' },
  political: { name: 'Political Justice — Democracy, Networks & Progressivism', color: '#231f20', ink: '#231f20' },
}

// kind: 'plenary' and 'valedictory' get the featured card; label is the small tag above the title
export const DAYS = [
  {
    id: 'day-0', tab: 'Day 0', short: 'Thu 12 Nov', date: 'Thursday, 12 November 2026',
    sessions: [
      { time: '1:00–6:00 PM', kind: 'visit', label: 'Optional', title: 'Expo & Field Visit',
        desc: 'Optional field visit to sites of historical and political importance in Telangana.' },
      { time: '7:00 PM', kind: 'expo', label: 'Exhibition', title: 'Indian Handicrafts Exhibition',
        desc: 'Exhibition and sale of Indian handicrafts.' },
    ],
  },
  {
    id: 'day-1', tab: 'Day 1', short: 'Fri 13 Nov', date: 'Friday, 13 November 2026',
    sessions: [
      { time: '10:30–11:30 AM', kind: 'plenary', label: 'Plenary', title: 'Navigating the New World Order — View from India', theme: 'india' },
      { time: '11:30 AM–12:30 PM', kind: 'expo', label: 'Expo Exhibition', title: 'India and the World', theme: 'india',
        desc: '140 years of the Indian National Congress; India and the world maps; interactive booths; rights-based programmes; flagship programmes of Telangana and other INC state governments.' },
      { time: '1:30–2:30 PM', kind: 'panel', label: 'Panel 1', title: 'AI, Cloud Capitalism & the New World Order', theme: 'tech',
        desc: 'How technology, artificial intelligence and concentrated digital capital shape economic and geopolitical power.' },
      { time: '1:30–2:30 PM', kind: 'panel', label: 'Panel 2', title: 'A New Economic Deal for the World', theme: 'economic',
        desc: 'A fairer global economy focused on jobs, wages, taxation, public investment, welfare and opportunity.' },
      { time: '1:30–2:30 PM', kind: 'panel', label: 'Panel 3', title: 'Youth & Politics of Tomorrow', theme: 'social',
        desc: 'Youth participation, political organising and the demands shaping the future of progressive politics.' },
      { time: '3:00–4:00 PM', kind: 'panel', label: 'Panel 4', title: 'South–South Cooperation in a New World Order', theme: 'social',
        desc: 'Strengthening political partnerships and shared interests across the Global South.' },
      { time: '3:00–4:00 PM', kind: 'panel', label: 'Panel 5', title: 'Climate Change', theme: 'economic',
        desc: 'Climate finance, technology, adaptation and a fair transition that does not place disproportionate costs on poorer societies.' },
      { time: '4:00–5:15 PM', kind: 'panel', label: 'Panel 6', title: 'Reform of Multilateral Institutions', theme: 'security',
        desc: 'Reimagining the United Nations and global institutions for a more representative international order.' },
      { time: '4:00–5:15 PM', kind: 'panel', label: 'Panel 7', title: 'Gender Justice & a Feminist Future', theme: 'social',
        desc: 'Advancing gender justice through policy, institutions, safety, representation and economic independence.' },
    ],
  },
  {
    id: 'day-2', tab: 'Day 2', short: 'Sat 14 Nov', date: 'Saturday, 14 November 2026',
    sessions: [
      { time: '10:30–11:30 AM', kind: 'panel', label: 'Panel 8', title: 'Progressivism & Accountability', theme: 'political',
        desc: 'Building responsive, aspirational progressive politics that champions people’s voices and shares innovative political practices.' },
      { time: '10:30–11:30 AM', kind: 'panel', label: 'Panel 9', title: 'Innovative Ideas for Progressives', theme: 'social',
        desc: 'New approaches to organising, campaigning and political communication in a challenging democratic environment.' },
      { time: '1:00–2:00 PM', kind: 'panel', label: 'Panel 10', title: 'The New World Order', theme: 'security',
        desc: 'How shifting alliances, economic competition and technological rivalry are reshaping global power.' },
      { time: '1:00–2:00 PM', kind: 'panel', label: 'Panel 11', title: 'Peace in the New World Order', theme: 'security',
        desc: 'Conflict prevention, diplomacy and approaches to building durable peace.' },
      { time: '1:00–2:00 PM', kind: 'panel', label: 'Panel 12', title: 'The Future of Media', theme: 'tech',
        desc: 'The changing media landscape, public discourse, journalism, political communication and press freedoms.' },
      { time: '2:30–5:30 PM', kind: 'valedictory', label: 'Valedictory Session', title: 'Delivering Global Justice', theme: 'india',
        desc: 'A concluding dialogue on commitments, partnerships and ideas for a new world order.' },
    ],
  },
]

// Expo & Exhibitions, listed apart from the daily programme
export const EXHIBITIONS = [
  { date: '13–14 November', title: 'India and the World Exhibition', theme: 'india',
    desc: 'An exhibition on 140 years of the Indian National Congress, India and the world maps, interactive public-engagement booths, rights-based programmes and flagship initiatives.' },
  { date: '12 November', title: 'Indian Handicrafts Exhibition',
    desc: 'Exhibition and sale of Indian handicrafts.' },
]
