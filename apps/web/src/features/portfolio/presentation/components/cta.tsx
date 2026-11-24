import { contactEmail } from '@/config/site';
export const CTA = () => (
  <section id="contact" className="bg-primary py-14 text-primary-foreground">
    <div className="folio-wrap flex flex-wrap items-center justify-between gap-5">
      <h2 className="folio-heading">Write to me.</h2>
      <a
        href={`mailto:${contactEmail}`}
        data-umami-event="contact-email"
        className="border-current border-b pb-1 text-lg"
      >
        {contactEmail} ↗
      </a>
    </div>
  </section>
);
