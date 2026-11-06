import Image from "next/image";

const pillars = [
  { title: "Private Journeys", label: "Paris & régions", copy: "Journeys across France, designed around you, from fine addresses to confidential ateliers.", image: "https://images.unsplash.com/photo-1699303088143-b04d23643bd9?auto=format&fit=crop&w=900&q=85", alt: "Formal gardens at Versailles", href: "#journey-request" },
  { title: "Gatherings", label: "A moment together", copy: "Seasonal occasions and intimate celebrations, planned with care and quiet character.", image: "https://images.unsplash.com/photo-1743671578751-323cc61cd54d?auto=format&fit=crop&w=900&q=85", alt: "A chandelier-lit salon ready for a gathering", href: "#journey-request" },
  { title: "Collective Journeys", label: "For curious teams", copy: "Experiences across France for your teams, clients and partners.", image: "https://images.unsplash.com/photo-1551568697-4b520d9743f4?auto=format&fit=crop&w=900&q=85", alt: "A garden path framed by clipped hedges", href: "#journey-request" },
];

export default function Home2Pillars() {
  return <section className="home2-pillars" id="pillars" aria-labelledby="home2-pillars-title"><div className="home2-center-head"><span className="home2-overline">Trois fondations</span><h2 id="home2-pillars-title">Curated Pillars</h2></div><div className="home2-pillar-grid">{pillars.map((pillar, index) => <article className="home2-pillar" key={pillar.title}><div className="home2-pillar__image">{index === 0 ? <div className="home2-arch-mark"><span>✳</span><small>Pillar · 01</small><strong>Paris &amp;<br />régions</strong></div> : <Image src={pillar.image} alt={pillar.alt} fill sizes="(max-width: 700px) 90vw, 28vw" unoptimized />}</div><div className="home2-pillar__body"><span className="home2-overline">{pillar.label}</span><h3>{pillar.title}</h3><p>{pillar.copy}</p><a className="home2-button" href={pillar.href}>Discover</a></div></article>)}</div></section>;
}
