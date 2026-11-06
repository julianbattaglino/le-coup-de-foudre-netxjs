import JourneyRequestForm from "../../journey-request-form";

export default function HomeRequest() {
  return <section className="request" id="journey-request" aria-labelledby="request-title"><div className="request__intro"><h2 id="request-title">Design your experience</h2><p>Share a few details with our Paris team. We’ll open the next conversation around your plans.</p><a href="mailto:contact@lecoupdefoudre-paris.com">contact@lecoupdefoudre-paris.com</a></div><JourneyRequestForm /></section>;
}
