import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react'
import { ChevronDown, Info, Tick01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ALL_FILTERS,
  ENHANCEMENTS,
  LENGTHS,
  TONES,
  type EnhancementValue,
  type FilterValue,
  type LengthValue,
  type ToneValue,
} from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface Props {
  selectedFilters: FilterValue[]
  setSelectedFilters: Dispatch<SetStateAction<FilterValue[]>>
}

const DEFAULT_ENHANCEMENTS: EnhancementValue[] = ['summary']

const RecordFilter = ({ selectedFilters, setSelectedFilters }: Props) => {
  const [open, setOpen] = useState(false)

  const [tone, setTone] = useState<ToneValue>(TONES[0].value)
  const [blogLength, setBlogLength] = useState<LengthValue>(LENGTHS[0].value)
  const [selectedEnhancements, setSelectedEnhancements] = useState<EnhancementValue[]>(DEFAULT_ENHANCEMENTS)
  const [includeGptAnalysis, setIncludeGptAnalysis] = useState(false)

  const filters = selectedFilters.length ? selectedFilters : [tone, blogLength, ...selectedEnhancements]

  const toggleEnhancement = (value: EnhancementValue) => {
    setSelectedEnhancements((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
  }

  const resetFilters = () => {
    setTone(TONES[0].value)
    setBlogLength(LENGTHS[0].value)
    setSelectedEnhancements(DEFAULT_ENHANCEMENTS)
    setIncludeGptAnalysis(false)
  }

  useEffect(() => {
    const filtersToSet: FilterValue[] = [tone, blogLength, ...selectedEnhancements]
    if (includeGptAnalysis) {
      filtersToSet.push('gpt-analysis')
    }
    setSelectedFilters(filtersToSet)
  }, [tone, blogLength, selectedEnhancements, includeGptAnalysis, setSelectedFilters])

  return (
    <div className='w-full space-y-3'>
      <div className='border-border/70 bg-card/70 rounded-[1.5rem] border p-4 shadow-sm sm:rounded-3xl sm:p-5'>
        <div className='mb-3 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center'>
          <div className='min-w-0 text-left'>
            <h4 className='text-foreground flex items-center gap-1.5 text-sm font-semibold'>
              Generation preferences
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className='text-muted-foreground hover:text-foreground inline-flex cursor-help'>
                    <HugeiconsIcon icon={Info} size={15} />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  These filters control your blog tone, target length, structure, and level of detail.
                </TooltipContent>
              </Tooltip>
            </h4>
            <p className='text-muted-foreground mt-0.5 text-xs'>Applied to the article generated from this audio.</p>
          </div>
          <span className='bg-chart-2/10 text-chart-2 rounded-full px-2.5 py-1 text-xs font-semibold'>
            {filters.length} active
          </span>
        </div>

        <ul className='flex flex-wrap gap-2 text-xs font-medium sm:text-sm'>
          {filters.map((key) => (
            <li
              className='border-border/70 bg-background/80 text-foreground/80 rounded-full border px-2.5 py-1.5 shadow-sm sm:px-3'
              key={key}
            >
              {ALL_FILTERS[key as keyof typeof ALL_FILTERS]}
            </li>
          ))}
        </ul>
      </div>

      <div
        className={cn(
          'border-border/70 bg-card/70 relative w-full overflow-hidden rounded-[1.5rem] border text-left shadow-sm transition-all sm:rounded-3xl',
          open && 'shadow-[0_18px_50px_rgba(0,0,0,0.06)]'
        )}
      >
        <button
          type='button'
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className='hover:bg-muted/35 flex w-full items-start justify-between gap-4 px-4 py-4 text-left transition sm:items-center sm:px-5'
        >
          <div className='min-w-0'>
            <h4 className='tracking-one text-base leading-6 font-semibold sm:text-lg sm:leading-7'>Adjust filters</h4>
            <p className='text-muted-foreground text-xs sm:text-sm'>
              Fine tune the voice, length, and formatting before generating.
            </p>
          </div>
          <span
            className={cn(
              'border-border bg-background grid size-9 shrink-0 place-items-center rounded-full border transition-transform duration-300',
              open && 'rotate-180'
            )}
          >
            <HugeiconsIcon icon={ChevronDown} className='size-4' />
          </span>
        </button>

        <div
          className={cn(
            'grid transition-all duration-300 ease-out',
            open ? 'grid-rows-[1fr] border-t' : 'grid-rows-[0fr]'
          )}
        >
          <div className='overflow-hidden'>
            <div className='space-y-5 p-4 sm:space-y-6 sm:p-5'>
              <PreferenceGroup label='Tone' description='Choose how the final article should sound.'>
                <div className='grid grid-cols-2 gap-2 lg:grid-cols-4'>
                  {TONES.map(({ title, value }) => (
                    <Button
                      key={value}
                      variant='outline'
                      size='lg'
                      type='button'
                      onClick={() => setTone(value)}
                      className={cn(
                        'h-10 rounded-2xl border px-3 text-sm shadow-none sm:h-11',
                        tone === value
                          ? 'border-chart-2 bg-chart-2 hover:bg-chart-2/90 text-white'
                          : 'bg-background/70 text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                      )}
                    >
                      {title}
                    </Button>
                  ))}
                </div>
              </PreferenceGroup>

              <PreferenceGroup label='Length' description='Set the amount of expansion and detail.'>
                <div className='grid grid-cols-2 gap-2 lg:grid-cols-4'>
                  {LENGTHS.map(({ title, value }) => (
                    <Button
                      key={value}
                      variant='outline'
                      size='lg'
                      type='button'
                      onClick={() => setBlogLength(value)}
                      className={cn(
                        'h-10 rounded-2xl border px-3 text-sm shadow-none sm:h-11',
                        blogLength === value
                          ? 'border-chart-2 bg-chart-2 hover:bg-chart-2/90 text-white'
                          : 'bg-background/70 text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                      )}
                    >
                      {title}
                    </Button>
                  ))}
                </div>
              </PreferenceGroup>

              <PreferenceGroup
                label='Enhancements'
                description='Add extra structure so the draft is easier to read and publish.'
              >
                <ul className='grid grid-cols-1 gap-2 lg:grid-cols-2'>
                  {ENHANCEMENTS.map(({ title, value, tooltip }) => {
                    const checked = selectedEnhancements.includes(value)

                    return (
                      <li
                        key={value}
                        className={cn(
                          'border-border/70 bg-background/70 rounded-2xl border p-3 transition-colors sm:p-3.5',
                          checked && 'border-chart-2/40 bg-chart-2/5'
                        )}
                      >
                        <div className='flex items-start justify-between gap-3 sm:items-center'>
                          <div className='flex min-w-0 items-start gap-2 sm:items-center'>
                            <label className='cursor-pointer text-sm leading-5 font-medium sm:truncate' htmlFor={value}>
                              {title}
                            </label>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className='text-muted-foreground hover:text-foreground inline-flex cursor-help'>
                                  <HugeiconsIcon icon={Info} size={15} />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>{tooltip}</TooltipContent>
                            </Tooltip>
                          </div>

                          <Switch id={value} checked={checked} onCheckedChange={() => toggleEnhancement(value)} />
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </PreferenceGroup>

              <div className='border-border/70 border-t pt-4 sm:pt-5'>
                <div
                  className={cn(
                    'border-border/70 bg-background/70 rounded-2xl border p-3.5 transition-colors',
                    includeGptAnalysis && 'border-chart-2/40 bg-chart-2/5'
                  )}
                >
                  <label className='group flex cursor-pointer items-start gap-3.5' htmlFor='gpt-analysis-checkbox'>
                    <div className='relative mt-0.5 flex items-center'>
                      <input
                        type='checkbox'
                        id='gpt-analysis-checkbox'
                        checked={includeGptAnalysis}
                        onChange={(e) => setIncludeGptAnalysis(e.target.checked)}
                        className='peer sr-only'
                      />
                      <div className='border-input bg-background group-hover:border-chart-2/50 peer-checked:border-chart-2 peer-checked:bg-chart-2 flex size-5 items-center justify-center rounded-md border text-white shadow-sm transition-all'>
                        <HugeiconsIcon
                          icon={Tick01Icon}
                          className='size-3.5 opacity-0 transition-opacity peer-checked:opacity-100'
                          strokeWidth={3}
                        />
                      </div>
                    </div>
                    <div className='min-w-0 flex-1'>
                      <span className='text-foreground flex items-center gap-1.5 text-sm font-semibold'>
                        GPT Analysis
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className='text-muted-foreground hover:text-foreground inline-flex cursor-help'>
                              <HugeiconsIcon icon={Info} size={15} />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            Include a GPT evaluation of whether the blog reasoning is sound or potentially misleading.
                          </TooltipContent>
                        </Tooltip>
                      </span>
                      <p className='text-muted-foreground mt-0.5 text-xs leading-relaxed'>
                        Analyze the overall logic, identify whether the blog is true, or if thoughts are misleading.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div className='border-border/70 flex flex-col items-stretch justify-between gap-3 border-t pt-4 sm:flex-row sm:items-center'>
                <p className='text-muted-foreground text-xs'>Recommended: Keep the original tone and length.</p>
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  className='w-full rounded-full sm:w-auto'
                  onClick={resetFilters}
                >
                  Reset defaults
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const PreferenceGroup = ({
  label,
  description,
  children,
}: {
  label: string
  description: string
  children: ReactNode
}) => (
  <section className='space-y-3'>
    <div>
      <h5 className='text-foreground text-sm font-semibold tracking-[0.14em] uppercase'>{label}</h5>
      <p className='text-muted-foreground mt-1 max-w-2xl text-xs leading-5'>{description}</p>
    </div>
    {children}
  </section>
)

export default RecordFilter
