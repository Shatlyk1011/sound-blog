import { Badge } from '@/components/ui/badge';
import { Blog } from '@/payload-types';
import { FC } from 'react';

interface Props {
  createdAt: string
  tone?:Blog['tone']
};

const BlogMetadata:FC<Props> = ({createdAt,tone}:Props) => {
return (
<div className='flex items-center text-sm font-medium'>
    <ul className='flex items-center gap-2 py-4'>
      {tone && (
        <Badge variant={'outline'}>Tone: {tone}</Badge>
      )}
    </ul>
    <span className='mx-2 text-lg'>•</span>
    <time className='text-muted-foreground' dateTime={createdAt}>
      {new Intl.DateTimeFormat('en-US', {
        dateStyle: 'long',
      }).format(new Date(createdAt))}
    </time>
  </div>
)
};
export default BlogMetadata