import { cn } from '@/lib/utils'
import { TabVariants } from '../RecordClient'

interface TabSwitcherProps {
  activeTab: TabVariants
  onChange: (tab: TabVariants) => void
  disabled: boolean
}

export default function TabSwitcher({ activeTab, onChange, disabled }: TabSwitcherProps) {
  const isGeneratedActive = activeTab === 'generated' && !disabled
  const isRawTabActive = activeTab === 'raw' && !disabled
  return (
    <div className='pb-3'>
      <div className='bg-muted/60 border-border/70 inline-flex items-center rounded-full border p-1 text-sm font-medium'>
        <button
          type='button'
          disabled={disabled}
          onClick={() => onChange('generated')}
          aria-label={disabled ? 'Editing, disabled to switch' : 'Generated Article'}
          className={cn(
            'relative rounded-full px-4 py-2 transition-all',
            isGeneratedActive
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground border-transparent',
            disabled && 'text-foreground cursor-not-allowed opacity-50 hover:text-current'
          )}
        >
          Generated Article
        </button>
        <button
          type='button'
          disabled={disabled}
          onClick={() => onChange('raw')}
          aria-label={disabled ? 'Editing, disabled to switch' : 'Raw Transcript'}
          className={cn(
            'relative rounded-full px-4 py-2 transition-all',
            isRawTabActive ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
            disabled && 'text-foreground cursor-not-allowed opacity-50 hover:text-current'
          )}
        >
          Raw Transcript
        </button>
      </div>
    </div>
  )
}
