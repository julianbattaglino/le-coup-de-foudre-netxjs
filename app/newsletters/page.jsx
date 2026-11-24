import { getNewsletters } from '../lib/mailchimp';
import HomeHeader from "../components/full-screen-header2";
import FooterSecondary from "../components/home2/footer-secondary";
import NewsletterGrid from '../components/newsletters/NewsletterGrid';

export const revalidate = 3600;

export const metadata = {
  title: 'Newsletters | Le Coup de Foudre',
  description:
    'Discover our latest newsletters, exclusive experiences and travel inspiration.',
};

export default async function NewslettersPage() {
  const newsletters = await getNewsletters();

  return (
    <main className="newsletters-page">
      <HomeHeader />
      <section className="newsletters" aria-labelledby="newsletters-heading">
        <div className="container newsletters__container">
          <h1 id="newsletters-heading">Our Newsletters</h1>

          <NewsletterGrid newsletters={newsletters} />
        </div>
      </section>
      <FooterSecondary />
    </main>
  );
}
