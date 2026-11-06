export default function BrandMark({ inverse = false, className = "" }) {
  return (
    <a className={`${className}${inverse ? " brand-mark--inverse" : ""}`} href="/" aria-label="Le Coup de Foudre Paris, home">
      <span>Le Coup de Foudre</span>
      <small style={{ textAlign: "left" }}>Paris</small>
    </a>
  );
}
