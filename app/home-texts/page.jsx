import HomeHeader from "../components/full-screen-header2";
import FooterSecondary from "../components/home2/footer-secondary";
import ScrollMotion from "../components/home3/scroll-motion";
import HomeTextsExperienceSlider from "../components/home-texts/experience-slider";

export const metadata = {
  title: "Bespoke experiences and hospitality in France | Le Coup de Foudre",
  description:
    "Private experiences through French savoir-faire, from Paris to the South of France.",
};

export default function HomeTextsPage() {
  return (
    <ScrollMotion className="editorial-page">
      <HomeHeader />
      <main>
        <section
          className="editorial-hero editorial-hero--home"
          aria-labelledby="home-texts-title"
          style={{
            "--editorial-image":
              "url('https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=2200&q=85')",
          }}
        >
          <div className="editorial-hero__veil" />
          <div className="editorial-hero__content" data-enter>
            <h1 id="home-texts-title">
              Bespoke experiences and hospitality in France
            </h1>
            <div>
              <span>
                An experience and hospitality agency based in Paris. Private
                experiences through French savoir-faire, from Paris to the South
                of France.
              </span>
              <a className="button button--light" href="#conversation">
                Begin a conversation
              </a>
            </div>
          </div>
        </section>

        <section
          className="editorial-intro editorial-section"
          aria-labelledby="introduction-title"
        >
          <h2 id="introduction-title">Introduction</h2>
          <div>
            <p>
              Le Coup de Foudre is an experience and hospitality agency based in
              Paris, founded by Clément Le Coz and Justina Socas.
            </p>
            <p>
              France is our home and the heart of what we do. Above all in Paris
              and the South of France, we curate bespoke journeys around
              fashion, interior design, art, craftsmanship and savoir-faire,
              opening the doors of showrooms, ateliers, galleries and private
              collections. Each journey is designed for the people who will live
              it, and no two are ever alike.
            </p>
            <p>
              In Argentina, our knowledge runs just as deep. Justina comes from
              one of the pioneer families of Patagonia and from a family of
              professional polo players, and the world of the estancias is her
              own. Clément lived in Buenos Aires for eleven years and wrote a
              book about it, Ma Vie à Buenos Aires. He knows its streets and the
              characters who make the city so singular.
            </p>
          </div>
        </section>

        <HomeTextsExperienceSlider />

        <section
          className="editorial-feature editorial-feature--dark"
          id="hospitality"
          aria-labelledby="hospitality-title"
        >
          <div className="editorial-feature__copy">
            <p className="editorial-kicker">Hospitality</p>
            <h2 id="hospitality-title">
              Paris apartments,
              <br />
              <em>with our concierge</em>
            </h2>
            <p>
              A curated collection of apartments in Paris, for a few nights or a
              longer pied-à-terre. Each stay comes with a hotel-style service
              and our concierge, which is really an insider's Paris: the address
              book we have built over the years, from the tables worth booking
              to the ateliers, flea-market dealers, bars and galleries we love,
              and the fashion addresses only insiders know, from the best
              boutiques and showrooms to the finest vintage. Our guests get our
              personal list of things to do, and the reservations to go with it.
            </p>
            <a className="text-link text-link--light" href="/destinations">
              Discover the apartments <span>↗</span>
            </a>
          </div>
          <div className="editorial-feature__image editorial-reveal">
            <Image
              src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=85"
              alt="Elegant Paris apartment living room"
              fill
              sizes="(max-width: 760px) 100vw, 50vw"
              unoptimized
            />
          </div>
        </section>

        <section
          className="editorial-feature editorial-feature--light"
          id="france"
          aria-labelledby="france-title"
        >
          <div className="editorial-feature__image editorial-reveal">
            <Image
              src="https://images.unsplash.com/photo-1503152394-c571994fd383?auto=format&fit=crop&w=1600&q=85"
              alt="Provence landscape at dusk"
              fill
              sizes="(max-width: 760px) 100vw, 50vw"
              unoptimized
            />
          </div>
          <div className="editorial-feature__copy">
            <p className="editorial-kicker">France</p>
            <h2 id="france-title">
              France,
              <br />
              <em>our home</em>
            </h2>
            <p>
              Fashion, design, art and the art of living. Our experiences take
              place above all in Paris and the South of France, from Provence to
              the Riviera, and further afield in Champagne, Burgundy, Bordeaux
              and Normandy. Wherever we take you, we know the people behind
              every door we open.
            </p>
            <a className="text-link" href="/destinations">
              Discover France <span>↗</span>
            </a>
          </div>
        </section>

        <section
          className="editorial-argentina"
          aria-labelledby="argentina-title"
          style={{
            "--editorial-image":
              "url('https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=2200&q=85')",
          }}
        >
          <div>
            <p className="editorial-kicker">Argentina</p>
            <h2 id="argentina-title">
              And further afield,
              <br />
              <em>Argentina</em>
            </h2>
            <p>
              Where our story began. For a few travellers each season, we open
              the Argentina we know from the inside: Buenos Aires, the Pampas,
              Patagonia and the North of Argentina, with an escape to José
              Ignacio, in Uruguay.
            </p>
            <a
              className="button button--light"
              href="/destinations/argentina/patagonia-andina"
            >
              Discover Argentina
            </a>
          </div>
        </section>

        <section className="editorial-close" id="conversation">
          <p>
            Paris · Provence · The Riviera · Champagne · Burgundy · Bordeaux
          </p>
          <h2>Where we take you</h2>
          <a className="button" href="/destinations">
            See all destinations
          </a>
        </section>
      </main>
      <FooterSecondary />
    </ScrollMotion>
  );
}
import Image from "next/image";
