export default function PageSection({ title, children }: any) {
  return (
    <section className="mb-6">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <div className="card-3d p-4">{children}</div>
    </section>
  );
}
