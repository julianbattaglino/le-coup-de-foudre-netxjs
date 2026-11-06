"use client";

const conciergeEmail = "julianbattaglino@gmail.com";

export default function JourneyRequestForm() {
  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const fields = [
      ["Name", formData.get("name")],
      ["Email", formData.get("email")],
      ["Country", formData.get("country")],
      ["Journey style", formData.get("journey")],
      ["Guests", formData.get("guests")],
      ["Your idea", formData.get("message")],
    ];
    const body = fields.map(([label, value]) => `${label}: ${value || "—"}`).join("\n\n");
    const subject = encodeURIComponent("A private journey in France");

    window.location.href = `mailto:${conciergeEmail}?subject=${subject}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form className="request-form" onSubmit={handleSubmit}>
      <div className="request-form__grid">
        <label className="field">
          <span>Name</span>
          <input autoComplete="name" name="name" placeholder="Your name" required />
        </label>
        <label className="field">
          <span>Email</span>
          <input autoComplete="email" name="email" placeholder="you@example.com" required type="email" />
        </label>
        <label className="field">
          <span>Country of residence</span>
          <input autoComplete="country-name" name="country" placeholder="Country" />
        </label>
        <label className="field">
          <span>Journey style</span>
          <select defaultValue="" name="journey">
            <option disabled value="">Choose a starting point</option>
            <option>Private journey</option>
            <option>Gathering</option>
            <option>Collective journey</option>
            <option>Something else</option>
          </select>
        </label>
        <label className="field field--short">
          <span>Number of guests</span>
          <input min="1" name="guests" placeholder="e.g. 2" type="number" />
        </label>
        <label className="field field--wide">
          <span>What would you like to discover?</span>
          <textarea name="message" placeholder="Tell us what you have in mind" required rows="2" />
        </label>
      </div>
      <div className="request-form__submit">
        <p>Your email application will open with your request ready to send.</p>
        <button className="button button--light" type="submit">Send enquiry</button>
      </div>
    </form>
  );
}
