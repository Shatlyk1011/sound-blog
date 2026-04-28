'use client'
import { useEffect, useState } from 'react'
import { Moon02Icon, Sun02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

function ThemeToggle() {
  const [mounted, setMounted] = useState(false)

  const { setTheme, theme, resolvedTheme } = useTheme()

  const isDark = resolvedTheme === 'dark'

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Button variant='ghost' size='icon' onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      {isDark ? <HugeiconsIcon icon={Sun02Icon} /> : <HugeiconsIcon icon={Moon02Icon} />}
      <span className='sr-only'>Toggle theme</span>
    </Button>
  )
}

export default ThemeToggle
