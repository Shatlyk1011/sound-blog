import { cn } from "@/lib/utils"

interface TabSwitcherProps {
  activeTab: 'generated' | 'raw'
  onChange: (tab: 'generated' | 'raw') => void
  disabled: boolean
}

export default function TabSwitcher({ activeTab, onChange, disabled }: TabSwitcherProps) {
  const isGeneratedActive = activeTab === 'generated' && !disabled
  return (
    <div className='bg-background/90 border-border sticky top-0 z-10 mb-8 border-b pt-2 pb-0 backdrop-blur-md'>
      <div className='flex items-center gap-6 text-sm font-medium'>
        <button
          disabled={disabled}
          onClick={() => onChange('generated')}
          aria-label={disabled ? 'Editing, disabled to switch' : 'Generated Article'}
          className={cn('relative border-b-2 pb-3 transition-all', isGeneratedActive ? 'text-foreground border-current' : 'text-muted-foreground hover:text-foreground border-transparent', disabled && 'opacity-50 border-transparent cursor-not-allowed hover:text-current text-foreground')}
        >
          Generated Article
        </button>
        <button
          disabled={disabled}
          onClick={() => onChange('raw')}
          aria-label={disabled ? 'Editing, disabled to switch' : 'Raw Transcript'}
          className={cn('relative border-b-2 pb-3 transition-all', !isGeneratedActive ? 'text-foreground border-current' : 'text-muted-foreground hover:text-foreground border-transparent', disabled && 'opacity-50 border-transparent cursor-not-allowed hover:text-current text-foreground')}
        >
          Raw Transcript
        </button>
      </div>
    </div>
  )
}
