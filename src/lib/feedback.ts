export const feedbackTypeValues = ['improvement', 'bug', 'question', 'other'] as const

export type FeedbackType = (typeof feedbackTypeValues)[number]

export const FEEDBACK_TYPE_OPTIONS = [
  { value: 'improvement', label: 'Improvement idea' },
  { value: 'bug', label: 'Bug report' },
  { value: 'question', label: 'Question' },
  { value: 'other', label: 'Other' },
] as const satisfies ReadonlyArray<{ value: FeedbackType; label: string }>
