import pressData from "../../data/press.json";
import HeaderFullScreen2 from "../components/full-screen-header2";
import FooterSecondary from "../components/footer-secondary";
import ScrollMotion from "../components/scroll-motion";
import PressGrid from "./press-grid";

export const metadata = {
  title: "International Press | Le Coup de Foudre Paris",
  description:
    "Explore international press, interviews and editorial features about Le Coup de Foudre.",
};

export default function PressPage() {
  return (
    <ScrollMotion className="destination-motion press-motion">
      <div id="top">
        <HeaderFullScreen2 />
        <PressGrid articles={pressData.articles} />
        <FooterSecondary />
      </div>
    </ScrollMotion>
  );
}
