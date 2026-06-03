import { FC, SVGProps } from 'react'

export const SoundWaveIcon: FC<SVGProps<SVGSVGElement> & { isProcessing: boolean }> = ({ isProcessing, ...rest }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='20'
    height='20'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
    data-id='element-30'
    className={isProcessing ? 'text-chart-2' : ''}
    {...rest}
  >
    <path
      d='M2 10v3'
      className={isProcessing ? 'animate-pulse' : ''}
      style={isProcessing ? { animationDelay: '0ms' } : undefined}
    ></path>
    <path
      d='M6 6v11'
      className={isProcessing ? 'animate-pulse' : ''}
      style={isProcessing ? { animationDelay: '150ms' } : undefined}
    ></path>
    <path
      d='M10 3v18'
      className={isProcessing ? 'animate-pulse' : ''}
      style={isProcessing ? { animationDelay: '300ms' } : undefined}
    ></path>
    <path
      d='M14 8v7'
      className={isProcessing ? 'animate-pulse' : ''}
      style={isProcessing ? { animationDelay: '450ms' } : undefined}
    ></path>
    <path
      d='M18 5v13'
      className={isProcessing ? 'animate-pulse' : ''}
      style={isProcessing ? { animationDelay: '600ms' } : undefined}
    ></path>
    <path
      d='M22 10v3'
      className={isProcessing ? 'animate-pulse' : ''}
      style={isProcessing ? { animationDelay: '750ms' } : undefined}
    ></path>
  </svg>
)
