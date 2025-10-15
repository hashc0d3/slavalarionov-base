import { buildConfig } from 'payload/config'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { slateEditor } from '@payloadcms/richtext-slate'
import { webpackBundler } from '@payloadcms/bundler-webpack'
import path from 'path'

// Collections
import { WatchModels } from './collections/WatchModels'
import { WatchStraps } from './collections/WatchStraps'
import { StrapParams } from './collections/StrapParams'
import { AdditionalOptions } from './collections/AdditionalOptions'
import { PromoCodes } from './collections/PromoCodes'
import { Media } from './collections/Media'

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3003',
  admin: {
    bundler: webpackBundler(),
    meta: {
      titleSuffix: '- Watch Configurator CMS',
      favicon: '/assets/favicon.ico',
    },
  },
  editor: slateEditor({}),
  collections: [
    WatchModels,
    WatchStraps,
    StrapParams,
    AdditionalOptions,
    PromoCodes,
    Media,
  ],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || 'postgres://postgres:postgres@localhost:5432/watch_configurator',
    },
  }),
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  cors: [
    'http://localhost:3000', // frontend
    'http://localhost:3002', // backend  
    'http://localhost:8081', // backend integrated
    'http://localhost:3003', // cms
  ],
  csrf: [
    'http://localhost:3000',
    'http://localhost:3002',
    'http://localhost:8081',
    'http://localhost:3003',
  ],
})

