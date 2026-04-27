import { VoiceRecord } from "@/payload-types";
import VoiceRecordCard from "../VoiceRecordsGrid/VoiceRecordCard";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";

const DEMO_RECORD: VoiceRecord = {
  "createdAt": "2026-04-24T13:11:56.728Z",
  "updatedAt": "2026-04-24T13:12:32.633Z",
  "userId": "69eb55f7c91f77f32f72b7dc",
  "fileUrl": "https://pub-22d9ce529cfb4b3891eb3bc8dfa9dc22.r2.dev/1777036314037-voice-record-1777036309664.webm",
  "fileName": "voice-record-1777036309664.webm",
  "duration": 10,
  "status": "completed",
  "id": "voice-record-1777036309664-4226"
}

const DemoSection= () => {
  return (
    <section className="text-card-foreground w-full max-w-7xl mx-auto pt-16 rounded-4xl px-4 sm:px-10" id="demo">
      <div className="flex flex-col items-center mb-16">
        <h2 className='text-4xl sm:text-5xl font-extrabold font-sans mb-4 tracking-tight'>Demo Sound Blog</h2>
        <p className="text-muted-foreground text-lg text-center max-w-2xl">
          Here is how your voice recordings will appear.
        </p>
      </div>

      <div className='flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24'>
        <div className="w-full max-w-md relative max-lg:order-2">
          <div className="absolute -inset-4 bg-primary/10 rounded-[2.5rem] blur-xl -z-10"></div>
          <div className="bg-background rounded-3xl border border-border shadow-xl p-2 z-10 relative">
            <VoiceRecordCard record={DEMO_RECORD} />
          </div>
        </div>

        <div className="flex flex-col items-center lg:items-start relative max-w-sm">
          {/* Arrow pointing Left (for Desktop) */}
          <div className=" absolute -left-20 top-1/2 -translate-y-1/2 text-primary max-lg:hidden">
           <HugeiconsIcon size={64} icon={ArrowLeft02Icon} />
          </div>
          
          <div className="space-y-5 text-center lg:text-left">
            <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              Interactive Demo
            </span>
            <h3 className="text-3xl font-bold tracking-tight">
              Your Voice Record
            </h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Every recording you make will be displayed with its <strong>title</strong>, <strong>status</strong>, a built-in <strong>Audio Player</strong>. 
            </p>
            <p className="text-muted-foreground/80 text-base leading-relaxed">Click it to see details </p>
          </div>
        </div>
      </div>
    </section>
  )
};
export default DemoSection;