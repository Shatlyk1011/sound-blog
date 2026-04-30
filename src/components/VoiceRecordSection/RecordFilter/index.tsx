import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChevronDown, Info } from "@hugeicons/core-free-icons";
import { ALL_FILTERS, ENHANCEMENTS, LENGTHS, TONES, type FilterValue, type LengthValue, type ToneValue, EnhancementValue } from "@/lib/constants";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const RecordFilter: FC = () => {
  const [open, setOpen] = useState(false)

  const [tone, setTone] = useState<ToneValue>(TONES[0].value)
  const [blogLength, setBlogeLength] = useState<LengthValue>(LENGTHS[1].value)
  const [selectedEnhancements, setSelectedEnhancements] = useState<EnhancementValue[]>([])

  const toggleEnhancement = (value: EnhancementValue) => {
    setSelectedEnhancements((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    )
  }

  const selectedFilters: FilterValue[] = [tone, blogLength, ...selectedEnhancements]

  return (
    <>
    <div className="flex flex-col mb-4 items-start w-full text-[13px] gap-2.5 ">
      <h4 className="text-muted-foreground uppercase flex items-center gap-1.5">
        Selected Filters
        <Tooltip>
          <TooltipTrigger asChild>
              <span>
                <HugeiconsIcon icon={Info} size={16} />
              </span>
          </TooltipTrigger>

            <TooltipContent>These filters will control how your blog is generated, influencing tone, structure, and level of detail.</TooltipContent>
        </Tooltip>

      </h4>

      <ul className="flex gap-x-3 gap-y-2 text-[13px] flex-wrap">
        {selectedFilters.map(key => (
          <li className="px-2.5 py-0.75 bg-chart-2/10 text-chart-2 rounded-full border border-current/20" key={key}>{ALL_FILTERS[key as keyof typeof ALL_FILTERS]}</li>
        ))}
      </ul>
    </div>
    <div className={cn("relative overflow-hidden border border-transparent w-full mr-auto rounded-2xl", open && 'border-secondary-foreground/30')}>
      <div
       
        className={cn(
          `relative cursor-pointer p-5 transition`,
          open ? 'bg-muted' : 'bg-muted/50'
        )}
      >
        {/* top */}
        <div  onClick={() => setOpen(!open)} role="button" className="relative z-10 flex h-auto items-center justify-between gap-4">
          <h4 className="text-start text-base leading-7 font-semibold tracking-one ">
            Adjust Filters
          </h4>
          <button type="button" className={cn("duration-300", open ? "rotate-180" : "rotate-0")} title="Expand">
            <HugeiconsIcon icon={ChevronDown}/>
          </button>
        </div>

        {/* accordion */}
        <div
          className={cn(
            "z-10 grid transition-all duration-300 ease-out",
            open ? "grid-rows-[1fr] pt-6" : "grid-rows-[0fr]",
          )}
        >
          <div
            className={cn(
              "z-10 overflow-hidden space-y-8 text-left tracking-one transition-all duration-300 ",
            )}
          >
            {/* Blog tone filter  */}
            <div className="space-y-2.5">
              <h4 className="text-sm font-medium text-muted-foreground uppercase -tracking-one">Tone</h4>
              <ButtonGroup>
                {TONES.map(({ title, value }) => (
                  <Button
                    key={value}
                    variant="default"
                    size="sm"
                    type="button"
                    onClick={() => setTone(value)}
                    className={cn("text-xs bg-chart-2/80 border-chart-2/30 tracking-two hover:bg-chart-2", tone !== value && "bg-secondary/80 hover:bg-secondary text-muted-foreground")}
                  >
                    {title}
                  </Button>
                ))}
              </ButtonGroup>
            </div>

            {/* Blog length filter  */}
            <div className="space-y-2.5">
              <h4 className="text-sm font-medium text-muted-foreground uppercase -tracking-one">Length</h4>
              <ButtonGroup>
                {LENGTHS.map(({ title, value }) => (
                  <Button
                    key={value}
                    variant="default"
                    size="sm"
                    type="button"
                    onClick={() => setBlogeLength(value)}
                    className={cn("text-xs bg-chart-2/80 border-chart-2/30 tracking-two hover:bg-chart-2", blogLength !== value && "bg-secondary/80 hover:bg-secondary text-muted-foreground")}
                  >
                    {title}
                  </Button>
                ))}
              </ButtonGroup>
            </div>

            {/* Enhancements  */}
            <div className="space-y-2.5">
              <h4 className="text-sm font-medium text-muted-foreground uppercase -tracking-one">Enhancements</h4>
              <ul className="text-nowrap grid grid-cols-2 gap-x-14 gap-y-3 text-[13px] tracking-one leading-[150%]">
                {ENHANCEMENTS.map(({ title, value }) => (
                  <li key={value} className="flex gap-2 justify-between items-center basis-[40%] -tracking-one">
                    <label className="flex-1 cursor-pointer" htmlFor={value}>{title}</label>
                    <Switch 
                      id={value} 
                      checked={selectedEnhancements.includes(value)}
                      onCheckedChange={() => toggleEnhancement(value)}
                    />
                  </li>
                ))}
              </ul>
              </div>
          </div>
        </div>
      </div>

      {/* gradient border */}
      {!open && (
        <div
          className={cn("absolute inset-0 z-[-1] transition-opacity", open ? "opacity-0" : "opacity-100")}
          style={{
            backgroundImage: "linear-gradient(175deg, rgba(255, 255, 255, 0.30) 6%, rgba(255, 255, 255, 0.04) 36%)",
          }}
        ></div>
      )}
    </div>
    </>
  )
}

export default RecordFilter