"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

export default function PressGrid({ articles }) {
  const [country, setCountry] = useState("all");
  const [type, setType] = useState("all");
  const [search, setSearch] = useState("");

  const countries = useMemo(() => [...new Set(articles.map((article) => article.country))].sort(), [articles]);
  const types = useMemo(() => [...new Set(articles.map((article) => article.type))].sort(), [articles]);
  const years = useMemo(() => [...new Set(articles.map((article) => article.year))].sort((a, b) => b - a), [articles]);
  const [year, setYear] = useState("all");
  const filteredArticles = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return articles.filter((article) => {
      const matchesCountry = country === "all" || article.country === country;
      const matchesType = type === "all" || article.type === type;
      const matchesYear = year === "all" || article.year === Number(year);
      const matchesSearch = !query || [article.publication, article.title, article.country, article.type]
        .join(" ")
        .toLocaleLowerCase()
        .includes(query);
      return matchesCountry && matchesType && matchesYear && matchesSearch;
    });
  }, [articles, country, search, type, year]);

  function resetFilters() {
    setCountry("all");
    setType("all");
    setYear("all");
    setSearch("");
  }

  return (
    <main className="destinations-index press-index">
      <header className="destinations-index__heading press-index__heading" data-aos="fade-up">
        <p className="destination-eyebrow">Le Coup de Foudre · In the press</p>
        <h1>International press</h1>
        <p className="destinations-index__intro">
          Stories, conversations and places seen through the pages of the world’s journals.
        </p>
      </header>

      <section className="destinations-catalog" aria-label="International press articles">
        <div className="destinations-filters press-filters" data-aos="fade-up">
          <label className="destinations-filter">
            <span>Country</span>
            <select value={country} onChange={(event) => setCountry(event.target.value)}>
              <option value="all">All countries</option>
              {countries.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="destinations-filter">
            <span>Story type</span>
            <select value={type} onChange={(event) => setType(event.target.value)}>
              <option value="all">All stories</option>
              {types.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="destinations-filter">
            <span>Year</span>
            <select value={year} onChange={(event) => setYear(event.target.value)}>
              <option value="all">All years</option>
              {years.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="destinations-filter destinations-filter--search">
            <span>Search</span>
            <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Publication or title" />
          </label>
          <p className="destinations-result-count" aria-live="polite">
            {filteredArticles.length} {filteredArticles.length === 1 ? "story" : "stories"}
          </p>
        </div>

        {filteredArticles.length ? (
          <div className="destinations-grid press-grid">
            {filteredArticles.map((article, index) => (
              <article className="press-card" data-aos="fade-up" data-aos-delay={(index % 3) * 90} key={article.id}>
                <a className="press-card__link" href={article.url} target="_blank" rel="noreferrer" aria-label={`${article.title} — read full article`}>
                  <div className="press-card__cover">
                    <div className={`press-card__media${article.imageFit === "contain" ? " press-card__media--contain" : ""}`}>
                      <Image
                        className="press-card__image"
                        src={article.image}
                        alt={article.imageAlt}
                        fill
                        sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                        unoptimized
                      />
                    </div>
                  </div>
                  <div className="press-card__caption">
                    <span>{article.country}</span>
                    <span className="press-card__meta">
                      <span>{article.year}</span>
                      <span className="press-card__read">Read full article <span aria-hidden="true">↗</span></span>
                    </span>
                  </div>
                </a>
              </article>
            ))}
          </div>
        ) : (
          <div className="destinations-empty">
            <h2>No stories match your search.</h2>
            <p>Try another country, story type or publication.</p>
            <button type="button" onClick={resetFilters}>Clear filters</button>
          </div>
        )}
      </section>
    </main>
  );
}
