import { notFound } from "next/navigation";
import Link from "next/link";
import destinationsData from "../../../../data/destinations.json";
import HeaderFullScreen2 from "../../../components/full-screen-header2";
import FooterSecondary from "../../../components/footer-secondary";
import ScrollMotion from "../../../components/scroll-motion";
import DestinationNavigation from "../../../components/destinations/DestinationNavigation";

const destinations = destinationsData.destinations;

function getDestination(country, slug) {
  return destinations.find(
    (destination) => destination.countrySlug === country && destination.slug === slug,
  );
}

function createJourney(data) {
  const [firstTour, secondTour] = data.tours.items;

  return {
    duration: "Four days, at your own pace",
    party: "Designed for two",
    rhythm: data.extract,
    passions: data.whyToGo.items.map((item) => item.title).slice(0, 3),
    stay: data.ourStay,
    days: [
      {
        title: `Arrival in ${data.title}`,
        image: data.presentation.image,
        imageAlt: data.presentation.imageAlt,
        location: data.country,
        moments: [
          { label: "Arrival", title: "Settle into your address", text: data.ourStay.description },
          { label: "First impressions", title: data.presentation.title, text: data.presentation.text },
        ],
      },
      {
        title: firstTour.title,
        image: firstTour.image,
        imageAlt: firstTour.imageAlt,
        location: data.country,
        moments: [{ label: "A private discovery", title: firstTour.title, text: firstTour.text }],
      },
      {
        title: secondTour.title,
        image: secondTour.image,
        imageAlt: secondTour.imageAlt,
        location: data.country,
        moments: [{ label: "A slower afternoon", title: secondTour.title, text: secondTour.text }],
      },
      {
        title: "Make it entirely yours",
        image: data.experiences.image,
        imageAlt: data.experiences.imageAlt,
        location: data.country,
        moments: [{ label: "Your final chapter", title: data.experiences.title, text: data.experiences.text }],
      },
    ],
  };
}

export function generateStaticParams() {
  return destinations.map(({ countrySlug, slug }) => ({ country: countrySlug, slug }));
}

export async function generateMetadata({ params }) {
  const { country, slug } = await params;
  const destination = getDestination(country, slug);
  if (!destination) return {};

  return {
    title: destination.seo?.title ?? `${destination.title} | Le Coup de Foudre`,
    description: destination.seo?.description ?? destination.extract,
    alternates: destination.seo?.canonical ? { canonical: destination.seo.canonical } : undefined,
    robots: destination.seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: destination.seo?.ogImage ? { images: [destination.seo.ogImage] } : undefined,
  };
}

function ProposalImage({ image, label }) {
  return (
    <div className="itinerary-image">
      <img src={image} alt="" />
      {label ? <span>{label}</span> : null}
    </div>
  );
}

