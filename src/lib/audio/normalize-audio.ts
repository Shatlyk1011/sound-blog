import type { FFmpeg } from '@ffmpeg/ffmpeg'

let ffmpeg: FFmpeg | null = null
let loadPromise: Promise<unknown> | null = null

const OUTPUT_MIME_TYPE = 'audio/webm'
const OUTPUT_EXTENSION = '.webm'
const OUTPUT_AUDIO_CODEC = 'libopus'
const OUTPUT_AUDIO_BITRATE = '24k'
const OUTPUT_SAMPLE_RATE = '16000'
const OUTPUT_CHANNELS = '1'
const OUTPUT_FILENAME_PREFIX = 'voice-record'

const getFfmpeg = async () => {
  if (!ffmpeg) {
    const { FFmpeg } = await import('@ffmpeg/ffmpeg')
    ffmpeg = new FFmpeg()
  }

  return ffmpeg
}

const ensureFfmpegLoaded = async (signal?: AbortSignal) => {
  const ffmpegInstance = await getFfmpeg()

  if (!loadPromise) {
    loadPromise = ffmpegInstance.load(
      {
        coreURL: `${window.location.origin}/ffmpeg-core.js`,
        wasmURL: `${window.location.origin}/ffmpeg-core.wasm`,
      },
      signal ? { signal } : undefined
    )
  }

  try {
    return await loadPromise
  } catch (error) {
    loadPromise = null
    throw error
  }
}

const safeDeleteFile = async (path: string, signal?: AbortSignal) => {
  try {
    await ffmpeg?.deleteFile(path, signal ? { signal } : undefined)
  } catch {
    // Ignore cleanup errors. Files may already be deleted after an aborted run.
  }
}

export const normalizeAudioForUpload = async (file: File, signal?: AbortSignal) => {
  await ensureFfmpegLoaded(signal)
  const ffmpegInstance = await getFfmpeg()
  const { fetchFile } = await import('@ffmpeg/util')

  if (signal?.aborted) {
    throw new DOMException('Audio normalization was aborted', 'AbortError')
  }

  const fileExtension = file.name.includes('.') ? `.${file.name.split('.').pop()}` : OUTPUT_EXTENSION
  const inputName = `input-${crypto.randomUUID()}${fileExtension}`
  const outputName = `${OUTPUT_FILENAME_PREFIX}-${Date.now()}${OUTPUT_EXTENSION}`
  const terminateOnAbort = () => {
    ffmpegInstance.terminate()
    ffmpeg = null
    loadPromise = null
  }

  signal?.addEventListener('abort', terminateOnAbort, { once: true })

  await ffmpegInstance.writeFile(inputName, await fetchFile(file), signal ? { signal } : undefined)

  try {
    const exitCode = await ffmpegInstance.exec(
      [
        '-i',
        inputName,
        '-vn',
        '-map',
        '0:a:0',
        '-ac',
        OUTPUT_CHANNELS,
        '-ar',
        OUTPUT_SAMPLE_RATE,
        '-c:a',
        OUTPUT_AUDIO_CODEC,
        '-b:a',
        OUTPUT_AUDIO_BITRATE,
        outputName,
      ],
      -1,
      signal ? { signal } : undefined
    )

    if (exitCode !== 0) {
      throw new Error('Failed to optimize audio')
    }

    const outputData = await ffmpegInstance.readFile(outputName, 'binary', signal ? { signal } : undefined)
    if (!(outputData instanceof Uint8Array)) {
      throw new Error('Optimized audio output was not binary')
    }

    const outputBlob = new Blob([new Uint8Array(outputData)], { type: OUTPUT_MIME_TYPE })

    return {
      file: new File([outputBlob], outputName, { type: OUTPUT_MIME_TYPE }),
      mimeType: OUTPUT_MIME_TYPE,
    }
  } finally {
    signal?.removeEventListener('abort', terminateOnAbort)
    await Promise.all([safeDeleteFile(inputName, signal), safeDeleteFile(outputName, signal)])
  }
}
