'use client'

import { useState } from 'react'
import { useScroll, useMotionValueEvent } from 'motion/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import ThemeToggle from '@/components/ui/theme-toggle'
import { getUserInitials } from '@/composables/utils'
import { useUser } from '@/hooks/use-user'
import { HugeiconsIcon } from '@hugeicons/react'
import { LogoutSquare01Icon, Menu05Icon } from '@hugeicons/core-free-icons'

const { home, motionComponents, gsapComponents } = {
  home: '/',
  motionComponents: '/docs',
  gsapComponents: '/docs/gsap',
}

const Header = () => {
  const router = useRouter()
  const pathname = usePathname()

  const { user, isLoading, signOut } = useUser()

  const [isScrolled, setIsScrolled] = useState(false)
  const [menu, setMenu] = useState(false)

  const closeMenu = () => setMenu(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 0)
  })

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <>
      <header
        className={cn(
          'fixed top-0 z-20 mx-auto flex h-14 w-full items-center justify-between border-b px-8 py-2 font-sans max-md:px-4',
          isScrolled && 'bg-background/90 backdrop-blur-sm',
        )}
      >
        <Link
          href='/'
          className={cn(
            'z-50 w-max max-sm:mr-4 max-sm:max-w-max max-sm:min-w-8',
          )}
        >
          logo
        </Link>
        <nav
          className={cn(
            'text-muted-foreground z-49 ml-6 flex flex-1 justify-start transition-all max-md:absolute max-md:inset-0 max-md:ml-0 max-md:h-svh max-md:w-screen max-md:translate-x-full',
            menu ? 'max-md:translate-x-0' : 'max-md:translate-x-full'
          )}
        >
          <ul className='-tracking-one max-md:bg-secondary flex items-center text-sm font-medium max-md:w-full max-md:flex-col max-md:gap-3 max-md:pt-40 max-md:text-base'>
            <li>
              <Link
                href={`${home}#website-inspirations`}
                onClick={closeMenu}
                className={cn(
                  'hover:text-foreground min-h-10 rounded-md px-3 py-2 text-nowrap transition ease-out max-sm:px-2'
                )}
              >
                Website Inspiration
              </Link>
            </li>
            <li className='max-md:hidden'>
              <DropdownMenu>
                <DropdownMenuContent align='end' className='w-48'>
                  <DropdownMenuItem asChild>
                    <Link href={motionComponents} className='cursor-pointer'>
                      Motion Components
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={gsapComponents} className='cursor-pointer'>
                      GSAP Components
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
            <li>
              <Link
                href={motionComponents}
                className={cn(
                  'hover:text-foreground hidden rounded-md px-3 py-2 text-nowrap transition ease-out max-md:inline max-sm:px-2'
                )}
              >
                Motion Components
              </Link>
            </li>
            <li>
              <Link
                href={gsapComponents}
                className={cn(
                  'hover:text-foreground hidden rounded-md px-3 py-2 text-nowrap transition ease-out max-md:inline max-sm:px-2'
                )}
              >
                Gsap Components
              </Link>
            </li>
            <span className='mx-1 opacity-50 max-md:hidden'>|</span>
          </ul>
        </nav>

        <div className='flex min-w-20 items-center justify-end gap-2.5 max-sm:gap-1'>
          <ThemeToggle />

          {isLoading ? (
            <div className='border-primary h-5 w-5 animate-spin rounded-full border-2 border-t-transparent' />
          ) : (
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className='focus:ring-primary flex items-center gap-2 rounded-full focus:ring-2 focus:ring-offset-2 focus:outline-none'>
                      <Avatar className='size-8 cursor-pointer'>
                        <AvatarImage
                          src={user.user_metadata?.avatar_url}
                          alt={
                            user.user_metadata?.full_name ||
                            user.email ||
                            'User'
                          }
                        />
                        <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end' className='z-500 w-56'>
                    <DropdownMenuLabel>
                      <div className='flex flex-col space-y-1'>
                        <p className='text-sm leading-none font-medium'>
                          {user.user_metadata?.full_name || 'User'}
                        </p>
                        <p className='text-muted-foreground text-xs leading-none'>
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className='cursor-pointer'
                    >
                      <HugeiconsIcon icon={LogoutSquare01Icon} />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() =>
                    router.push(`/sign-in?next=${encodeURIComponent(pathname)}`)
                  }
                  className=''
                >
                  Sign In
                </Button>
              )}
            </>
          )}
          <Button
            size='icon-sm'
            className='z-50 hidden max-md:flex'
            variant={'ghost'}
            onClick={() => setMenu(!menu)}
          >
            <HugeiconsIcon icon={Menu05Icon} />
          </Button>
        </div>
      </header>
    </>
  )
}
export default Header
