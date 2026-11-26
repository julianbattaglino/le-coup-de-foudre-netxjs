import Image from "next/image";

export default function Home2Hero() {
  return <section className="home2-hero" aria-labelledby="home2-title"><div className="home2-hero__inner"><div className="home2-hero__copy"><p className="home2-kicker"><span /> Atelier de curations · Paris</p><h1 id="home2-title">Private<br />Journeys</h1><p className="home2-hero__lead">Through French savoir-faire · A design &amp; hospitality maison, based in Paris.</p><div className="home2-hero__actions"><a className="home2-button home2-button--light" href="#experiences">Discover</a><span>Paris &amp; châteaux</span></div></div><figure className="home2-hero__image"><Image src="https://images.unsplash.com/photo-1743671578751-323cc61cd54d?auto=format&fit=crop&w=1300&q=85" alt="A gilded Parisian salon with chandeliers and tall windows" fill priority sizes="(max-width: 760px) 88vw, 40vw" unoptimized /><figcaption><span>Maison archives</span><em>Salons privés</em></figcaption></figure></div></section>;
}
