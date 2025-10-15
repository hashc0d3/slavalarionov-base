import express from 'express'
import payload from 'payload'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3003

const start = async () => {
  // Initialize Payload (2.x style)
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || 'watch-configurator-secret-key-2025',
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
      payload.logger.info(`Payload API URL: ${payload.getAPIURL()}`)
    },
  })

  // Redirect root to admin
  app.get('/', (_, res) => {
    res.redirect('/admin')
  })

  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`)
    console.log(`✅ Admin: http://localhost:${PORT}/admin`)
    console.log(`✅ API: http://localhost:${PORT}/api`)
  })
}

start().catch((err) => {
  console.error('❌ Error:', err)
  process.exit(1)
})

