import { siteConfig } from '@/siteConfig'
import Link from 'next/link'
import { LogoIcon } from '../icons/Logo'

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className='mx-auto w-full max-w-7xl px-4 sm:px-10'>
      <div className='border-border bg-card/70 flex flex-col gap-5 rounded-[2rem] border px-6 py-5 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-center gap-3'>
          <LogoIcon className='size-9' />
          <div>
            <p className='text-sm font-semibold'>{siteConfig.name}</p>
            <p className='text-muted-foreground text-xs'>Voice notes into blog drafts.</p>
          </div>
        </div>

        <div className='text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-2 text-sm'>
          <Link prefetch={false} href={siteConfig.links.privacy} className='hover:text-foreground transition-colors'>
            Privacy Policy
          </Link>

          <a
            href={siteConfig.githubRepo}
            target='_blank'
            rel='noreferrer'
            className='hover:text-foreground transition-colors'
          >
            Source Code
          </a>
          <a
            href={siteConfig.linkedin}
            target='_blank'
            rel='noreferrer'
            className='hover:text-foreground transition-colors'
          >
            Let&apos;s connect
          </a>
          <span>© {year} Sound Blog</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
