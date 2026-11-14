import { a } from './shared.jsx'
import { Link, usePath } from '../lib/router.jsx'
import FooterScene from './FooterScene.jsx'
import './footer.css'

const icon = (name) => a(`footer/${name}.svg`)

// Same targets and order as the header menu
const NAV_LINKS = [
  { label: 'Home', page: '/', color: 'var(--coral)' },
  { label: 'About Us', page: '/about-us', color: 'var(--teal)' },
  { label: 'Schedule', page: '/schedule', color: 'var(--saffron)' },
  { label: 'Speakers', page: '/speakers', color: 'var(--coral)' },
  { label: 'Summit Gallery', page: '/summit-gallery', color: 'var(--teal)' },
]

// shortcut: generic platform URLs, replace with the real Bharat Summit profile links before launch
const SOCIAL_LINKS = [
  { label: 'Facebook', href: 'https://www.facebook.com/bharatsummit2025', icon: icon('facebook') },
  { label: 'Instagram', href: 'https://www.instagram.com/bharat_summit', icon: icon('instagram') },
  { label: 'X', href: 'https://x.com/Bharat_Summit', icon: icon('x') },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/bharatsummit/', icon: icon('linkedin') },
  { label: 'YouTube', href: 'https://www.youtube.com/@Bharat_Summit', icon: icon('youtube') },
]

const CONTACT = {
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=HICC+Kondapur+Hyderabad',
  email: 'info@bharatsummit.co',
}

const YEAR = new Date().getFullYear()

// On the About page a section is a plain jump; from elsewhere go to the page and its section
function FooterNavLink({ label, section, page, color }) {
  const onAbout = usePath().replace(/\/$/, '') === '/about-us'
  const style = { '--underline': color }
  if (page) return <Link to={page} style={style}>{label}</Link>
  if (section && onAbout) return <a href={`#${section}`} style={style}>{label}</a>
  return (
    <Link to={section ? `/about-us#${section}` : '/about-us'} style={style}>
      {label}
    </Link>
  )
}

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-stage">
        <FooterScene />

        <div className="footer-main">
          <div className="footer-brand">
            <Link to="/" className="footer-logo" aria-label="Bharat Summit home">
              <img className="brand-logo" src={a('logo.svg')} alt="" width="52" height="52" />
              <span className="footer-wordmark">
                <span className="footer-wordmark-name">BHARAT SUMMIT</span>
                <span className="footer-wordmark-tagline">FORGING A NEW WORLD</span>
              </span>
            </Link>

            <ul className="footer-social">
              {SOCIAL_LINKS.map(({ label, href, icon }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                    <img src={icon} alt="" width="20" height="20" />
                  </a>
                </li>
              ))}
            </ul>

            <nav className="footer-nav" aria-label="Footer">
              <ul>
                {NAV_LINKS.map((link) => (
                  <li key={link.label}>
                    <FooterNavLink {...link} />
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <address className="footer-contact" id="contact">
            <h2>Connect</h2>
            <ul>
              <li>
                <img src={icon('location')} alt="" width="26" height="30" />
                <a href={CONTACT.mapUrl} target="_blank" rel="noopener noreferrer">
                  HICC, Kondapur,
                  <br />
                  Hyderabad, Telangana, India
                </a>
              </li>
              <li>
                <img src={icon('email')} alt="" width="28" height="28" />
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              </li>
            </ul>
          </address>
        </div>
      </div>

      <div className="footer-legal">
        <ul className="footer-legal-links">
          <li>© {YEAR} Bharat Summit</li>
          {/* shortcut: no Terms/Privacy pages yet, so these fall back to the home page; add the pages before launch */}
          <li>
            <Link to="/terms">Terms &amp; Conditions</Link>
          </li>
          <li>
            <Link to="/privacy">Privacy Policy</Link>
          </li>
        </ul>
        <p className="footer-promise">
          <span className="footer-palette" aria-hidden="true" />A MORE INCLUSIVE TOMORROW
        </p>
      </div>
    </footer>
  )
}
