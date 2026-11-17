import HomeHeader from "../components/full-screen-header2";
import FooterSecondary from "../components/home2/footer-secondary";
import ScrollMotion from "../components/home3/scroll-motion";

export const metadata = {
  title: "About Le Coup de Foudre | Paris",
  description:
    "Meet the founders of Le Coup de Foudre, an experience and hospitality agency based in Paris.",
};

const founders = [
  {
    name: "Justina Socas",
    image:
      "/images/about-us/Justina-Fashion-Expert.png",
    alt: "Portrait of a woman in a gallery",
    text: "Born in Buenos Aires, the daughter of a professional polo player and an interior designer, Justina was raised between Argentina, Spain and England. An art historian, she graduated summa cum laude and holds a master's degree in curating the visual arts.",
    more: "Before co-founding Le Coup de Foudre, she worked as a fashion stylist in New York, Buenos Aires and Paris, and in an art gallery. For Justina, fashion, design and art have always been intertwined, approached through a cultural lens with the depth of a historian.",
  },
  {
    name: "Clément Le Coz",
    image:
      "/images/about-us/flea-market-square.png",
    alt: "Portrait of a man",
    text: "Clément is a Parisian curator and artistic director, born in the city he now opens to others. Paris is his playground and his address book: chefs, restaurant and bar owners, artists and fashion designers he counts as friends rather than contacts.",
    more: "Curious by nature and passionate about set design, he composes every experience like a scene. Ten years working with luxury brands and private clients taught him the art of anticipating every wish. His other city is Buenos Aires, where he lived for eleven years, met Justina and wrote Ma Vie à Buenos Aires.",
  },
];

export default function AboutUsPage() {
  return (
    <ScrollMotion className="editorial-page editorial-page--about">
      <HomeHeader />
      <main>
        <section className="about-hero" aria-labelledby="about-title">
          <div data-enter>
            <p>Le Coup de Foudre · Paris & Buenos Aires</p>
            <h1 id="about-title">
              The
              <br />
              <em>Founders</em>
            </h1>
            <span>Two perspectives, one shared sense of place.</span>
          </div>
          <div className="about-hero__image editorial-reveal"><Image src="/images/about-us/clement-justina-table.jpg" alt="Friends gathered around a table" fill priority sizes="(max-width: 760px) 100vw, 53vw" unoptimized /></div>
        </section>
        <section className="founders" aria-label="Founder biographies">
          {founders.map((founder, index) => (
            <article className={`founder founder--${index}`} key={founder.name}>
              <div className="founder__portrait editorial-reveal"><Image src={founder.image} alt={founder.alt} fill sizes="(max-width: 760px) 100vw, 42vw" unoptimized /></div>
              <div className="founder__copy">
                <h2 className={founder.name === "Clément Le Coz" ? "founder__name--single-line" : ""}>{founder.name}</h2>
                <p>{founder.text}</p>
                <p>{founder.more}</p>
              </div>
            </article>
          ))}
        </section>
        <section className="about-together" aria-labelledby="together-title" style={{ "--editorial-image": "url('/images/about-us/img-intro.webp')" }}>
          <div>
            <h2 id="together-title">Together</h2>
            <p>
              Together, Justina and Clément founded Le Coup de Foudre, creating
              fashion and design experiences, journeys across France and
              Argentina, and stays in iconic houses and apartments.
            </p>
            <p>
              Between Paris and Buenos Aires, the same thread runs through
              everything we do: elegance, curiosity and the joy of human
              connection.
            </p>
          </div>
        </section>
        <section
          className="about-clients editorial-section"
          aria-labelledby="clients-title"
        >
          <h2 id="clients-title">Who we work with</h2>
          <p>
            We curate journeys and experiences in France and Argentina for
            private clients, travel advisors and companies.
          </p>
          <a className="button" href="/#journey-request">
            Write to us
          </a>
        </section>
      </main>
      <FooterSecondary />
    </ScrollMotion>
  );
}
import Image from "next/image";
