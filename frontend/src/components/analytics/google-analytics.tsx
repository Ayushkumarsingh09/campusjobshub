'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { getStoredConsent, type ConsentPreferences } from '@/components/consent/cookie-banner';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export function GoogleAnalytics() {
  const [consent, setConsent] = useState<ConsentPreferences | null>(null);

  useEffect(() => {
    setConsent(getStoredConsent());

    function handleConsentUpdate(e: Event) {
      setConsent((e as CustomEvent<ConsentPreferences>).detail);
    }

    window.addEventListener('consent-updated', handleConsentUpdate);
    return () => window.removeEventListener('consent-updated', handleConsentUpdate);
  }, []);

  if (!GA_ID || !consent?.analytics) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            anonymize_ip: true,
            cookie_flags: 'SameSite=None;Secure'
          });
        `}
      </Script>
    </>
  );
}
