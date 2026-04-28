interface TabSwitcherProps {
  activeTab: 'generated' | 'raw'
  onChange: (tab: 'generated' | 'raw') => void
}

export default function TabSwitcher({ activeTab, onChange }: TabSwitcherProps) {
  return (
    <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-md pt-2 pb-0 mb-8 border-b border-border">
      <div className="flex items-center gap-6 text-sm font-medium">
        <button
          onClick={() => onChange('generated')}
          className={`pb-3 transition-all border-b-2 relative ${activeTab === 'generated' ? 'text-foreground border-current' : 'text-muted-foreground hover:text-foreground border-transparent'}`}
        >
          Generated Article
        </button>
        <button
          onClick={() => onChange('raw')}
          className={`pb-3 transition-all border-b-2 relative ${activeTab === 'raw' ? 'text-foreground border-current' : 'text-muted-foreground hover:text-foreground border-transparent'}`}
        >
          Raw Transcript
        </button>
      </div>
    </div>
  )
}