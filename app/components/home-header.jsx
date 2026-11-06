import BrandMark from "./brand-mark";

export default function HomeHeader() {
  return <header className="site-header"><details className="mobile-menu"><summary>Menu</summary><nav aria-label="Main navigation" className="mobile-menu__links"><a href="#experiences">Experiences</a><a href="#journeys">Journeys</a><a href="#maison">The maison</a><a href="#journey-request">Concierge</a></nav></details><nav className="desktop-nav" aria-label="Main navigation"><a href="#experiences">Experiences</a><a href="#journeys">Journeys</a></nav><BrandMark className="brand-mark" /><a className="header-concierge" href="#journey-request">Concierge <span aria-hidden="true">↗</span></a></header>;
}
