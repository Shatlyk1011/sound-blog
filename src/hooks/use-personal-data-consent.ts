'use client'

import { useSyncExternalStore } from 'react'
import { getPersonalDataConsent, PERSONAL_DATA_CONSENT_EVENT, type PersonalDataConsent } from '@/lib/privacy-consent'

export type PersonalDataConsentSnapshot = PersonalDataConsent | 'pending'

function subscribeToConsentUpdates(onStoreChange: () => void) {
  window.addEventListener(PERSONAL_DATA_CONSENT_EVENT, onStoreChange)
  window.addEventListener('storage', onStoreChange)

  return () => {
    window.removeEventListener(PERSONAL_DATA_CONSENT_EVENT, onStoreChange)
    window.removeEventListener('storage', onStoreChange)
  }
}

function getConsentSnapshot(): PersonalDataConsentSnapshot {
  return getPersonalDataConsent() ?? 'pending'
}

export function usePersonalDataConsent() {
  return useSyncExternalStore(subscribeToConsentUpdates, getConsentSnapshot, () => 'declined')
}
