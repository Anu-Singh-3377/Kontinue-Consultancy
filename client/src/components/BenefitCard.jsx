export default function BenefitCard({ title, description }) {
  return (
    <article className="benefit-card">
      <span>01</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}
