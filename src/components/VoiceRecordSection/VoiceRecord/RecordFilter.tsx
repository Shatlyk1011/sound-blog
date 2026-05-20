import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react'
import { ChevronDown, Info } from '@hugeicons/core-free-icons'
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

const DEFAULT_ENHANCEMENTS: EnhancementValue[] = ['summary', 'headings']

const RecordFilter = ({ selectedFilters, setSelectedFilters }: Props) => {
  const [open, setOpen] = useState(false)

  const [tone, setTone] = useState<ToneValue>(TONES[0].value)
  const [blogLength, setBlogLength] = useState<LengthValue>(LENGTHS[0].value)
  const [selectedEnhancements, setSelectedEnhancements] = useState<EnhancementValue[]>(DEFAULT_ENHANCEMENTS)

  const filters = selectedFilters.length ? selectedFilters : [tone, blogLength, ...selectedEnhancements]

  const toggleEnhancement = (value: EnhancementValue) => {
    setSelectedEnhancements((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
  }

  const resetFilters = () => {
    setTone(TONES[0].value)
    setBlogLength(LENGTHS[0].value)
    setSelectedEnhancements(DEFAULT_ENHANCEMENTS)
  }

  useEffect(() => {
    setSelectedFilters([tone, blogLength, ...selectedEnhancements])
  }, [tone, blogLength, selectedEnhancements, setSelectedFilters])

  return (
    <div className='w-full space-y-3'>
      <div className='border-border/70 bg-card/70 rounded-3xl border p-4 shadow-sm'>
        <div className='mb-3 flex items-center justify-between gap-3'>
          <div className='text-left'>
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

        <ul className='flex flex-wrap gap-2 text-sm font-medium'>
          {filters.map((key) => (
            <li
              className='border-border/70 bg-background/80 text-foreground/80 rounded-full border px-3 py-1.5 shadow-sm'
              key={key}
            >
              {ALL_FILTERS[key as keyof typeof ALL_FILTERS]}
            </li>
          ))}
        </ul>
      </div>

      <div
        className={cn(
          'border-border/70 bg-card/70 relative w-full overflow-hidden rounded-3xl border text-left shadow-sm transition-all',
          open && 'shadow-[0_18px_50px_rgba(0,0,0,0.06)]'
        )}
      >
        <button
          type='button'
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className='hover:bg-muted/35 flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition'
        >
          <div>
            <h4 className='tracking-one text-lg leading-7 font-semibold'>Adjust filters</h4>
            <p className='text-muted-foreground text-sm'>
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
            <div className='space-y-6 p-5'>
              <PreferenceGroup label='Tone' description='Choose how the final article should sound.'>
                <div className='grid grid-cols-4 gap-2 max-sm:grid-cols-2'>
                  {TONES.map(({ title, value }) => (
                    <Button
                      key={value}
                      variant='outline'
                      size='lg'
                      type='button'
                      onClick={() => setTone(value)}
                      className={cn(
                        'h-11 rounded-2xl border text-sm shadow-none',
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
                <div className='grid grid-cols-4 gap-2 max-sm:grid-cols-2'>
                  {LENGTHS.map(({ title, value }) => (
                    <Button
                      key={value}
                      variant='outline'
                      size='lg'
                      type='button'
                      onClick={() => setBlogLength(value)}
                      className={cn(
                        'h-11 rounded-2xl border text-sm shadow-none',
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
                <ul className='grid grid-cols-2 gap-2 max-sm:grid-cols-1'>
                  {ENHANCEMENTS.map(({ title, value, tooltip }) => {
                    const checked = selectedEnhancements.includes(value)

                    return (
                      <li
                        key={value}
                        className={cn(
                          'border-border/70 bg-background/70 rounded-2xl border p-3 transition-colors',
                          checked && 'border-chart-2/40 bg-chart-2/5'
                        )}
                      >
                        <div className='flex items-center justify-between gap-3'>
                          <div className='flex min-w-0 items-center gap-2'>
                            <label className='cursor-pointer truncate text-sm font-medium' htmlFor={value}>
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

              <div className='border-border/70 flex items-center justify-between gap-3 border-t pt-4 max-sm:flex-col max-sm:items-stretch'>
                <p className='text-muted-foreground text-xs'>Recommended: Keep the original tone and length .</p>
                <Button type='button' variant='ghost' size='sm' className='rounded-full' onClick={resetFilters}>
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
      <p className='text-muted-foreground mt-1 text-xs'>{description}</p>
    </div>
    {children}
  </section>
)

export default RecordFilter
