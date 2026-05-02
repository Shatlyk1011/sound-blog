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
  const isAudioActive = activeTab === 'originalAudio' && !disabled
  return (
    <div className='bg-background/90 border-border sticky top-0 z-10 mb-2 border-b pt-2 pb-0 backdrop-blur-md'>
      <div className='flex items-center gap-6 text-sm font-medium'>
        <button
          disabled={disabled}
          onClick={() => onChange('generated')}
          aria-label={disabled ? 'Editing, disabled to switch' : 'Generated Article'}
          className={cn(
            'relative border-b-2 pb-3 transition-all',
            isGeneratedActive
              ? 'text-foreground border-current'
              : 'text-muted-foreground hover:text-foreground border-transparent',
            disabled && 'text-foreground cursor-not-allowed border-transparent opacity-50 hover:text-current'
          )}
        >
          Generated Article
        </button>
        <button
          disabled={disabled}
          onClick={() => onChange('raw')}
          aria-label={disabled ? 'Editing, disabled to switch' : 'Raw Transcript'}
          className={cn(
            'relative border-b-2 pb-3 transition-all',
            isRawTabActive
              ? 'text-foreground border-current'
              : 'text-muted-foreground hover:text-foreground border-transparent',
            disabled && 'text-foreground cursor-not-allowed border-transparent opacity-50 hover:text-current'
          )}
        >
          Raw Transcript
        </button>
        <button
          disabled={disabled}
          onClick={() => onChange('originalAudio')}
          aria-label={disabled ? 'Editing, disabled to switch' : 'Original Audio'}
          className={cn(
            'relative border-b-2 pb-3 transition-all',
            isAudioActive
              ? 'text-foreground border-current'
              : 'text-muted-foreground hover:text-foreground border-transparent',
            disabled && 'text-foreground cursor-not-allowed border-transparent opacity-50 hover:text-current'
          )}
        >
          Original Audio
        </button>
      </div>
    </div>
  )
}
