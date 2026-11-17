import HeaderFullScreen2 from "../components/full-screen-header2";
import FooterSecondary from "../components/home2/footer-secondary";
import JourneyMap from "../components/journey-map";

export const metadata = {
  title: "The Journey Map | Le Coup de Foudre Paris",
  description: "Follow Le Coup de Foudre from France to Argentina and Uruguay.",
};

export default function JourneyMapPage() {
  return (
    <div className="journey-page">
      <HeaderFullScreen2 />
      <JourneyMap />
      <FooterSecondary />
    </div>
  );
}
