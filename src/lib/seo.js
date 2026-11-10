// Per-page title, description, canonical link and share tags. index.html holds the home page's tags; on each
// page change these overwrite them in place (no duplicates), so Google, which runs the JavaScript, sees each
// page's own. Link previews (WhatsApp, Facebook, X) don't run it and always show the home page's tags.
const SITE = 'https://bharatsummit.co'
const NAME = 'Bharat Summit 2026'

const PAGES = {
  home: {
    title: `${NAME} | Forging a New World`,
    description: 'Bharat Summit 2026, 13–14 November at HICC, Hyderabad: hosted by the Government of Telangana, bringing together progressive leaders, policymakers and thinkers from across the world under the theme “Forging a New World”.',
  },
  about: {
    title: `About Us · ${NAME}`,
    description: 'Bharat Summit is a global platform, hosted by the Government of Telangana in Hyderabad, bringing together progressive leaders, policymakers and thinkers to address challenges facing democracy, global governance and social and economic justice.',
  },
  speakers: {
    title: `Speakers · ${NAME}`,
    description: 'Meet the world leaders, distinguished thinkers and influential voices speaking at Bharat Summit 2026, 13–14 November at HICC, Hyderabad.',
  },
  schedule: {
    title: `Agenda & Schedule · ${NAME}`,
    description: 'Agenda and schedule of Bharat Summit 2026: plenary sessions, panel discussions, Telangana Rising panels and exhibitions at HICC, Hyderabad.',
  },
  events: {
    title: `Summit Gallery · ${NAME}`,
    description: 'Photos and videos from Bharat Summit, the global gathering of progressive leaders hosted by the Government of Telangana in Hyderabad.',
  },
}

const set = (selector, attr, value) => document.head.querySelector(selector)?.setAttribute(attr, value)

// page: a key of PAGES; speaker: the open speaker profile, if any; path: the page's address, '' for home
export function applyPageMeta(page, speaker, path) {
  const { title, description } = speaker
    ? { title: `${speaker.name} · ${NAME}`, description: `${speaker.name}, ${speaker.role}, speaks at ${speaker.session}, ${NAME}, Hyderabad.` }
    : PAGES[page] ?? PAGES.home
  const url = SITE + (path || '/')
  document.title = title
  set('meta[name=description]', 'content', description)
  set('link[rel=canonical]', 'href', url)
  set('meta[property="og:title"]', 'content', title)
  set('meta[property="og:description"]', 'content', description)
  set('meta[property="og:url"]', 'content', url)
  set('meta[name="twitter:title"]', 'content', title)
  set('meta[name="twitter:description"]', 'content', description)
}
