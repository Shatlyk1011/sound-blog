import path from 'path'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { fileURLToPath } from 'node:url'
import { buildConfig } from 'payload'
import AdminUsers from './app/(payload)/collections/AdminUsers'
import Blogs from './app/(payload)/collections/Blogs'
import Transcripts from './app/(payload)/collections/Transcripts'
import Users from './app/(payload)/collections/Users'
import VoiceRecords from './app/(payload)/collections/VoiceRecords'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

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

  collections: [VoiceRecords, Transcripts, Blogs, Users, AdminUsers],

  // Your Payload secret - should be a complex and secure string, unguessable
  secret: process.env.PAYLOAD_SECRET || '',
  // Whichever Database Adapter you're using should go here
  // Mongoose is shown as an example, but you can also use Postgres
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
})
