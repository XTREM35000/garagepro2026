/**
 * Simple test script to check the /api/upload/avatar endpoint
 * Run with: node test-avatar-upload.mjs
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const baseUrl = process.env.BASE_URL || 'http://localhost:3000'

console.log(`[Test] Testing /api/upload/avatar endpoint at ${baseUrl}\n`)

// Create a simple 1x1 PNG test image
const pngBuffer = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
  0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
  0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
  0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
  0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
  0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82
])

async function testUpload() {
  try {
    const form = new FormData()
    const blob = new Blob([pngBuffer], { type: 'image/png' })
    form.append('file', blob, 'test-avatar.png')

    console.log('[Test] Sending POST request to /api/upload/avatar')
    console.log('[Test] FormData contains:', {
      file: `PNG blob (${blob.size} bytes)`,
    })

    const response = await fetch(`${baseUrl}/api/upload/avatar`, {
      method: 'POST',
      body: form,
    })

    console.log(`\n[Test] Response status: ${response.status} ${response.statusText}`)
    console.log('[Test] Response headers:', Object.fromEntries(response.headers.entries()))

    const json = await response.json()
    console.log(`\n[Test] Response JSON:`, JSON.stringify(json, null, 2))

    if (response.ok) {
      console.log('\n✅ Upload successful!')
      console.log('URL:', json.url)
      console.log('PublicUrl:', json.publicUrl)
    } else {
      console.error('\n❌ Upload failed!')
      console.error('Error:', json.error)
    }
  } catch (err) {
    console.error('\n❌ Test error:', err.message)
    console.error(err)
  }
}

testUpload()
