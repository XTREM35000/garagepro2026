import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  console.log('[api/upload/avatar] POST received')

  if (!supabaseAdmin) {
    console.error('[api/upload/avatar] Supabase admin client not configured (SUPABASE_SERVICE_ROLE_KEY missing)')
    return NextResponse.json({ error: 'Supabase admin client not configured. Set SUPABASE_SERVICE_ROLE_KEY.' }, { status: 500 })
  }

  try {
    // log some request info to help debug 404/400 situations
    console.log('[api/upload/avatar] headers:', Object.fromEntries(req.headers))

    const formData = await req.formData()
    const keys: string[] = []
    formData.forEach((v, k) => keys.push(k))
    console.log('[api/upload/avatar] formData keys:', keys)

    const file = formData.get('file') as File | null
    const signedFlag = formData.get('signed')

    if (!file) {
      console.warn('[api/upload/avatar] No file provided in formData')
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // server-side validation
    const ALLOWED = ['image/png', 'image/jpeg', 'image/webp']
    const MAX_BYTES = 5 * 1024 * 1024 // 5MB

    console.log('[api/upload/avatar] file info:', { name: file.name, type: file.type, size: (file as any).size })

    if (!ALLOWED.includes(file.type)) {
      console.warn('[api/upload/avatar] Invalid file type:', file.type)
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    if ((file as any).size && (file as any).size > MAX_BYTES) {
      console.warn('[api/upload/avatar] File too large:', (file as any).size)
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const fileExt = file.name.split('.').pop() ?? 'png'
    const filePath = `avatars/${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`

    console.log('[api/upload/avatar] uploading to storage at path:', filePath)

    const { error: uploadError } = await supabaseAdmin.storage
      .from('avatars')
      .upload(filePath, buffer, { contentType: file.type })

    if (uploadError) {
      console.error('[api/upload/avatar] uploadError:', uploadError)
      return NextResponse.json({ error: uploadError.message || String(uploadError) }, { status: 400 })
    }

    // If client asked for a signed url, return that (valid 24h)
    if (signedFlag === 'true' || signedFlag === '1') {
      const expiresIn = 60 * 60 * 24 // 24 hours
      const { data: signedData, error: signedErr } = await supabaseAdmin.storage
        .from('avatars')
        .createSignedUrl(filePath, expiresIn)

      if (signedErr) {
        console.error('[api/upload/avatar] createSignedUrl error:', signedErr)
        return NextResponse.json({ error: signedErr.message || String(signedErr) }, { status: 400 })
      }

      console.log('[api/upload/avatar] returning signed url')
      return NextResponse.json({ url: signedData.signedUrl })
    }

    const { data } = supabaseAdmin.storage.from('avatars').getPublicUrl(filePath)
    const publicUrl = data?.publicUrl ?? null

    console.log('[api/upload/avatar] upload complete, publicUrl=', publicUrl)
    return NextResponse.json({ url: publicUrl, publicUrl })
  } catch (err: any) {
    console.error('[api/upload/avatar] exception:', err)
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
