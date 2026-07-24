'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cookie, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export interface ConsentPreferences {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
}

const CONSENT_KEY = 'cookie-consent';
const CONSENT_VERSION = '1';

export function getStoredConsent(): ConsentPreferences | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed.preferences as ConsentPreferences;
  } catch {
    return null;
  }
}

export function storeConsent(preferences: ConsentPreferences) {
  localStorage.setItem(
    CONSENT_KEY,
    JSON.stringify({ version: CONSENT_VERSION, preferences, timestamp: Date.now() })
  );
  window.dispatchEvent(new CustomEvent('consent-updated', { detail: preferences }));
}

interface CookieBannerProps {
  className?: string;
}

export function CookieBanner({ className }: CookieBannerProps) {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    if (!stored) setVisible(true);
  }, []);

  function acceptAll() {
    const prefs: ConsentPreferences = { necessary: true, analytics: true, marketing: true };
    storeConsent(prefs);
    setVisible(false);
  }

  function rejectNonEssential() {
    const prefs: ConsentPreferences = { necessary: true, analytics: false, marketing: false };
    storeConsent(prefs);
    setVisible(false);
  }

  function savePreferences() {
    const prefs: ConsentPreferences = { necessary: true, analytics, marketing };
    storeConsent(prefs);
    setVisible(false);
    setShowSettings(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 p-4 shadow-lg backdrop-blur sm:p-6',
        className
      )}
    >
      <div className="container-wide">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex gap-3">
            <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" aria-hidden />
            <div className="space-y-2">
              <p className="text-sm font-medium">We value your privacy</p>
              <p className="max-w-2xl text-sm text-muted-foreground">
                We use cookies to improve your experience, analyze traffic, and show relevant
                content. You can customize your preferences or accept all cookies.{' '}
                <Link href="/cookie-policy" className="underline hover:text-foreground">
                  Learn more
                </Link>
              </p>

              {showSettings && (
                <div className="mt-4 space-y-3 rounded-lg border bg-card p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium">Necessary</p>
                      <p className="text-xs text-muted-foreground">Required for the site to work</p>
                    </div>
                    <span className="text-xs text-muted-foreground">Always on</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="consent-analytics" className="cursor-pointer space-y-0.5">
                      <p className="text-sm font-medium">Analytics</p>
                      <p className="text-xs font-normal text-muted-foreground">
                        Help us understand how you use the site
                      </p>
                    </Label>
                    <input
                      id="consent-analytics"
                      type="checkbox"
                      checked={analytics}
                      onChange={(e) => setAnalytics(e.target.checked)}
                      className="h-4 w-4 rounded border-input"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="consent-marketing" className="cursor-pointer space-y-0.5">
                      <p className="text-sm font-medium">Marketing</p>
                      <p className="text-xs font-normal text-muted-foreground">
                        Personalized ads and promotions
                      </p>
                    </Label>
                    <input
                      id="consent-marketing"
                      type="checkbox"
                      checked={marketing}
                      onChange={(e) => setMarketing(e.target.checked)}
                      className="h-4 w-4 rounded border-input"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings2 className="h-4 w-4" />
              Customize
            </Button>
            <Button variant="outline" size="sm" onClick={rejectNonEssential}>
              Reject all
            </Button>
            {showSettings ? (
              <Button variant="brand" size="sm" onClick={savePreferences}>
                Save preferences
              </Button>
            ) : (
              <Button variant="brand" size="sm" onClick={acceptAll}>
                Accept all
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
