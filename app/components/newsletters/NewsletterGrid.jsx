import NewsletterCard from './NewsletterCard';
import styles from './Newsletters.module.css';

export default function NewsletterGrid({ newsletters = [] }) {
  if (!newsletters.length) {
    return (
      <p className={styles.empty}>
        No newsletters available at the moment.
      </p>
    );
  }

  return (
    <div className={styles.grid}>
      {newsletters.map((newsletter) => (
        <NewsletterCard
          key={newsletter.id}
          newsletter={newsletter}
        />
      ))}
    </div>
  );
}