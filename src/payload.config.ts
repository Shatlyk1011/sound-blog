import path from 'path'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { fileURLToPath } from 'node:url'
import { buildConfig } from 'payload'
import AdminUsers from './app/(payload)/collections/AdminUsers'
import Blogs from './app/(payload)/collections/Blogs'
import CreditHistory from './app/(payload)/collections/CreditHistory'
import Transcripts from './app/(payload)/collections/Transcripts'
import Users from './app/(payload)/collections/Users'
import VoiceRecords from './app/(payload)/collections/VoiceRecords'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const requiredEnv = (key: string) => {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

export default buildConfig({
  typescript: {
    outputFile: path.resolve(dirname, '../src/payload-types.ts'),
  },

  admin: {
    user: AdminUsers.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  collections: [VoiceRecords, Transcripts, Blogs, Users, CreditHistory, AdminUsers],

  secret: requiredEnv('PAYLOAD_SECRET'),
  db: mongooseAdapter({
    url: requiredEnv('DATABASE_URI'),
  }),
})
