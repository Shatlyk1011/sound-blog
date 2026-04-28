import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { CopyIcon, PencilEdit02Icon, SparklesIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

interface Props {
  handleCopy: () => void
}

export function ActionBar({ handleCopy }: Props) {

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4 py-2">
      <Button variant={'secondary'}>
        <HugeiconsIcon icon={PencilEdit02Icon} size={16} />
        Edit Article
      </Button>

      <div className='flex flex-1 justify-end'>
        <Tooltip >
          <TooltipTrigger asChild >
            <Button
              variant={'ghost'}
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
            >
            <HugeiconsIcon icon={CopyIcon} />
          </Button>
          </TooltipTrigger>
          <TooltipContent >
            <p>Copy MDX</p>
          </TooltipContent>
        </Tooltip>

        {/* <Tooltip >
          <TooltipTrigger asChild >
            <Button variant={'ghost'} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
        <HugeiconsIcon icon={SparklesIcon} />
        
      </Button>
          </TooltipTrigger>
          <TooltipContent >
            <p>Regenerate</p>
          </TooltipContent>
        </Tooltip> */}


        

      
      </div>
    </div>
  )
}
