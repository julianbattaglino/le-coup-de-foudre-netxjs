import BrandMark from "./brand-mark";

export default function Home2Header() {
  return (
    <header className="home2-header">
      <details className="home2-menu">
        <summary>Menu <span aria-hidden="true">＋</span></summary>
        <nav aria-label="Mobile navigation">
          <a href="#experiences">Experiences</a><a href="#pillars">Journeys</a><a href="#maison">The maison</a><a href="#journey-request">Concierge</a>
        </nav>
      </details>
      <nav className="home2-nav" aria-label="Main navigation">
        <a href="#pillars">Private journeys</a><a href="#experiences">Gatherings</a><a href="#maison">The maison</a>
      </nav>
      <BrandMark className="home2-wordmark" />
      <a className="home2-concierge" href="#journey-request">Concierge <span aria-hidden="true">↗</span></a>
    </header>
  );
}
