import Link from 'next/link';
export const LabHero = () => (
  <header className="bg-deep pt-32 pb-16 text-deep-foreground">
    <div className="folio-wrap">
      <Link className="text-deep-primary text-sm underline" href="/">
        Back to home
      </Link>
      <h1 className="folio-heading mt-12">The creative lab</h1>
      <p className="mt-5 max-w-lg text-deep-muted-foreground text-xl">
        Before I built software for publishers, I worked with a camera and an
        editing timeline. I keep a few of those early films here.
      </p>
    </div>
  </header>
);
