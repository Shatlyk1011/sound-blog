import { createHash, createHmac } from 'node:crypto'

export const MAX_AUDIO_FILE_SIZE_BYTES = 500 * 1024 * 1024
export const MAX_AUDIO_DURATION_SECONDS = 60 * 60

export const ALLOWED_AUDIO_TYPES = new Set([
  'audio/aac',
  'audio/flac',
  'audio/m4a',
  'audio/mp4',
  'audio/mpeg',
  'audio/ogg',
  'audio/wav',
  'audio/webm',
  'audio/x-m4a',
  'audio/x-wav',
])

export const extensionFromFileName = (fileName: string) => {
  const extension = fileName.toLowerCase().match(/\.([a-z0-9]+)$/)?.[1]
  return extension ? `.${extension}` : '.webm'
}

export const sanitizeAudioTitle = (fileName: string) =>
  fileName
    .replace(/\.[^/.]+$/, '')
    .replace(/[^\w-]+/g, '_')
    .slice(0, 80)

export const trimSlashes = (value: string) => value.replace(/^\/+|\/+$/g, '')

export const buildR2PublicUrl = (publicUrl: string, key: string) =>
  `${publicUrl.replace(/\/+$/, '')}/${trimSlashes(key)}`

export const getR2VoiceConfig = () => {
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
  const endpoint = process.env.R2_ENDPOINT_URL
  const publicUrl = process.env.R2_PUBLIC_URL
  const voiceBucket = process.env.R2_VOICE_RECORD_BUCKET

  if (!accessKeyId || !secretAccessKey || !endpoint || !publicUrl || !voiceBucket) {
    return null
  }

  return {
    accessKeyId,
    secretAccessKey,
    endpoint,
    publicUrl,
    voiceBucket,
  }
}

type R2VoiceConfig = NonNullable<ReturnType<typeof getR2VoiceConfig>>

type CreatePresignedR2PutUrlArgs = {
  config: R2VoiceConfig
  contentType: string
  expiresInSeconds?: number
  key: string
}

const encodeRfc3986 = (value: string) =>
  encodeURIComponent(value).replace(/[!'()*]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`)

const hmac = (key: Buffer | string, value: string) => createHmac('sha256', key).update(value).digest()

const hmacHex = (key: Buffer, value: string) => createHmac('sha256', key).update(value).digest('hex')

const sha256Hex = (value: string) => createHash('sha256').update(value).digest('hex')

const formatAmzDate = (date: Date) => date.toISOString().replace(/[:-]|\.\d{3}/g, '')

const getSigningKey = (secretAccessKey: string, dateStamp: string) => {
  const dateKey = hmac(`AWS4${secretAccessKey}`, dateStamp)
  const regionKey = hmac(dateKey, 'auto')
  const serviceKey = hmac(regionKey, 's3')
  return hmac(serviceKey, 'aws4_request')
}

const buildCanonicalQuery = (params: Record<string, string>) =>
  Object.entries(params)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${encodeRfc3986(key)}=${encodeRfc3986(value)}`)
    .join('&')

export const createPresignedR2PutUrl = ({
  config,
  contentType,
  expiresInSeconds = 15 * 60,
  key,
}: CreatePresignedR2PutUrlArgs) => {
  const endpointUrl = new URL(config.endpoint)
  const now = new Date()
  const amzDate = formatAmzDate(now)
  const dateStamp = amzDate.slice(0, 8)
  const credentialScope = `${dateStamp}/auto/s3/aws4_request`
  const signedHeaders = 'content-type;host'
  const basePath = trimSlashes(endpointUrl.pathname)
  const canonicalUri = `/${[basePath, config.voiceBucket, ...trimSlashes(key).split('/')]
    .filter(Boolean)
    .map(encodeRfc3986)
    .join('/')}`

  const queryParams = {
    'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
    'X-Amz-Credential': `${config.accessKeyId}/${credentialScope}`,
    'X-Amz-Date': amzDate,
    'X-Amz-Expires': expiresInSeconds.toString(),
    'X-Amz-SignedHeaders': signedHeaders,
  }

  const canonicalQuery = buildCanonicalQuery(queryParams)
  const canonicalHeaders = `content-type:${contentType}\nhost:${endpointUrl.host}\n`
  const canonicalRequest = [
    'PUT',
    canonicalUri,
    canonicalQuery,
    canonicalHeaders,
    signedHeaders,
    'UNSIGNED-PAYLOAD',
  ].join('\n')
  const stringToSign = ['AWS4-HMAC-SHA256', amzDate, credentialScope, sha256Hex(canonicalRequest)].join('\n')
  const signature = hmacHex(getSigningKey(config.secretAccessKey, dateStamp), stringToSign)

  endpointUrl.pathname = canonicalUri
  endpointUrl.search = `${canonicalQuery}&X-Amz-Signature=${signature}`

  return endpointUrl.toString()
}
