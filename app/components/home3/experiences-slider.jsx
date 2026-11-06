"use client";

import Image from "next/image";
import { A11y, Keyboard, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import experiences from "../home/experiences-data";

export default function Home3ExperiencesSlider() {
  return (
    <section className="experiences section home3-experiences" id="experiences" aria-labelledby="home3-experiences-title">
      <div className="section-heading">
        <div>
          <h2 id="home3-experiences-title">The experiences</h2>
        </div>
        <p className="section-heading__note">Culture, craft and places opened through a personal point of view.</p>
      </div>
      <div className="home3-slider">
        <Swiper
          modules={[A11y, Keyboard, Navigation, Pagination]}
          a11y={{ prevSlideMessage: "Previous experience", nextSlideMessage: "Next experience" }}
          keyboard={{ enabled: true, onlyInViewport: true }}
          loop
          navigation={{ nextEl: ".home3-slider__next", prevEl: ".home3-slider__prev" }}
          pagination={{ el: ".home3-slider__progress", type: "progressbar" }}
          slidesPerView="auto"
          spaceBetween={20}
          speed={650}
          watchOverflow
        >
          {experiences.map((experience, index) => (
            <SwiperSlide className="home3-slider__slide" key={experience.title}>
              <article className={`experience ${experience.className}`}>
                <div className="experience__image">
                  <Image src={experience.image} alt={experience.alt} fill sizes="(max-width: 700px) 78vw, 34vw" unoptimized />
                  {index === 0 ? <span className="experience__image-note">A French art de vivre</span> : null}
                </div>
                <div className="experience__caption"><h3>{experience.title}</h3><span>{experience.category}</span></div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="home3-slider__controls">
          <div className="home3-slider__progress" aria-hidden="true" />
          <div className="home3-slider__arrows">
            <button className="home3-slider__prev" type="button" aria-label="Previous experience">←</button>
            <button className="home3-slider__next" type="button" aria-label="Next experience">→</button>
          </div>
        </div>
      </div>
    </section>
  );
}
