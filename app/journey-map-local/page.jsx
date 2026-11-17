import HeaderFullScreen2 from "../components/full-screen-header2";
import FooterSecondary from "../components/home2/footer-secondary";
import JourneyMap from "../components/journey-map";

export const metadata = {
  title: "The Journey Map — Local | Le Coup de Foudre Paris",
  description: "Follow Le Coup de Foudre through locally stored administrative maps.",
};

export default function JourneyMapLocalPage() {
  return (
    <div className="journey-page">
      <HeaderFullScreen2 />
      <JourneyMap sourceMode="local" />
      <FooterSecondary />
    </div>
  );
}
