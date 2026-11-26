'use client';

import { useState } from 'react';
import { toast } from 'sonner';

const initialValues = {
  name: '', email: '', country: '', journey: '', guests: '', message: '', website: '',
};

export default function ContactForm() {
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);

  function updateValue(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'Unable to send your message.');

      setValues(initialValues);
      toast.success('Your message is on its way.', {
        description: 'Our Paris team will be in touch shortly.',
      });
    } catch (error) {
      toast.error('Your message was not sent.', {
        description: error.message || 'Please try again shortly.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-form__grid">
        <label>
          <span>Name</span>
          <input autoComplete="name" name="name" placeholder="Your name" required value={values.name} onChange={updateValue} />
        </label>
        <label>
          <span>Email</span>
          <input autoComplete="email" name="email" placeholder="you@example.com" required type="email" value={values.email} onChange={updateValue} />
        </label>
        <label>
          <span>Country of residence</span>
          <input autoComplete="country-name" name="country" placeholder="Country" value={values.country} onChange={updateValue} />
        </label>
        <label>
          <span>Journey style</span>
          <select name="journey" value={values.journey} onChange={updateValue}>
            <option value="">Choose a starting point</option>
            <option>Private journey</option>
            <option>Gathering</option>
            <option>Collective journey</option>
            <option>Something else</option>
          </select>
        </label>
        <label>
          <span>Number of guests</span>
          <input min="1" name="guests" placeholder="e.g. 2" type="number" value={values.guests} onChange={updateValue} />
        </label>
        <label className="contact-form__message">
          <span>What would you like to discover?</span>
          <textarea name="message" placeholder="Tell us what you have in mind" required rows="5" value={values.message} onChange={updateValue} />
        </label>
      </div>
      <div className="contact-form__honeypot" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={updateValue} />
      </div>
      <button className="destination-button" type="submit" disabled={loading}>
        {loading ? 'Sending your note…' : 'Send your enquiry'}
      </button>
    </form>
  );
}
