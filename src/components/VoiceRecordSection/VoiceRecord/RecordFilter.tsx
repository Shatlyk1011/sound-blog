import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { ChevronDown, Info } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ALL_FILTERS,
  ENHANCEMENTS,
  LENGTHS,
  TONES,
  type FilterValue,
  type LengthValue,
  type ToneValue,
  EnhancementValue,
} from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface Props {
  selectedFilters: FilterValue[]
  setSelectedFilters: Dispatch<SetStateAction<FilterValue[]>>
}

const RecordFilter = ({ selectedFilters, setSelectedFilters }: Props) => {
  const [open, setOpen] = useState(false)

  const [tone, setTone] = useState<ToneValue>(TONES[0].value)
  const [blogLength, setBlogeLength] = useState<LengthValue>(LENGTHS[0].value)
  const [selectedEnhancements, setSelectedEnhancements] = useState<EnhancementValue[]>(['summary', 'headings'])

  const toggleEnhancement = (value: EnhancementValue) => {
    setSelectedEnhancements((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
  }

  useEffect(() => {
    setSelectedFilters([tone, blogLength, ...selectedEnhancements])
  }, [tone, blogLength, selectedEnhancements, setSelectedFilters])

  return (
    <>
      <div className='mb-4 flex w-full flex-col items-start gap-3 text-sm'>
        <h4 className='text-foreground/80 tracking-one flex items-center gap-1.5 font-medium uppercase'>
          Selected Filters
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <HugeiconsIcon icon={Info} size={16} />
              </span>
            </TooltipTrigger>

            <TooltipContent>
              These filters will control how your blog is generated, influencing tone, structure, and level of detail.
            </TooltipContent>
          </Tooltip>
        </h4>

        <ul className='text-secondary-foreground flex flex-wrap gap-2.5 text-sm font-medium'>
          {selectedFilters.map((key) => (
            <li className='bg-secondary/60 rounded-full border border-current/20 px-3 py-1' key={key}>
              {ALL_FILTERS[key as keyof typeof ALL_FILTERS]}
            </li>
          ))}
        </ul>
      </div>
      <div
        className={cn(
          'relative mr-auto w-full overflow-hidden rounded-2xl border border-transparent',
          open && 'border-secondary-foreground/30'
        )}
      >
        <div className={cn(`relative cursor-pointer p-5 transition`, open ? 'bg-muted' : 'bg-muted/50')}>
          {/* top */}
          <div
            onClick={() => setOpen(!open)}
            role='button'
            className='relative z-10 flex h-auto items-center justify-between gap-4'
          >
            <h4 className='tracking-one text-start text-lg leading-7 font-semibold'>Adjust Filters</h4>
            <button type='button' className={cn('duration-300', open ? 'rotate-180' : 'rotate-0')} title='Expand'>
              <HugeiconsIcon icon={ChevronDown} />
            </button>
          </div>

          {/* accordion */}
          <div
            className={cn(
              'z-10 grid transition-all duration-300 ease-out',
              open ? 'grid-rows-[1fr] pt-6' : 'grid-rows-[0fr]'
            )}
          >
            <div className={cn('tracking-one z-10 space-y-8 overflow-hidden text-left transition-all duration-300')}>
              {/* Blog tone filter  */}
              <div className='space-y-2.5'>
                <h4 className='text-muted-foreground -tracking-one text-sm font-medium uppercase'>Tone</h4>
                <ButtonGroup className='w-full'>
                  {TONES.map(({ title, value }) => (
                    <Button
                      key={value}
                      variant='default'
                      size='lg'
                      type='button'
                      onClick={() => setTone(value)}
                      className={cn(
                        'bg-chart-2/80 border-chart-2/30 tracking-two hover:bg-chart-2 flex-1 text-sm',
                        tone !== value && 'bg-secondary/80 hover:bg-secondary text-muted-foreground'
                      )}
                    >
                      {title}
                    </Button>
                  ))}
                </ButtonGroup>
              </div>

              {/* Blog length filter  */}
              <div className='space-y-2.5'>
                <h4 className='text-muted-foreground -tracking-one text-sm font-medium uppercase'>Length</h4>
                <ButtonGroup className='w-full'>
                  {LENGTHS.map(({ title, value }) => (
                    <Button
                      key={value}
                      variant='default'
                      size='lg'
                      type='button'
                      onClick={() => setBlogeLength(value)}
                      className={cn(
                        'bg-chart-2/80 border-chart-2/30 tracking-two hover:bg-chart-2 flex-1 text-sm',
                        blogLength !== value && 'bg-secondary/80 hover:bg-secondary text-muted-foreground'
                      )}
                    >
                      {title}
                    </Button>
                  ))}
                </ButtonGroup>
              </div>

              {/* Enhancements  */}
              <div className='space-y-2.5'>
                <h4 className='text-muted-foreground -tracking-one text-sm font-medium uppercase'>Enhancements</h4>
                <ul className='tracking-one grid grid-cols-2 gap-x-14 gap-y-3 text-sm leading-[150%] text-nowrap'>
                  {ENHANCEMENTS.map(({ title, value, tooltip }) => (
                    <li key={value} className='-tracking-one flex basis-[40%] items-center justify-between gap-2'>
                      <div className='flex items-center gap-2'>
                        <label className='flex-1 cursor-pointer' htmlFor={value}>
                          {title}
                        </label>
                        <Tooltip>
                          <TooltipTrigger>
                            <HugeiconsIcon icon={Info} size={16} />
                          </TooltipTrigger>
                          <TooltipContent>{tooltip}</TooltipContent>
                        </Tooltip>
                      </div>

                      <Switch
                        id={value}
                        checked={selectedEnhancements.includes(value)}
                        onCheckedChange={() => toggleEnhancement(value)}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* gradient border */}
        {!open && (
          <div
            className={cn('absolute inset-0 z-[-1] transition-opacity', open ? 'opacity-0' : 'opacity-100')}
            style={{
              backgroundImage: 'linear-gradient(175deg, rgba(255, 255, 255, 0.30) 6%, rgba(255, 255, 255, 0.04) 36%)',
            }}
          ></div>
        )}
      </div>
    </>
  )
}

export default RecordFilter
