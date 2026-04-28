interface TabSwitcherProps {
  activeTab: 'generated' | 'raw'
  onChange: (tab: 'generated' | 'raw') => void
}

export default function TabSwitcher({ activeTab, onChange }: TabSwitcherProps) {
  return (
    <div className='bg-background/90 border-border sticky top-0 z-10 mb-8 border-b pt-2 pb-0 backdrop-blur-md'>
      <div className='flex items-center gap-6 text-sm font-medium'>
        <button
          onClick={() => onChange('generated')}
          className={`relative border-b-2 pb-3 transition-all ${activeTab === 'generated' ? 'text-foreground border-current' : 'text-muted-foreground hover:text-foreground border-transparent'}`}
        >
          Generated Article
        </button>
        <button
          onClick={() => onChange('raw')}
          className={`relative border-b-2 pb-3 transition-all ${activeTab === 'raw' ? 'text-foreground border-current' : 'text-muted-foreground hover:text-foreground border-transparent'}`}
        >
          Raw Transcript
        </button>
      </div>
    </div>
  )
}
