import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export const statusColor = {
  uploaded: 'text-chart-2 bg-chart-2/10',
  completed: 'text-emerald-600 bg-emerald-200 dark:bg-emerald-500/10',
  processing: 'text-chart-2 bg-chart-2/10',
  failed: 'text-red-500 bg-red-50 dark:bg-red-500/10',
}

export const copyToClipboard = async (textToCopy: string) => {
  if ('clipboard' in navigator) {
    return await navigator.clipboard.writeText(textToCopy)
  } else {
    return document.execCommand('copy', true, textToCopy)
  }
}
