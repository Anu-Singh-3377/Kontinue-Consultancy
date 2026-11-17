export default function PageHero({ title, description }) {
  return (
    <section className="page-hero">
      <div className="container page-hero__inner">
        <h1 className="heading heading--xl" style={{ color: '#fff', marginBottom: 12 }}>{title}</h1>
        {description && <p>{description}</p>}
      </div>
    </section>
  );
}
