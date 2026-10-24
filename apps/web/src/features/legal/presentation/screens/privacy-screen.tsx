import type { ReactNode } from 'react';
import { MDXCallout } from '@/shared/content/presentation/components/mdx-layout-components';
import { MDXParagraph } from '@/shared/content/presentation/components/mdx-markdown-elements';
import { LegalDocument, LegalSection } from '../components/legal-document';
import { OperatorAddress } from '../components/operator-address';
import { Placeholder } from '../components/placeholder';

export const PrivacyScreen = (): ReactNode => (
  <LegalDocument
    eyebrow="Privacy"
    title="Privacy notice"
    lastUpdated="October 2026"
  >
    <MDXParagraph>
      This notice explains which personal data this website processes, why, and
      which rights you have. It covers david.vornholt.online and the analytics
      service at umami.vornholt.online.
    </MDXParagraph>

    <LegalSection title="Who is responsible">
      <MDXParagraph>
        The controller under the General Data Protection Regulation (GDPR) is:
      </MDXParagraph>
      <OperatorAddress />
    </LegalSection>

    <LegalSection title="Hosting and server logs">
      <MDXParagraph>
        I run this website on a server that I administer myself. I rent it from
        netcup GmbH, Daimlerstraße 25, 76185 Karlsruhe, Germany, and it is
        located in Germany. Your browser connects to it directly; there is no
        content delivery network or other proxy in between.
      </MDXParagraph>
      <MDXParagraph>
        When your browser requests a page, the web server writes an entry to its
        access log. The entry contains your IP address, the date and time, the
        requested address, the response status and size, and the headers your
        browser sent with the request, including the referring page and your
        browser&apos;s user agent. Requests to umami.vornholt.online are logged
        the same way.
      </MDXParagraph>
      <MDXParagraph>
        I use these logs to deliver the site, keep it secure, and find errors.
        The legal basis is Art. 6(1)(f) GDPR; my legitimate interest is running
        a secure and reliable website. The logs are deleted after{' '}
        <Placeholder>retention period for server logs</Placeholder>.
      </MDXParagraph>
    </LegalSection>

    <LegalSection title="Analytics with Umami">
      <MDXParagraph>
        I measure how this site is used with Umami, an open-source analytics
        tool. I host it myself on the same server, so the data does not go to
        the makers of Umami or to anyone else.
      </MDXParagraph>
      <MDXParagraph>
        When a page loads, a script from umami.vornholt.online sends the page
        address and title, the referring page, your screen size, and your
        browser language. It also reports clicks on some links, for example to
        my social profiles, my email address, case studies, and posts. Like
        every request, this one carries your IP address and user agent.
      </MDXParagraph>
      <MDXParagraph>
        On the server, Umami looks up your approximate location (country,
        region, and city) from your IP address in a database stored on the
        server, and derives your browser, operating system, and device type from
        your user agent. It combines your IP address and user agent with a
        secret key and the current month into a pseudonymous visitor ID. Page
        views within one calendar month from the same IP address and browser
        therefore usually count as one visitor, and a new IP address or browser
        counts as a new visitor. Umami stores neither your IP address nor your
        full user agent.
      </MDXParagraph>
      <MDXParagraph>
        Umami sets no cookies and stores nothing on your device. Besides your
        screen size and language, the script reads one value from your
        browser&apos;s local storage: a flag that lets the site owner exclude
        their own visits.
      </MDXParagraph>
      <MDXParagraph>
        I use these statistics to see which pages people read, how they find the
        site, and whether it works on their devices. The legal basis is Art.
        6(1)(f) GDPR; my legitimate interest is improving the site with
        pseudonymous statistics that do not follow you to other websites. The
        analytics records are deleted after{' '}
        <Placeholder>retention period for analytics records</Placeholder>.
      </MDXParagraph>
      <MDXParagraph>
        You can object at any time, as described below. You can also block
        requests to umami.vornholt.online with a content blocker; the site works
        the same without them.
      </MDXParagraph>
    </LegalSection>

    <LegalSection title="Email">
      <MDXParagraph>
        If you email me, I process your email address, your message, and
        anything else you include, in order to reply. The legal basis is Art.
        6(1)(f) GDPR, my legitimate interest in answering messages, or Art.
        6(1)(b) GDPR if your message concerns a contract with me. I delete
        messages once they are no longer needed, unless I am legally required to
        keep them.
      </MDXParagraph>
      <MDXParagraph>
        My mailbox is hosted by the email provider MXroute, whose mail servers
        are in the United States, so your message is transferred to a country
        outside the EU.{' '}
        <Placeholder>
          legal safeguard for this transfer, for example standard contractual
          clauses
        </Placeholder>
        .
      </MDXParagraph>
    </LegalSection>

    <LegalSection title="No other third parties">
      <MDXParagraph>
        Fonts, images, and scripts load from this site&apos;s own server, except
        for the analytics script described above. There are no embedded videos,
        maps, social media plugins, comments, newsletter, or contact forms.
        Links to other websites, such as GitHub, LinkedIn, X, YouTube, and
        Coursera, are ordinary links: those sites receive data from your browser
        only when you follow a link, and their own privacy policies apply.
      </MDXParagraph>
    </LegalSection>

    <LegalSection title="Who receives your data">
      <MDXParagraph>
        Apart from me, only two service providers handle this data, and only on
        my behalf (Art. 28 GDPR): netcup as hosting provider and MXroute as
        email provider. Apart from email, no data leaves the EU. I do not sell
        your data or use it for advertising.
      </MDXParagraph>
    </LegalSection>

    <LegalSection title="Your rights">
      <MDXParagraph>
        You have the right to access the data I hold about you (Art. 15 GDPR),
        to have it corrected (Art. 16) or erased (Art. 17), to restrict its
        processing (Art. 18). Where I process your data based on your consent or
        a contract, and by automated means, you can also receive it in a
        portable format (Art. 20). Email me to use these rights.
      </MDXParagraph>
      <MDXCallout title="Right to object (Art. 21 GDPR)">
        Where I process your data based on legitimate interest, you can object
        at any time on grounds relating to your particular situation. I will
        then stop, unless I can demonstrate compelling legitimate grounds that
        override your interests, rights, and freedoms, or the processing serves
        to establish, exercise, or defend legal claims.
      </MDXCallout>
      <MDXParagraph>
        Umami&apos;s records contain no names or IP addresses, so I usually
        cannot tell which of them are yours. If you ask to access, correct,
        erase, restrict, or receive your Umami records (Art. 15 to 20), I can
        only act on that request if you give me additional information that
        identifies them (Art. 11(2) GDPR). This does not limit your right to
        object.
      </MDXParagraph>
      <MDXParagraph>
        You also have the right to lodge a complaint with a data protection
        supervisory authority (Art. 77 GDPR), in particular in the EU member
        state where you live, where you work, or where you think the
        infringement happened.
      </MDXParagraph>
    </LegalSection>

    <LegalSection title="Other information">
      <MDXParagraph>
        You are not legally or contractually required to provide personal data.
        Without the technical data in the server logs, the site cannot be
        delivered to your browser. I make no automated decisions about you,
        including profiling, within the meaning of Art. 22 GDPR.
      </MDXParagraph>
    </LegalSection>
  </LegalDocument>
);
