import BrandMark from "../brand-mark";

export default function FooterSecondary() {
  return (
    <footer className="home3-footer" aria-label="Footer">
      <div className="home3-footer__brand">
        <BrandMark className="home2-wordmark" inverse />
        <p className="home3-footer__signature">Atelier de Maison Hospitalité · Paris</p>
        <p>
          Curated journeys, gatherings and private encounters across France,
          Argentina and Uruguay.
        </p>
        <address className="home3-footer__contact">
          <span>Pont Alexandre III, 75007 Paris</span>
          <a href="mailto:contact@lecoupdefoudre-paris.com">
            contact@lecoupdefoudre-paris.com
          </a>
          <a href="tel:+33660612882">+33 6 60 61 28 82</a>
        </address>
      </div>

      <nav className="home3-footer__column" aria-label="Curated experiences">
        <span>Curated Experiences</span>
        <a href="/#journeys">Private Journeys</a>
        <a href="/#journeys">Gatherings</a>
        <a href="/#journeys">Collective Journeys</a>
        <a href="/#maison">The Maison</a>
      </nav>

      <nav className="home3-footer__column" aria-label="Destinations">
        <span>Destinations</span>
        <a href="/destinations/france/paris">Paris</a>
        <a href="/destinations/argentina/patagonia-andina">Patagonia</a>
        <a href="/destinations/france/normandy">Normandy</a>
        <a href="/destinations">All destinations</a>
      </nav>

      <div className="home3-footer__column">
        <span>Dispatch &amp; Reach</span>
        <a href="mailto:contact@lecoupdefoudre-paris.com?subject=Press%20inquiry">
          Press
        </a>
        <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
          Instagram
        </a>
        <a href="/#journey-request">Contact</a>
      </div>

      <div className="home3-footer__newsletter">
        <span>Newsletter</span>
        <p>Privileged dispatches from our Parisian salon.</p>
        <form
          action="mailto:contact@lecoupdefoudre-paris.com"
          method="post"
          encType="text/plain"
        >
          <label htmlFor="footer-newsletter-email">Your email address</label>
          <div className="home3-footer__form-row">
            <input
              id="footer-newsletter-email"
              name="email"
              type="email"
              placeholder="Email address"
              autoComplete="email"
              required
            />
            <button type="submit" aria-label="Subscribe to the newsletter">
              Subscribe <span aria-hidden="true">→</span>
            </button>
          </div>
        </form>
      </div>

      <div className="home3-footer__bottom">
        <span>© Le Coup de Foudre Paris · All rights reserved</span>
        <span>
          <a href="https://unsplash.com/license" target="_blank" rel="noreferrer">
            Images via Unsplash
          </a>
          <a href="/#top">Legal notice</a>
          <a href="/#top">Privacy</a>
          <a href="mailto:contact@lecoupdefoudre-paris.com">Contact</a>
        </span>
      </div>
    </footer>
  );
}