function ProposalDay({ day }) {
  const isFinalDay = Boolean(day.morning);

  return (
    <section className="itinerary-day" id={`day-${Number(day.day)}`} aria-labelledby={`itinerary-day-${day.day}`}>
      <ProposalImage image={day.image} label={day.imageLabel} />
      <div className="itinerary-day__copy">
        <p>DAY {day.day}{day.date ? ` · ${day.date}` : ""}</p>
        <h2 id={`itinerary-day-${day.day}`}>{day.chapter}</h2>
        <div className="itinerary-day__entries">
          {isFinalDay ? (
            <>
              <article><span>MORNING</span><div><h3>{day.morning}</h3><p>{day.morningDescription}</p></div></article>
              {day.departure ? <article><span>DEPARTURE</span><div><h3>{day.departure}</h3></div></article> : null}
              {day.feeNote ? <p className="itinerary-day__fee">{day.feeNote}</p> : null}
            </>
          ) : (
            <article className={day.time || day.experience ? "" : "itinerary-day__entry--copy"}>
              {day.time ? <span>{day.time}</span> : null}
              <div>{day.experience ? <h3>{day.experience}</h3> : null}<p>{day.description}</p></div>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}

function ProposalReplica({ proposal }) {
  const isCompactGlance = !proposal.atAGlance.party && !proposal.atAGlance.stay;
  const hasSleepColumn = proposal.days.some((day) => day.sleep);

  return (
    <main className="itinerary-proposal">
      <section className="itinerary-cover" aria-labelledby="itinerary-cover-title">
        <div className="itinerary-cover__copy">
          <p>{proposal.cover.brand}</p><p>{proposal.cover.agency}</p>
          <h1 id="itinerary-cover-title">{proposal.cover.title}</h1>
          <p>{proposal.cover.for}</p><em>{proposal.cover.by}</em>
        </div>
      </section>
      {/*
       <section className="itinerary-curators" id="curators">
        <ProposalImage image={proposal.curators.image} label="" />
        <div className="itinerary-curators__copy">
          <p>{proposal.curators.label}</p><h2>{proposal.curators.title}</h2>
          {proposal.curators.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </section>
      */}

      <section className="itinerary-glance" id="overview" aria-labelledby="itinerary-glance-title">
        <p>{proposal.atAGlance.label}</p><h2 id="itinerary-glance-title">{proposal.atAGlance.title}</h2>
        <div className={`itinerary-glance__grid${isCompactGlance ? " itinerary-glance__grid--compact" : ""}`}>
          {proposal.atAGlance.party ? <div><span>PARTY</span><strong>{proposal.atAGlance.party}</strong></div> : null}
          <div><span>RHYTHM</span><strong>{proposal.atAGlance.rhythm}</strong></div>
          <div><span>PASSION POINTS</span><strong>{proposal.atAGlance.passionPoints.join(" · ")}</strong></div>
          {proposal.atAGlance.stay ? <div><span>WHERE YOU STAY</span><strong>{proposal.atAGlance.stay}<small>{proposal.atAGlance.location}</small></strong></div> : null}
        </div>
      </section>
      <section className="itinerary-overview" id="journey" aria-labelledby="itinerary-overview-title">
        <p>{proposal.overview.label}</p><h2 id="itinerary-overview-title">{proposal.overview.title}</h2>
        <div className={`itinerary-overview__labels${hasSleepColumn ? "" : " itinerary-overview__labels--compact"}`}><span>DAY</span><span>DATE</span><span>CHAPTER</span>{hasSleepColumn ? <span>WHERE YOU SLEEP</span> : null}</div>
        <ol className={hasSleepColumn ? "" : "itinerary-overview__list--compact"}>{proposal.days.map((day) => <li key={day.day}><span>{day.day}</span><span>{day.date ?? "—"}</span><strong>{day.chapter}</strong>{hasSleepColumn ? <em>{day.sleep}</em> : null}</li>)}</ol>
      </section>
      {proposal.days.map((day) => <ProposalDay day={day} key={day.day} />)}
    </main>
  );
}

function JourneyHero({ data, journey }) {
  return (
    <header className="journey-hero">
      <nav className="destination-breadcrumb" aria-label="Breadcrumb">
        <ol>
          <li><Link href="/destinations">All destinations</Link></li>
          <li>{data.country}</li>
          <li aria-current="page">{data.title}</li>
        </ol>
      </nav>
      <div className="journey-hero__grid">
        <div className="journey-hero__intro" data-aos="fade-up">
          <p className="journey-hero__location">{data.country}</p>
          <h1>{data.title}</h1>
          <p>{data.quote}</p>
        </div>
        <div
          className="journey-hero__image"
          role="img"
          aria-label={data.banner.alt}
          style={{ backgroundImage: `url("${data.banner.image}")` }}
        />
      </div>
      <div className="journey-hero__note" data-aos="fade-up">
        <p>{journey.rhythm}</p>
        <a className="journey-button" href="#journey">Explore the suggested journey</a>
      </div>
    </header>
  );
}

function AtAGlance({ journey }) {
  return (
    <section className="journey-glance" id="overview" aria-labelledby="journey-glance-title" data-aos="fade-up">
      <div className="journey-glance__heading">
        <h2 id="journey-glance-title">A journey through {journey.stay.location}</h2>
        <p>Every chapter is a starting point, designed to be adapted around the people, places and rhythms that matter to you.</p>
      </div>
      <dl className="journey-glance__details">
        <div><dt>For</dt><dd>{journey.party}</dd></div>
        <div><dt>Rhythm</dt><dd>{journey.duration}</dd></div>
        <div><dt>Passion points</dt><dd>{journey.passions.join(" · ")}</dd></div>
        <div><dt>Where you stay</dt><dd>{journey.stay.title}<small>{journey.stay.location}</small></dd></div>
      </dl>
    </section>
  );
}

function JourneyIndex({ journey }) {
  return (
    <section className="journey-index" id="journey" aria-labelledby="journey-index-title" data-aos="fade-up">
      <div className="journey-index__heading">
        <h2 id="journey-index-title">The journey, day by day</h2>
        <p>A suggested rhythm for a first encounter.</p>
      </div>
      <ol>
        {journey.days.map((day, index) => (
          <li key={day.title}>
            <span>Day {String(index + 1).padStart(2, "0")}</span>
            <strong>{day.title}</strong>
            <em>{index === journey.days.length - 1 ? "Departure at leisure" : journey.stay.title}</em>
          </li>
        ))}
      </ol>
    </section>
  );
}

function JourneyDay({ day, index }) {
  return (
    <section className="journey-day" id={`day-${index + 1}`} aria-labelledby={`day-${index + 1}-title`}>
      <div className="journey-day__image-wrap" data-aos="fade-up">
        <img src={day.image} alt={day.imageAlt} />
        <span>{day.location}</span>
      </div>
      <div className="journey-day__story" data-aos="fade-up">
        <p>Day {String(index + 1).padStart(2, "0")}</p>
        <h2 id={`day-${index + 1}-title`}>{day.title}</h2>
        <div className="journey-day__moments">
          {day.moments.map((moment) => (
            <article key={moment.title}>
              <span>{moment.label}</span>
              <h3>{moment.title}</h3>
              <p>{moment.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stay({ stay }) {
  return (
    <section className="journey-stay" id="stay" data-aos="fade-up">
      <div className="journey-stay__copy">
        <h2>{stay.title}</h2>
        <p>{stay.description}</p>
        <span>{stay.location}</span>
      </div>
      <div className="journey-stay__image-wrap">
        <img src={stay.image} alt={stay.imageAlt} />
      </div>
    </section>
  );
}

export default async function DestinationPage({ params }) {
  const { country, slug } = await params;
  const destination = getDestination(country, slug);
  if (!destination) notFound();

  if (destination.proposal?.format === "itinerary") {
    const proposalNavigation = [
      { id: "top", label: "Introduction" },
      { id: "overview", label: "At a glance" },
      { id: "journey", label: "Day by day" },
      ...destination.proposal.days.map((day) => ({ id: `day-${Number(day.day)}`, label: `Day ${day.day}` })),
    ];

    return (
      <ScrollMotion className="destination-motion">
        <div id="top">
          <HeaderFullScreen2 />
          <DestinationNavigation items={proposalNavigation} />
          <ProposalReplica proposal={destination.proposal} />
          <FooterSecondary />
        </div>
      </ScrollMotion>
    );
  }

  const journey = createJourney(destination);

  return (
    <ScrollMotion className="destination-motion">
      <div id="top">
        <HeaderFullScreen2 />
        <main className="destination-page journey-page">
          <JourneyHero data={destination} journey={journey} />
          <AtAGlance journey={journey} />
          <DestinationNavigation />
          <JourneyIndex journey={journey} />
          <div className="journey-days">
            {journey.days.map((day, index) => <JourneyDay day={day} index={index} key={day.title} />)}
          </div>
          <Stay stay={journey.stay} />
        </main>
        <FooterSecondary />
      </div>
    </ScrollMotion>
  );
}
