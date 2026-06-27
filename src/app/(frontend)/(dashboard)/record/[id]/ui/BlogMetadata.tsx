import { FC } from 'react'
import {
  AddToListIcon,
  BookOpen01Icon,
  Briefcase01Icon,
  Calendar03Icon,
  File02Icon,
  FilterIcon,
  FishingHookIcon,
  Heading01Icon,
  LeftToRightListBulletIcon,
  MessageUser01Icon,
  ParagraphIcon,
  SmileIcon,
  Sparkle,
  TextAlignLeftIcon,
  TextFontIcon,
  TextNumberSignIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import { ALL_FILTERS, FilterValue } from '@/lib/constants'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

const FILTER_ICONS: Record<FilterValue, IconSvgElement> = {
  'as-it-is-tone': TextFontIcon,
  informal: MessageUser01Icon,
  casual: SmileIcon,
  professional: Briefcase01Icon,
  'as-it-is-length': TextAlignLeftIcon,
  short: ParagraphIcon,
  medium: File02Icon,
  long: BookOpen01Icon,
  examples: AddToListIcon,
  storytelling: BookOpen01Icon,
  headings: Heading01Icon,
  summary: TextNumberSignIcon,
  intro: FishingHookIcon,
  bullets: LeftToRightListBulletIcon,
  'gpt-analysis': Sparkle,
}

interface Props {
  createdAt: string
  filters?: string | null
}

const BlogMetadata: FC<Props> = ({ createdAt, filters }: Props) => {
  let filtersArr: string[] = []

  try {
    const parsedFilters = filters ? JSON.parse(filters) : []
    filtersArr = Array.isArray(parsedFilters) ? parsedFilters : []
  } catch {
    filtersArr = []
  }

  return (
    <div className='mt-6 flex flex-wrap items-center justify-between gap-3 text-sm font-medium'>
      {filtersArr.length > 0 && (
        <div className='flex min-w-0 flex-wrap items-center gap-2'>
          <span className='text-muted-foreground tracking-four inline-flex items-center gap-1.5 text-xs font-semibold uppercase'>
            <HugeiconsIcon icon={FilterIcon} className='size-3.5' />
            Filters
          </span>
          {filtersArr.map((filter: string) => {
            const filterValue = filter as FilterValue
            const filterLabel = ALL_FILTERS[filterValue] ?? filter
            const filterIcon = FILTER_ICONS[filterValue] ?? FilterIcon

            return (
              <Tooltip key={filter}>
                <TooltipTrigger asChild>
                  <span
                    aria-label={filterLabel}
                    className='border-border/70 bg-background/70 text-foreground/80 hover:border-chart-2/50 hover:bg-chart-2/10 hover:text-chart-2 inline-flex size-9 cursor-help items-center justify-center rounded-full border transition-colors'
                    role='img'
                    tabIndex={0}
                  >
                    <HugeiconsIcon icon={filterIcon} className='size-4' />
                  </span>
                </TooltipTrigger>
                <TooltipContent sideOffset={6}>{filterLabel}</TooltipContent>
              </Tooltip>
            )
          })}
        </div>
      )}
      <time
        className='text-muted-foreground inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm'
        dateTime={createdAt}
      >
        <HugeiconsIcon icon={Calendar03Icon} className='size-4' />
        {new Intl.DateTimeFormat('en-US', {
          dateStyle: 'long',
        }).format(new Date(createdAt))}
      </time>
    </div>
  )
}
export default BlogMetadata
