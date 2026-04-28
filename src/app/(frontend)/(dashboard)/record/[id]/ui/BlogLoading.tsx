import { Loading03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

interface Props {
  hidden: boolean
}
const BlogLoading = ({ hidden }: Props) => {
  return (
    <div hidden={hidden} className='text-muted-foreground flex items-center justify-center gap-2'>
      <HugeiconsIcon icon={Loading03Icon} className='animate-spin duration-2000' />
      <p>Loading blog...</p>
    </div>
  )
}
export default BlogLoading
