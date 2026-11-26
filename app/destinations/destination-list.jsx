"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import CatalogFilters from "../components/catalog-filters";

const travelStyles = [
  { id: "city", label: "City & culture" },
  { id: "coast", label: "Coast & seaside" },
  { id: "countryside", label: "Countryside" },
  { id: "wine", label: "Wine & gastronomy" },
  { id: "mountains", label: "Mountains & nature" },
];

const stylesByDestination = {
  normandy: ["coast", "countryside"],
  paris: ["city"],
  "girlfriends-paris": ["city"],
  "mother-daughter-paris": ["city"],
  "chantilly-senlis": ["countryside"],
  burgundy: ["wine", "countryside"],
  "loire-valley": ["countryside"],
  champagne: ["wine", "countryside"],
  bordeaux: ["wine", "countryside"],
  provence: ["countryside", "wine"],
  "saint-tropez": ["coast"],
  "french-riviera": ["coast", "city"],
  "buenos-aires": ["city"],
  pampa: ["countryside"],
  mendoza: ["wine", "mountains"],
  salta: ["mountains", "countryside"],
  "patagonia-andina": ["mountains"],
  "patagonia-atlantica": ["coast", "mountains"],
  "jose-ignacio": ["coast"],
};

export default function DestinationList({ destinations }) {
  const [country, setCountry] = useState("all");
  const [travelStyle, setTravelStyle] = useState("all");
  const [search, setSearch] = useState("");

  const countries = useMemo(
    () =>
      [...new Map(destinations.map((destination) => [destination.countrySlug, destination.country])).entries()]
        .map(([slug, label]) => ({ slug, label })),
    [destinations],
  );

  const filteredDestinations = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();

    return destinations.filter((destination) => {
      const matchesCountry = country === "all" || destination.countrySlug === country;
      const matchesStyle =
        travelStyle === "all" || stylesByDestination[destination.slug]?.includes(travelStyle);
      const searchableText = [destination.title, destination.country, destination.extract]
        .join(" ")
        .toLocaleLowerCase();

      return matchesCountry && matchesStyle && (!query || searchableText.includes(query));
    });
  }, [country, destinations, search, travelStyle]);

  function resetFilters() {
    setCountry("all");
    setTravelStyle("all");
    setSearch("");
  }

  function updateFilters(nextFilters) {
    if (nextFilters.country !== undefined) setCountry(nextFilters.country);
    if (nextFilters.travelStyle !== undefined) setTravelStyle(nextFilters.travelStyle);
    if (nextFilters.search !== undefined) setSearch(nextFilters.search);
  }

  return (
    <main className="destinations-index">
      <header className="destinations-index__heading" data-aos="fade-up">
        <p className="destination-eyebrow">Le Coup de Foudre · Private journeys</p>
        <h1>Find your somewhere</h1>
        <p className="destinations-index__intro">
          From the quiet of a vineyard to the rhythm of a city, discover the places
          that stay with you.
        </p>
      </header>

      <section className="destinations-catalog" aria-label="Explore destinations">
        <CatalogFilters
          fields={[
            { id: "country", label: "Country", allLabel: "All countries", options: countries.map(({ slug, label }) => ({ value: slug, label })) },
            { id: "travelStyle", label: "Travel style", allLabel: "Every kind of journey", options: travelStyles.map(({ id, label }) => ({ value: id, label })) },
            { id: "search", kind: "search", label: "Search", placeholder: "Try Paris or Patagonia" },
          ]}
          filters={{ country, travelStyle, search }}
          onChange={updateFilters}
          onReset={resetFilters}
          resultCount={filteredDestinations.length}
          resultNoun={{ singular: "destination", plural: "destinations" }}
          title="Filter destinations"
          triggerLabel="Filter destinations"
        />

        {filteredDestinations.length ? (
          <div className="destinations-grid">
            {filteredDestinations.map((destination, index) => (
              <article className="experience experience--garden destinations-card" data-aos="fade-up" data-aos-delay={(index % 3) * 90} key={`${destination.countrySlug}/${destination.slug}`}>
                <Link
                  className="destinations-card__link"
                  href={`/destinations/${destination.countrySlug}/${destination.slug}`}
                  aria-label={`Explore ${destination.title}, ${destination.country}`}
                >
                  <figure className="home2-hero__image destinations-card__image">
                    <div className="destinations-card__media">
                      <Image
                        src={destination.banner.image}
                        alt={destination.banner.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw"
                        unoptimized
                      />
                    </div>
                  </figure>
                  <div className="experience__caption destinations-card__caption">
                    <h2>{destination.title}</h2>
                    <span>{destination.country}</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="destinations-empty">
            <h2>No destinations match your search.</h2>
            <p>Try another country, travel style or destination name.</p>
            <button type="button" onClick={resetFilters}>Clear filters</button>
          </div>
        )}
      </section>
    </main>
  );
}
