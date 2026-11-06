import JourneyRequestForm from "../../journey-request-form";

export default function Home2Request() {
  return <section className="home2-request" id="journey-request" aria-labelledby="home2-request-title"><div className="home2-request__head"><span className="home2-overline">A first conversation</span><h2 id="home2-request-title">Design your experience</h2></div><JourneyRequestForm /><div className="home2-request__contact"><a href="mailto:contact@lecoupdefoudre-paris.com">contact@lecoupdefoudre-paris.com</a><a href="tel:+33186958352">(Phone) +33 (0) 6 80 83 83 52</a></div></section>;
}
