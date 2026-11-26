import HeaderFullScreen2 from '../components/full-screen-header2';
import FooterSecondary from '../components/footer-secondary';
import ContactForm from '../components/contact-form';

export const metadata = {
  title: 'Contact us | Le Coup de Foudre Paris',
  description: 'Begin a private journey, gathering or encounter with Le Coup de Foudre Paris.',
};

export default function ContactUsPage() {
  return (
    <div className="contact-page">
      <HeaderFullScreen2 />
      <main>
        <section className="contact-hero" aria-labelledby="contact-title">
          <div className="contact-hero__content">
            <p>Le Coup de Foudre · Paris</p>
            <h1 id="contact-title">Begin a journey<br />with us.</h1>
            <span>Private journeys, intimate gatherings and singular encounters across France, Argentina and Uruguay.</span>
          </div>
        </section>

        <section className="contact-about" aria-labelledby="contact-about-title">
          <div className="contact-about__line" aria-hidden="true" />
          <div className="contact-about__grid">
            <h2 id="contact-about-title">A few words<br />about us.</h2>
            <p>Le Coup de Foudre is a Parisian maison of hospitality. We create journeys shaped by a sense of place, a trusted circle of people and the pleasure of discovering what is not found in a guidebook.</p>
            <div>
              <p>From a private escape to a gathering around a table, every invitation begins with listening. We work between France, Argentina and Uruguay, designing experiences with an eye for atmosphere, rhythm and the details that make a stay feel entirely your own.</p>
              <address>
                <span>Pont Alexandre III, 75007 Paris</span>
                <a href="mailto:contact@lecoupdefoudre-paris.com">contact@lecoupdefoudre-paris.com</a>
                <a href="tel:+33660612882">+33 6 60 61 28 82</a>
              </address>
            </div>
          </div>
        </section>

        <section className="contact-enquiry" aria-labelledby="contact-form-title">
          <div className="contact-enquiry__intro">
            <p>Tell us what has captured your imagination—an occasion, a city, a season or simply a feeling. We will return to you personally to begin shaping it together.</p>
          </div>
          <div className="contact-enquiry__form">
            <h2 id="contact-form-title">Write to<br />the Maison.</h2>
            <ContactForm />
          </div>
        </section>
      </main>
      <FooterSecondary />
    </div>
  );
}
