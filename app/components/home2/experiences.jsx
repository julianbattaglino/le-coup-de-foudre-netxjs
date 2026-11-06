import ExperienceStrip from "../../home2/experience-strip";

const experiences = [
  { title: "Les Coulisses de la Mode", category: "Couture", image: "https://images.unsplash.com/photo-1743671578751-323cc61cd54d?auto=format&fit=crop&w=1000&q=85", alt: "A gilded Parisian salon prepared for a private visit", shape: "home2-experience--tall" },
  { title: "Les Archives Secrètes", category: "Couture & patrimoine", image: "https://images.unsplash.com/photo-1695596255549-5bea851362ab?auto=format&fit=crop&w=1200&q=85", alt: "Historic French interiors and their collected details", shape: "home2-experience--wide" },
  { title: "Trésors d’Hier", category: "Vintage & antiques", image: "https://images.unsplash.com/photo-1551568697-4b520d9743f4?auto=format&fit=crop&w=1000&q=85", alt: "French formal gardens in a quiet afternoon light", shape: "home2-experience--tall" },
  { title: "Maisons de Collection", category: "Art de vivre", image: "https://images.unsplash.com/photo-1667385703635-11e293ac22f4?auto=format&fit=crop&w=1200&q=85", alt: "A château set among the gardens of the Loire Valley", shape: "home2-experience--wide" },
];

export default function Home2Experiences() {
  return <section className="home2-experiences" id="experiences" aria-labelledby="home2-experiences-title"><div className="home2-section-head"><div><h2 id="home2-experiences-title">The Experiences</h2><p>We open the doors everyone knows — and the ones no one does.</p></div><span className="home2-overline">Paris, seen from within</span></div><ExperienceStrip items={experiences} /></section>;
}
