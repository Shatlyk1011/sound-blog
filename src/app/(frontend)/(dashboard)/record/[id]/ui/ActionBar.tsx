import { ReactNode } from 'react'
import { CopyIcon, Loading03Icon, PencilEdit02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface Props {
  handleCopy: () => void
  isEditing: boolean
  isSaving: boolean
  onEditClick: () => void
  onSaveClick: () => void
  onCancelClick: () => void
  textReaderSlot?: ReactNode
}

export function ActionBar({
  handleCopy,
  isEditing,
  isSaving,
  onEditClick,
  onSaveClick,
  onCancelClick,
  textReaderSlot,
}: Props) {
  return (
    <div className='mb-4 flex min-h-14 flex-wrap items-start gap-2'>
      {isEditing ? (
        <>
          <Button className='rounded-full' onClick={onSaveClick} disabled={isSaving}>
            {isSaving && <HugeiconsIcon icon={Loading03Icon} size={16} />}
            Save Article
          </Button>
          <Button
            className='text-destructive/90 bg-destructive/40 rounded-full'
            variant={'destructive'}
            onClick={onCancelClick}
            disabled={isSaving}
          >
            Cancel Editing
          </Button>
        </>
      ) : (
        <Button variant={'outline'} onClick={onEditClick}>
          <HugeiconsIcon icon={PencilEdit02Icon} size={16} />
          Edit Article
        </Button>
      )}

      {textReaderSlot}

      <div className='flex flex-1 justify-end'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant={'ghost'} size='icon' onClick={handleCopy}>
              <HugeiconsIcon icon={CopyIcon} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copy MDX</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
