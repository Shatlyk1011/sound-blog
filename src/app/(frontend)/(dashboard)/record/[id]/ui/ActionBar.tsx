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
    <div className='mb-3 flex min-h-12 flex-wrap items-center gap-2'>
      <div className='flex flex-wrap items-center gap-2'>
        {isEditing ? (
          <>
            <Button
              className='bg-chart-2 hover:bg-chart-2/90 rounded-full text-white shadow-sm'
              onClick={onSaveClick}
              disabled={isSaving}
            >
              {isSaving && <HugeiconsIcon icon={Loading03Icon} size={16} className='animate-spin' />}
              Save article
            </Button>
            <Button className='rounded-full' variant='destructive' onClick={onCancelClick} disabled={isSaving}>
              Cancel
            </Button>
          </>
        ) : (
          <Button variant='outline' className='rounded-full' onClick={onEditClick}>
            <HugeiconsIcon icon={PencilEdit02Icon} size={16} />
            Edit article
          </Button>
        )}

        {textReaderSlot}
      </div>

      <div className='ml-auto flex justify-end'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant='ghost' size='icon' className='rounded-full' onClick={handleCopy}>
              <HugeiconsIcon icon={CopyIcon} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copy article markdown</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
