export interface FilterOption<T extends string> {
  title: string
  value: T
}

export const TONES = [
  {
    title: 'As is',
    value: 'as-it-is-tone',
  },
  {
    title: 'Informal',
    value: 'informal',
  },
  {
    title: 'Casual',
    value: 'casual',
  },
  {
    title: 'Professional',
    value: 'professional',
  },
] as const

export type ToneValue = (typeof TONES)[number]['value']

export const LENGTHS = [
  {
    title: 'As is',
    value: 'as-it-is-length',
  },
  {
    title: 'Short',
    value: 'short',
  },
  {
    title: 'Medium',
    value: 'medium',
  },
  {
    title: 'Long',
    value: 'long',
  },
] as const

export type LengthValue = (typeof LENGTHS)[number]['value']

export const ENHANCEMENTS = [
  {
    title: 'Intro hook',
    value: 'intro',
    tooltip: 'Start with a hook - engaging opening to grab attention ',
  },
  {
    title: 'Storytelling',
    value: 'storytelling',
    tooltip: 'Turn content into a narrative with a clear flow.',
  },
  {
    title: 'Add examples',
    value: 'examples',
    tooltip: 'Include examples to clarify ideas (if possible)',
  },
  {
    title: 'Summary (TLDR)',
    value: 'summary',
    tooltip: 'Provide summary of key points',
  },
  {
    title: 'Bullet points',
    value: 'bullets',
    tooltip: 'Break content into easy-to-scan bullet lists.',
  },
  {
    title: 'Headings',
    value: 'headings',
    tooltip: 'Organize content with clear section headings.',
  },
] as const

export type EnhancementValue = (typeof ENHANCEMENTS)[number]['value']

export type FilterValue = ToneValue | LengthValue | EnhancementValue

export const ALL_FILTERS: Record<FilterValue, string> = {
  'as-it-is-tone': 'Tone: As is',
  informal: 'Informal',
  casual: 'Casual',
  professional: 'Professional',
  'as-it-is-length': 'Length: As is',
  short: 'Short',
  medium: 'Medium',
  long: 'Long',

  examples: 'Add examples',
  storytelling: 'Storytelling',
  headings: 'Headings',
  summary: 'Summary (TLDR)',
  intro: 'Intro hook',
  bullets: 'Bullet points',
}
