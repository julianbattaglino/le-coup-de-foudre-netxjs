'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Unable to subscribe.');
      }

      toast.success('Thank you for subscribing.', {
        description: 'If confirmation is required, please check your inbox.',
      });
      setEmail('');
    } catch (error) {
      toast.error('We could not subscribe you.', {
        description: error.message || 'Please try again shortly.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="footer-newsletter-email">Your email address</label>
      <div className="home3-footer__form-row">
        <input
          id="footer-newsletter-email"
          name="email"
          type="email"
          placeholder="Email address"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={loading}
          required
        />
        <button type="submit" disabled={loading} aria-label="Subscribe to the newsletter">
          {loading ? 'Subscribing...' : 'Subscribe'}
          {!loading && <span aria-hidden="true">→</span>}
        </button>
      </div>
      <div className="newsletter-honeypot" aria-hidden="true">
        <label htmlFor="footer-newsletter-website">Website</label>
        <input
          id="footer-newsletter-website"
          name="website"
          type="text"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <p className="home3-footer__newsletter-consent">
        By subscribing, you agree to receive our newsletters. You may unsubscribe at any time.
      </p>
    </form>
  );
}
