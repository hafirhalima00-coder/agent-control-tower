import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'text-green-500',
    idle: 'text-yellow-500',
    error: 'text-red-500',
    maintenance: 'text-blue-500',
    offline: 'text-gray-500',
    'in-progress': 'text-blue-500',
    completed: 'text-green-500',
    failed: 'text-red-500',
    pending: 'text-yellow-500',
    cancelled: 'text-gray-500',
    approved: 'text-green-500',
    rejected: 'text-red-500',
    expired: 'text-gray-500',
  };
  return colors[status] || 'text-gray-500';
}

export function getSeverityColor(severity: string): string {
  const colors: Record<string, string> = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    low: 'bg-blue-500',
    info: 'bg-gray-500',
  };
  return colors[severity] || 'bg-gray-500';
}

export function getRiskColor(risk: string): string {
  const colors: Record<string, string> = {
    critical: 'text-red-600 bg-red-50',
    high: 'text-orange-600 bg-orange-50',
    medium: 'text-yellow-600 bg-yellow-50',
    low: 'text-green-600 bg-green-50',
  };
  return colors[risk] || 'text-gray-600 bg-gray-50';
}
