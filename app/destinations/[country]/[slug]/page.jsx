import { notFound } from "next/navigation";
import Link from "next/link";
import destinationsData from "../../../../data/destinations.json";
import HeaderFullScreen2 from "../../../components/full-screen-header2";
import FooterSecondary from "../../../components/home2/footer-secondary";
import ScrollMotion from "../../../components/home3/scroll-motion";
import DestinationNavigation from "../../../components/destinations/DestinationNavigation";

const destinations = destinationsData.destinations;

function getDestination(country, slug) {
  return destinations.find(
    (destination) =>
      destination.countrySlug === country && destination.slug === slug,
  );
}

export function generateStaticParams() {
  return destinations.map(({ countrySlug, slug }) => ({
    country: countrySlug,
    slug,
  }));
}

export async function generateMetadata({ params }) {
  const { country, slug } = await params;
  const destination = getDestination(country, slug);

  if (!destination) return {};

  return {
    title: destination.seo?.title ?? `${destination.title} | Le Coup de Foudre`,
    description: destination.seo?.description ?? destination.extract,
    alternates: destination.seo?.canonical
      ? { canonical: destination.seo.canonical }
      : undefined,
    robots: destination.seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: destination.seo?.ogImage
      ? { images: [destination.seo.ogImage] }
      : undefined,
  };
}

function DestinationHero({ data }) {
  return (
    <header className="destination-hero" data-aos="fade-up">
      <div className="destination-hero__title">
        <nav className="destination-breadcrumb" aria-label="Breadcrumb">
          <ol>
            <li><Link href="/destinations">All destinations</Link></li>
            <li>{data.country}</li>
            <li aria-current="page">{data.title}</li>
          </ol>
        </nav>
        <p className="destination-eyebrow">{data.country}</p>
        <h1>{data.title}</h1>
      </div>
      <div
        className="destination-hero__image"
        role="img"
        aria-label={data.banner.alt}
        style={{ backgroundImage: `url("${data.banner.image}")` }}
      />
      <div className="destination-hero__content">
        <blockquote>{data.quote}</blockquote>
        <p className="destination-hero__extract">{data.extract}</p>
        <a className="destination-button" href={data.ctaOne.href}>
          {data.ctaOne.label}
        </a>
      </div>
    </header>
  );
}

function DestinationWhy({ data }) {
  return (
    <section className="destination-why" data-aos="fade-up" aria-labelledby="destination-why-title">
      <p className="destination-eyebrow">The destination</p>
      <h2 id="destination-why-title">{data.whyToGo.title}</h2>
      <div className="destination-why__grid">
        {data.whyToGo.items.map((item, index) => (
          <article className="destination-why__item" key={item.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function DestinationPresentation({ data }) {
  return (
    <section className="destination-split destination-section" id="presentation" data-aos="fade-up">
      <div className="destination-section__image-wrap">
        <img src={data.presentation.image} alt={data.presentation.imageAlt} />
      </div>
      <div className="destination-section__copy">
        <p className="destination-eyebrow">Presentation</p>
        <h2>{data.presentation.title}</h2>
        <p>{data.presentation.text}</p>
      </div>
    </section>
  );
}

function DestinationStay({ data }) {
  return (
    <section className="destination-stay destination-section" id="stay" data-aos="fade-up">
      <div className="destination-stay__copy">
        <p className="destination-eyebrow">Our stay</p>
        <h2>{data.ourStay.title}</h2>
        <p>{data.ourStay.description}</p>
        <span>{data.ourStay.location}</span>
      </div>
      <div className="destination-stay__image-wrap">
        <img src={data.ourStay.image} alt={data.ourStay.imageAlt} />
      </div>
    </section>
  );
}

function DestinationTours({ data }) {
  return (
    <section className="destination-tours destination-section" id="tours" data-aos="fade-up">
      <div className="destination-section__heading">
        <p className="destination-eyebrow">Curated journeys</p>
        <h2>{data.tours.title}</h2>
      </div>
      <div className="destination-tours__grid">
        {data.tours.items.map((tour, index) => (
          <article className="destination-tour" key={tour.title}>
            <div className="destination-tour__image-wrap">
              <img src={tour.image} alt={tour.imageAlt} />
            </div>
            <div className="destination-tour__copy">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{tour.title}</h3>
              <p>{tour.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function DestinationExperiences({ data }) {
  return (
    <section className="destination-experiences destination-section" id="experiences" data-aos="fade-up">
      <div className="destination-experiences__image-wrap">
        <img src={data.experiences.image} alt={data.experiences.imageAlt} />
      </div>
      <div className="destination-experiences__copy">
        <p className="destination-eyebrow">Make it yours</p>
        <h2>{data.experiences.title}</h2>
        <p>{data.experiences.text}</p>
      </div>
    </section>
  );
}

export default async function DestinationPage({ params }) {
  const { country, slug } = await params;
  const destination = getDestination(country, slug);

  if (!destination) notFound();

  return (
    <ScrollMotion className="destination-motion">
      <div id="top">
        <HeaderFullScreen2 />
        <main className="destination-page">
          <DestinationHero data={destination} />
          <DestinationWhy data={destination} />
          <DestinationNavigation />
          <DestinationPresentation data={destination} />
          <DestinationStay data={destination} />
          <DestinationTours data={destination} />
          <DestinationExperiences data={destination} />
        </main>
        <FooterSecondary />
      </div>
    </ScrollMotion>
  );
}
