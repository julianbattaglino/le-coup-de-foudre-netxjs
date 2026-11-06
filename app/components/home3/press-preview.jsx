import Image from "next/image";
import pressData from "../../../data/press.json";

const latestPress = [...pressData.articles]
  .sort((a, b) => b.year - a.year)
  .slice(0, 4);

export default function Home3PressPreview() {
  return (
    <section className="home3-press" id="press" aria-labelledby="home3-press-title">
      <div className="home3-press__heading">
        <p className="destination-eyebrow">In the pages of the world’s journals</p>
        <h2 id="home3-press-title">International press</h2>
        <p>A selection of stories and conversations featuring Le Coup de Foudre.</p>
      </div>
      <div className="home3-press__grid">
        {latestPress.map((article) => (
          <a className="home3-press__card" href={article.url} key={article.id} target="_blank" rel="noreferrer">
            <figure className="home3-press__cover">
              <Image
                src={article.image}
                alt={article.imageAlt}
                fill
                sizes="(max-width: 600px) 44vw, (max-width: 900px) 44vw, 22vw"
                unoptimized
                style={{ objectFit: article.imageFit === "contain" ? "contain" : "cover" }}
              />
            </figure>
            <div className="home3-press__caption">
              <span>{article.publication}</span>
              <span>{article.year}</span>
            </div>
          </a>
        ))}
      </div>
      <a className="home3-press__all" href="/press">Explore all press <span aria-hidden="true">↗</span></a>
    </section>
  );
}
