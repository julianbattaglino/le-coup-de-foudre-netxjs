import destinationsData from "../../data/destinations.json";
import HeaderFullScreen2 from "../components/full-screen-header2";
import FooterSecondary from "../components/home2/footer-secondary";
import ScrollMotion from "../components/home3/scroll-motion";
import DestinationList from "./destination-list";

export const metadata = {
  title: "Destinations | Le Coup de Foudre Paris",
  description:
    "Explore destinations in France, Argentina and Uruguay, and find the journey that feels right for you.",
};

export default function DestinationsPage() {
  return (
    <ScrollMotion className="destination-motion">
      <div id="top">
        <HeaderFullScreen2 />
        <DestinationList destinations={destinationsData.destinations} />
        <FooterSecondary />
      </div>
    </ScrollMotion>
  );
}
