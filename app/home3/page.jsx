import HomeHeader from "../components/full-screen-header2";
import FooterSecondary from "../components/home2/footer-secondary";
import HomeHero from "../components/home/hero";
import HomeJourneys from "../components/home/journeys";
import HomeMaison from "../components/home/maison";
import HomeRequest from "../components/home/request";
import Home3ExperiencesSlider from "../components/home3/experiences-slider";
import ScrollMotion from "../components/home3/scroll-motion";

export default function HomeThreePage() {
  return (
    <ScrollMotion>
      <HomeHeader />
      <main id="top">
        <div data-aos="fade-up"><HomeHero /></div>
        <div data-aos="fade-up"><Home3ExperiencesSlider /></div>
        <div data-aos="fade-up"><HomeJourneys /></div>
        <div data-aos="fade-up"><HomeMaison /></div>
        <div data-aos="fade-up"><HomeRequest /></div>
      </main>
      <FooterSecondary />
    </ScrollMotion>
  );
}
