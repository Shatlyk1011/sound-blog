export interface FilterOption<T extends string> {
  title: string;
  value: T;
}

export const TONES = [
  {
    title: 'As it is',
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
] as const;

export type ToneValue = (typeof TONES)[number]['value'];

export const LENGTHS = [
  {
    title: 'As it is',
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
] as const;

export type LengthValue = (typeof LENGTHS)[number]['value'];

export const ENHANCEMENTS = [
  {
    title: 'Add examples',
    value: 'examples',
  },
  {
    title: 'Storytelling',
    value: 'storytelling',
  },
  {
    title: 'Headings',
    value: 'headings',
  },
  {
    title: 'Summary (TLDR)',
    value: 'summary',
  },
  {
    title: 'Intro hook',
    value: 'intro',
  },
  {
    title: 'Bullet points',
    value: 'bullets',
  },
] as const;

export type EnhancementValue = (typeof ENHANCEMENTS)[number]['value'];

export type FilterValue = ToneValue | LengthValue | EnhancementValue;

export const ALL_FILTERS: Record<FilterValue, string> = {
  informal: 'Informal',
  casual: 'Casual',
  professional: 'Professional',
  short: 'Short',
  medium: 'Medium',
  'as-it-is-tone': 'Tone: As it is',
  'as-it-is-length': 'Length: As it is',
  long: 'Long',
  examples: 'Add examples',
  storytelling: 'Storytelling',
  headings: 'Headings',
  summary: 'Summary (TLDR)',
  intro: 'Intro hook',
  bullets: 'Bullet points',
  
};