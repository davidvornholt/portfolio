import Script from 'next/script';
import {
  umamiScriptUrl,
  umamiTrackedDomain,
  umamiWebsiteId,
} from '@/config/analytics';

/**
 * The Umami tracker, kept out of the root layout so its wiring stays testable:
 * `layout.tsx` cannot be imported outside the Next.js compiler because of its
 * `next/font` calls, and every way this element breaks is silent in a browser.
 */
export const AnalyticsScript = () => (
  <Script
    src={umamiScriptUrl}
    data-website-id={umamiWebsiteId}
    data-domains={umamiTrackedDomain}
    strategy="afterInteractive"
  />
);
