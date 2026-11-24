import styles from './Newsletters.module.css';

export default function NewsletterCard({ newsletter }) {
  const { title, image, url, date } = newsletter;

  const sentAt = date ? new Date(date) : null;
  const isValidDate = sentAt && !Number.isNaN(sentAt.getTime());
  const formattedDate = isValidDate
    ? new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(sentAt)
    : null;
  const formattedTime = isValidDate
    ? new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
        timeZone: 'UTC',
      }).format(sentAt)
    : null;

  return (
    <article className={styles.card}>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.cardLink}
      >
        <div className={styles.imageFrame}>
          <div className={styles.imageWrapper}>
            <img
              src={image || '/images/newsletter-placeholder.jpg'}
              alt={title}
              loading="lazy"
              className={styles.image}
            />
          </div>
        </div>

        <div className={styles.content}>
          {formattedDate && (
            <p className={styles.date}>
              <time dateTime={date}>{formattedDate}</time>
              {formattedTime && <span aria-hidden="true"> / </span>}
              {formattedTime && <time dateTime={date}>{formattedTime}</time>}
            </p>
          )}

          <h2 className={styles.title}>{title}</h2>

          <span className={styles.readMore}>
            Read newsletter
          </span>
        </div>
      </a>
    </article>
  );
}
