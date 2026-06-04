import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import path from 'path'

cloudinary.config({
  cloud_name: 'dgjcl0te0',
  api_key:    '828188297656114',
  api_secret: '2mGxpAX__J2uSONpWpkL-T-E_Q4',
})

// ── Images from public/ ───────────────────────────────────────────────────
const images = [
  'cmwg-logo.png',
]

// ── Videos from public/videos/ ────────────────────────────────────────────
const videos = [
  'lagos.mp4',
  'ghana.mp4',
  'benin.mp4',
  'tanzania.mp4',
  'capetown.mp4',
  'zanzibar.mp4',
  'sahara.mp4',
  'nairobi.mp4',
  'victoriafalls.mp4',
  'dakar.mp4',
]

async function uploadFile(localPath, publicId, resourceType) {
  try {
    console.log(`Uploading ${publicId}...`)
    const result = await cloudinary.uploader.upload(localPath, {
      public_id:     publicId,
      resource_type: resourceType,
      folder:        'cmwg',
      overwrite:     true,
    })
    console.log(`  ✅ ${publicId} → ${result.secure_url}`)
    return { publicId, url: result.secure_url }
  } catch (err) {
    console.error(`  ❌ ${publicId} failed:`, err.message)
    return null
  }
}

// Upload images
console.log('\n── Uploading images ──────────────────────────────────────')
for (const file of images) {
  const localPath = path.join('public', file)
  if (!fs.existsSync(localPath)) { console.warn(`  ⚠ Skipping ${file} — not found`); continue }
  await uploadFile(localPath, path.parse(file).name, 'image')
}

// Upload videos
console.log('\n── Uploading videos ──────────────────────────────────────')
for (const file of videos) {
  const localPath = path.join('public', 'videos', file)
  if (!fs.existsSync(localPath)) { console.warn(`  ⚠ Skipping ${file} — not found`); continue }
  await uploadFile(localPath, path.parse(file).name, 'video')
}

console.log('\n✅ All done! All assets are now in your Cloudinary account under the "cmwg" folder.')
