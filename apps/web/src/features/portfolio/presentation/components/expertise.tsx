const qualifications = [
  [
    'Meta',
    'Front-End Professional Certificate',
    'professional-cert/CLARJJOBU3KW',
  ],
  [
    'IBM',
    'DevOps and Software Engineering Professional',
    'verify/ZUBODAYX2VM5',
  ],
  ['UC Irvine', 'Specialized Go Programming', 'verify/M0MK09J5OSBX'],
] as const;
export const Expertise = () => (
  <section id="expertise" className="folio-wrap pb-12">
    <details className="border-border border-y py-4">
      <summary className="cursor-pointer font-medium">
        My languages and qualifications
      </summary>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <p>
          I’m a native German speaker. I work in English and speak French and
          Spanish at an intermediate level.
        </p>
        <ul className="space-y-2">
          {qualifications.map(([issuer, title, credential]) => (
            <li key={issuer}>
              <a
                className="text-primary underline"
                href={`https://www.coursera.org/account/accomplishments/${credential}`}
              >
                {issuer} · {title} ↗
              </a>
            </li>
          ))}
        </ul>
      </div>
    </details>
  </section>
);
