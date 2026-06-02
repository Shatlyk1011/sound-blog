export const PERSONAL_DATA_CONSENT_KEY = 'sound-blog:personal-data-consent'
export const PERSONAL_DATA_CONSENT_EVENT = 'sound-blog:personal-data-consent-updated'

export type PersonalDataConsent = 'accepted' | 'declined'

export function getPersonalDataConsent(): PersonalDataConsent | null {
  if (typeof window === 'undefined') return null

  const consent = window.localStorage.getItem(PERSONAL_DATA_CONSENT_KEY)

  if (consent === 'accepted' || consent === 'declined') {
    return consent
  }

  return null
}

export function setPersonalDataConsent(consent: PersonalDataConsent) {
  window.localStorage.setItem(PERSONAL_DATA_CONSENT_KEY, consent)
  window.dispatchEvent(new CustomEvent(PERSONAL_DATA_CONSENT_EVENT, { detail: consent }))
}
