import Image from "next/image";
import experiences from "./experiences-data";

export default function HomeExperiences() {
  return <section className="experiences section" id="experiences" aria-labelledby="experiences-title"><div className="section-heading"><div><h2 id="experiences-title">The experiences</h2></div><p className="section-heading__note">Culture, craft and places opened through a personal point of view.</p></div><div className="experience-band">{experiences.map((experience, index) => <article className={`experience ${experience.className}`} key={experience.title}><div className="experience__image"><Image src={experience.image} alt={experience.alt} fill sizes="(max-width: 700px) 50vw, 42vw" unoptimized />{index === 0 ? <span className="experience__image-note">A French art de vivre</span> : null}</div><div className="experience__caption"><h3>{experience.title}</h3><span>{experience.category}</span></div></article>)}</div></section>;
}
