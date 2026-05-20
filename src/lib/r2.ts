import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'

type DeleteR2ObjectFromUrlArgs = {
  bucket?: string
  logPrefix: string
  url?: string | null
}

const trimSlashes = (value: string) => value.replace(/^\/+|\/+$/g, '')

export const getR2ObjectKeyFromUrl = (url: string) => {
  const publicBase = process.env.R2_PUBLIC_URL

  if (publicBase && url.startsWith(publicBase)) {
    return trimSlashes(url.slice(publicBase.length))
  }

  try {
    return trimSlashes(new URL(url).pathname)
  } catch {
    return trimSlashes(url)
  }
}

export const deleteR2ObjectFromUrl = async ({ bucket, logPrefix, url }: DeleteR2ObjectFromUrlArgs) => {
  if (!url) return

  const key = getR2ObjectKeyFromUrl(url)
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
  const endpoint = process.env.R2_ENDPOINT_URL
  const targetBucket = bucket ?? process.env.R2_VOICE_RECORD_BUCKET

  if (!key) {
    console.warn(`[${logPrefix}] Could not derive R2 object key from URL`)
    return
  }

  if (!accessKeyId || !secretAccessKey || !endpoint || !targetBucket) {
    console.warn(`[${logPrefix}] R2 deletion env vars are not fully configured; skipping deletion for ${key}`)
    return
  }

  const s3 = new S3Client({
    region: 'auto',
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })

  await s3.send(
    new DeleteObjectCommand({
      Bucket: targetBucket,
      Key: key,
    })
  )

  console.log(`[${logPrefix}] Deleted R2 object: ${key}`)
}
