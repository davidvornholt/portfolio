import Link from 'next/link';
export default function NotFound() {
  return (
    <section className="folio-wrap py-36">
      <p className="folio-label text-welcome">404 / Missing page</p>
      <h1 className="folio-heading mt-6">I couldn’t find that page.</h1>
      <p className="mt-5">My work and recent articles are on the home page.</p>
      <Link className="ink-link mt-5 text-primary" href="/">
        Back to home ↗
      </Link>
    </section>
  );
}
