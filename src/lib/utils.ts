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

export function getStatusColor(status: string) {
  switch (status) {
    case 'completed':
      return 'text-emerald-600 bg-emerald-200 dark:bg-emerald-500/10'
    case 'processing':
      return 'text-blue-500 bg-blue-50 dark:bg-blue-500/10'
    case 'failed':
      return 'text-red-500 bg-red-50 dark:bg-red-500/10'
    default:
      return 'text-stone-400 bg-stone-50 dark:bg-stone-500/10'
  }
}

export const copyToClipboard = async (textToCopy: string) => {
  if ('clipboard' in navigator) {
    return await navigator.clipboard.writeText(textToCopy)
  } else {
    return document.execCommand('copy', true, textToCopy)
  }
}
