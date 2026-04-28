import {
  CopyIcon,
  Loading03Icon,
  PencilEdit02Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface Props {
  handleCopy: () => void
  isEditing: boolean
  isSaving: boolean
  onEditClick: () => void
  onSaveClick: () => void
  onCancelClick: () => void
}

export function ActionBar({ handleCopy, isEditing, isSaving, onEditClick, onSaveClick, onCancelClick }: Props) {
  return (
    <div className='mb-4 flex flex-wrap items-center gap-2 py-2'>
      {isEditing ? (
        <>
          <Button className='rounded-full' onClick={onSaveClick} disabled={isSaving}>
            {isSaving && <HugeiconsIcon icon={Loading03Icon} size={16} />}
            Save Article
          </Button>
          <Button className='rounded-full' variant={'destructive'} onClick={onCancelClick} disabled={isSaving}>
            {isSaving && <HugeiconsIcon icon={Loading03Icon} size={16} />}
            Cancel Editing
          </Button>
        </>
      ) : (
          <Button variant={'outline'} onClick={onEditClick}>
          <HugeiconsIcon icon={PencilEdit02Icon} size={16} />
          Edit Article
        </Button>
      )}

      <div className='flex flex-1 justify-end'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={'ghost'}
              onClick={handleCopy}
              className='text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors'
            >
              <HugeiconsIcon icon={CopyIcon} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
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
