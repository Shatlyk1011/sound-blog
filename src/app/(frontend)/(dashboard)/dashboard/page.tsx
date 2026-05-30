import VoiceRecordSection from '@/components/VoiceRecordSection'
import VoiceRecordsGrid from '@/components/VoiceRecordsGrid'

export default function Dashboard() {
  return (
    <div className='flex min-h-full flex-col items-center justify-start gap-20 pt-8 pb-10'>
      <VoiceRecordSection />
      <VoiceRecordsGrid />
    </div>
  )
}
