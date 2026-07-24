import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSalary(min?: number | null, max?: number | null): string {
  if (!min && !max) return 'Not disclosed';
  const fmt = (n: number) => {
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)} LPA`;
    return `₹${n.toLocaleString('en-IN')}`;
  };
  if (min && max) return `${fmt(min)} - ${fmt(max)}`;
  return min ? fmt(min) : max ? fmt(max!) : 'Not disclosed';
}

export function formatStipend(min?: number | null, max?: number | null): string {
  if (!min && !max) return 'Unpaid';
  const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}/mo`;
  if (min && max) return `${fmt(min)} - ${fmt(max)}`;
  return min ? fmt(min) : max ? fmt(max!) : 'Unpaid';
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function timeAgo(date: string | Date): string {
  const d = new Date(date);
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '…';
}
