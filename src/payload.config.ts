import path from 'path'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { fileURLToPath } from 'node:url'
import { buildConfig } from 'payload'
import AdminUsers from './app/(payload)/collections/AdminUsers'
// collections

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

  // Define and configure your collections in this array
  collections: [

    AdminUsers,
  ],

  // Your Payload secret - should be a complex and secure string, unguessable
  secret: process.env.PAYLOAD_SECRET || '',
  // Whichever Database Adapter you're using should go here
  // Mongoose is shown as an example, but you can also use Postgres
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
})
