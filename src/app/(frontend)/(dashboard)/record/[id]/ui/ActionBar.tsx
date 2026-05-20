'use client'

import { ReactNode } from 'react'
import {
  CopyIcon,
  CopyLinkIcon,
  Facebook01Icon,
  Linkedin01Icon,
  Loading03Icon,
  PencilEdit02Icon,
  Share08Icon,
  TwitterIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { toast } from 'sonner'
import { copyToClipboard } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Props {
  handleCopy: () => void
  isEditing: boolean
  isSaving: boolean
  onEditClick: () => void
  onSaveClick: () => void
  onCancelClick: () => void
  postTitle: string
  textReaderSlot?: ReactNode
}

type SharePlatform = 'twitter' | 'linkedin' | 'facebook'

const SHARE_ITEMS = [
  { platform: 'twitter', label: 'Share on X', icon: TwitterIcon },
  { platform: 'linkedin', label: 'Share on LinkedIn', icon: Linkedin01Icon },
  { platform: 'facebook', label: 'Share on Facebook', icon: Facebook01Icon },
] as const

export function ActionBar({
  handleCopy,
  isEditing,
  isSaving,
  onEditClick,
  onSaveClick,
  onCancelClick,
  postTitle,
  textReaderSlot,
}: Props) {
  const getShareUrl = (platform: SharePlatform) => {
    const currentUrl = window.location.href
    const encodedUrl = encodeURIComponent(currentUrl)
    const encodedTitle = encodeURIComponent(postTitle)

    const shareUrls: Record<SharePlatform, string> = {
      twitter: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
    }

    return shareUrls[platform]
  }

  const handleShare = (platform: SharePlatform) => {
    window.open(getShareUrl(platform), '_blank', 'noopener,noreferrer,width=600,height=400')
  }

  const handleCopyLink = async () => {
    await copyToClipboard(window.location.href)
    toast.success('Article link copied', { position: 'top-center' })
  }

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='rounded-full'>
              <HugeiconsIcon icon={Share08Icon} />
              Share
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-56'>
            <DropdownMenuLabel>Export article</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleCopy}>
              <HugeiconsIcon icon={CopyIcon} />
              Copy MDX
            </DropdownMenuItem>
            {/* <DropdownMenuItem onClick={handleCopyLink}>
              <HugeiconsIcon icon={CopyLinkIcon} />
              Copy link
            </DropdownMenuItem> */}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Share on social</DropdownMenuLabel>
            {SHARE_ITEMS.map(({ platform, label, icon }) => (
              <DropdownMenuItem key={platform} onClick={() => handleShare(platform)}>
                <HugeiconsIcon icon={icon} />
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
