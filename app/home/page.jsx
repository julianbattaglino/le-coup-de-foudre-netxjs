import Image from "next/image";
import Link from "next/link";
import FoilCard from "../components/foil-card";
import FooterSecondary from "../components/footer-secondary";
import HomeHeader from "../components/full-screen-header2";
import ScrollMotion from "../components/scroll-motion";
import pressData from "../../data/press.json";

export const metadata = {
  title: "Le Coup de Foudre — Experience & Hospitality Agency based in Paris",
  description: "An experience and hospitality agency based in Paris: private experiences in fashion, design and art across France, group journeys, and a collection of Paris apartments with concierge service.",
};

const experiences = [
  ["Fashion & design", "Styling sessions with a fashion expert, private visits to showrooms and designers beyond the usual circuit, and the hidden world of Parisian vintage and antique jewellery.", "/images/about-us/Justina-Fashion-Expert.png", "Fashion expert in a Parisian interior"],
  ["Art & culture", "Private visits with gallerists, artists in their studios, and private collections rarely open to the public.", "/images/destinations/paris-proposal/day-2.png", "Parisian art collection"],
  ["Craftsmanship & savoir-faire", "Private visits to ateliers of master artisans, cabinetmakers, gilders and embroiderers working with the great luxury houses.", "/images/about-us/flea-market-square.png", "French decorative arts"],
  ["Iconic places", "Châteaux, vineyards, Parisian apartments and hôtels particuliers, villas and gardens.", "/images/destinations/paris-proposal/day-3.png", "An iconic French interior"],
];
const hospitality = [
  ["A stay with character", "A curated collection of Paris apartments, for a few nights or a longer pied-à-terre.", "/images/about-us/clement-justina-table.jpg", "A Paris apartment dining room"],
  ["Our concierge", "An insider's Paris, from tables worth booking to ateliers, dealers, galleries and fashion addresses.", "/images/destinations/paris-proposal/curators.webp", "Curated objects in a Paris interior"],
  ["A personal Paris", "Our guests receive our personal list of things to do, and the reservations to go with it.", "/images/destinations/paris-proposal/day-1.png", "A quietly elegant Paris residence"],
];

function Cards({ items }) {
  return <div className="home-proposal__card-row">{items.map(([title, copy, image, alt]) => <FoilCard className="home-proposal__feature-card" key={title}><img src={image} alt={alt} /><div><h3>{title}</h3><p>{copy}</p></div></FoilCard>)}</div>;
}

function Place({ id, label, title, image, href, action, children }) {
  return <section id={id} className="home-proposal__place" style={{ backgroundImage: `url('${image}')` }}><div><p>{label}</p><h2>{title}</h2><span>{children}</span><Link href={href} className="home-proposal__button home-proposal__button--light">{action}</Link></div></section>;
}

export default function Home() {
  const press = [...pressData.articles].sort((a, b) => b.year - a.year).slice(0, 4);
  return <ScrollMotion className="home-proposal"><HomeHeader /><main>
    <section className="home-proposal__hero" aria-labelledby="home-title"><div className="home-proposal__hero-copy" data-enter><p>Le Coup de Foudre · Paris</p><h1 id="home-title">Bespoke experiences and hospitality in France</h1><span>An experience and hospitality agency based in Paris. Private experiences through French savoir-faire, from Paris to the South of France.</span><Link href="#conversation" className="home-proposal__button home-proposal__button--light">Begin a conversation</Link></div></section>
    <section className="home-proposal__introduction" aria-labelledby="introduction-title"><p>Introduction</p><div><h2 id="introduction-title">France is our home, and the heart of what we do.</h2><p>Le Coup de Foudre is an experience and hospitality agency based in Paris, founded by Clément Le Coz and Justina Socas.</p><p>Above all in Paris and the South of France, we curate bespoke journeys around fashion, interior design, art, craftsmanship and savoir-faire, opening the doors of showrooms, ateliers, galleries and private collections. Each journey is designed for the people who will live it, and no two are ever alike.</p><p>In Argentina, our knowledge runs just as deep. Justina comes from one of the pioneer families of Patagonia and from a family of professional polo players, and the world of the estancias is her own.</p></div></section>
    <section className="home-proposal__collection" id="experiences"><div className="home-proposal__heading"><p>Our savoir-faire</p><h2>Experiences</h2></div><Cards items={experiences} /></section>
    <section className="home-proposal__collection home-proposal__collection--dark" id="hospitality"><div className="home-proposal__heading"><p>Hospitality</p><h2>Paris apartments, with our concierge</h2><span>A curated collection of apartments in Paris, for a few nights or a longer pied-à-terre. Each stay comes with a hotel-style service and our concierge: the address book we have built over the years.</span></div><Cards items={hospitality} /><Link href="/contact-us" className="home-proposal__button home-proposal__button--light">Discover the apartments</Link></section>
    <Place id="france" label="France" title="France, our home" image="/images/destinations/paris-proposal/day-5.png" href="/destinations" action="Discover France">Fashion, design, art and the art of living. Our experiences take place above all in Paris and the South of France, from Provence to the Riviera, and further afield in Champagne, Burgundy, Bordeaux and Normandy.</Place>
    <Place label="Argentina" title="And further afield, Argentina" image="/images/about-us/img-intro.webp" href="/destinations/argentina/patagonia-andina" action="Discover Argentina">Where our story began. For a few travellers each season, we open the Argentina we know from the inside: Buenos Aires, the Pampas, Patagonia and the North of Argentina, with an escape to José Ignacio, in Uruguay.</Place>
    <section className="home-proposal__destinations"><p>Paris · Provence · The Riviera · Champagne · Burgundy · Bordeaux</p><h2>Where we take you</h2><Link href="/destinations" className="home-proposal__button">See all destinations</Link></section>
    <section className="home-proposal__press"><div className="home-proposal__heading"><p>In the press</p><h2>In the pages of the world’s journals</h2></div><div className="home-proposal__press-row">{press.map((article) => <FoilCard className="home-proposal__press-card" key={article.id}><a href={article.url} target="_blank" rel="noreferrer"><Image src={article.image} alt={article.imageAlt} fill unoptimized style={{ objectFit: article.imageFit === "contain" ? "contain" : "cover" }} /><span>{article.publication} · {article.year}</span></a></FoilCard>)}</div><Link href="/press" className="home-proposal__button">Explore all press</Link></section>
    <section className="home-proposal__conversation" id="conversation"><p>Begin a conversation</p><h2>Tell us what draws you to France.</h2><Link href="/contact-us" className="home-proposal__button home-proposal__button--light">Contact us</Link></section>
  </main><FooterSecondary /></ScrollMotion>;
}
