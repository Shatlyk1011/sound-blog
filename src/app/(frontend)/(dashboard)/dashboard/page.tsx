import VoiceRecordSection from '@/components/VoiceRecordSection'
import VoiceRecordsGrid from '@/components/VoiceRecordsGrid'

export default function Dashboard() {
  return (
    <div className='relative flex min-h-full flex-col items-center justify-start gap-10 px-4 pt-20 pb-8 sm:px-6 sm:pt-24 sm:pb-10 lg:gap-20 lg:px-8 lg:pt-8'>
      <VoiceRecordSection />
      <VoiceRecordsGrid />
    </div>
  )
}
