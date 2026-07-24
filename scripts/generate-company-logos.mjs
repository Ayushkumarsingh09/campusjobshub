#!/usr/bin/env node
/**
 * Generate self-hosted company logo SVGs from Simple Icons (MIT).
 * Output: frontend/public/logos/{slug}.svg
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as si from 'simple-icons';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'frontend', 'public', 'logos');

/** CampusJobsHub company slug → simple-icons slug */
const SLUG_MAP = {
  google: 'google',
  microsoft: 'microsoft',
  amazon: 'amazon',
  meta: 'meta',
  apple: 'apple',
  netflix: 'netflix',
  adobe: 'adobe',
  oracle: 'oracle',
  ibm: 'ibm',
  tcs: 'tcs',
  infosys: 'infosys',
  wipro: 'wipro',
  accenture: 'accenture',
  cognizant: 'cognizant',
  capgemini: 'capgemini',
  deloitte: 'deloitte',
  hcl: 'hcl',
  zoho: 'zoho',
  'tech-mahindra': 'techmahindra',
  'lti-mindtree': 'ltimindtree',
  flipkart: 'flipkart',
  razorpay: 'razorpay',
  freshworks: 'freshworks',
  paytm: 'paytm',
  phonepe: 'phonepe',
};

const DISPLAY_NAMES = {
  google: 'Google',
  microsoft: 'Microsoft',
  amazon: 'Amazon',
  meta: 'Meta',
  apple: 'Apple',
  netflix: 'Netflix',
  adobe: 'Adobe',
  oracle: 'Oracle',
  ibm: 'IBM',
  tcs: 'TCS',
  infosys: 'Infosys',
  wipro: 'Wipro',
  accenture: 'Accenture',
  cognizant: 'Cognizant',
  capgemini: 'Capgemini',
  deloitte: 'Deloitte',
  hcl: 'HCL',
  zoho: 'Zoho',
  'tech-mahindra': 'Tech Mahindra',
  'lti-mindtree': 'LTIMindtree',
  flipkart: 'Flipkart',
  razorpay: 'Razorpay',
  freshworks: 'Freshworks',
  paytm: 'Paytm',
  phonepe: 'PhonePe',
};

function getIcon(siSlug) {
  const key = `si${siSlug.charAt(0).toUpperCase()}${siSlug.slice(1)}`;
  return si[key] ?? null;
}

function brandSvg(icon) {
  return `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="#${icon.hex}" d="${icon.path}"/></svg>`;
}

function initialsSvg(name, slug) {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const hue = [...slug].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-hidden="true">
  <rect width="64" height="64" rx="12" fill="hsl(${hue}, 55%, 42%)"/>
  <text x="32" y="38" text-anchor="middle" fill="white" font-family="system-ui,sans-serif" font-size="22" font-weight="600">${initials}</text>
</svg>`;
}

fs.mkdirSync(OUT_DIR, { recursive: true });

let brand = 0;
let fallback = 0;

for (const [slug, siSlug] of Object.entries(SLUG_MAP)) {
  const icon = getIcon(siSlug);
  const name = DISPLAY_NAMES[slug] ?? slug;
  const svg = icon ? brandSvg(icon) : initialsSvg(name, slug);
  fs.writeFileSync(path.join(OUT_DIR, `${slug}.svg`), svg, 'utf8');
  if (icon) brand++;
  else fallback++;
}

console.log(`Generated ${Object.keys(SLUG_MAP).length} logos → ${OUT_DIR}`);
console.log(`  Brand icons: ${brand}, Initials fallback: ${fallback}`);
