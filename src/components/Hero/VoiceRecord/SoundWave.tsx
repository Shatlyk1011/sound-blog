import { cn } from "@/lib/utils";

const BAR_COUNT = 48

const SoundWave = ({ isStatic = false, containerClasses, classes }: { isStatic?: boolean, containerClasses?: string, classes?: string }) => {
  const animations = ['wave1', 'wave2', 'wave3', 'wave4', 'wave5', 'wave6'];

    return (
      <div className={cn('h-3 flex', containerClasses)}>
        <div className={cn('relative flex h-full items-center justify-center gap-[3px] overflow-hidden', classes)}>
          {[...Array(BAR_COUNT)].map((_, i) => {
            const animationName = isStatic ? 'none' : animations[i % animations.length];
            return (
              <div
                key={i}
                className={cn("w-0.5 h-[inherit] bg-muted-foreground/70 origin-bottom",)}
                style={{
                  height: '100%',
                  animationName,
                  animationDuration: `${2 + (i % animations.length) * 0.1}s`,
                  animationDelay: `-${i * 0.1}s`,
                  animationIterationCount: 'infinite',
                  animationTimingFunction: 'ease-in-out',
                }}
              />
            );
          })}
        </div>
      </div>
    )
}

export default SoundWave
