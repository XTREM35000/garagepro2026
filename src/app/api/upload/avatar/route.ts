import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase admin client not configured. Set SUPABASE_SERVICE_ROLE_KEY.' }, { status: 500 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const signedFlag = formData.get('signed')

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // server-side validation
    const ALLOWED = ['image/png', 'image/jpeg', 'image/webp']
    const MAX_BYTES = 5 * 1024 * 1024 // 5MB

    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    if ((file as any).size && (file as any).size > MAX_BYTES) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const fileExt = file.name.split('.').pop() ?? 'png'
    const filePath = `avatars/${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`

    const { error: uploadError } = await supabaseAdmin.storage
      .from('avatars')
      .upload(filePath, buffer, { contentType: file.type })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message || String(uploadError) }, { status: 400 })
    }

    // If client asked for a signed url, return that (valid 24h)
    if (signedFlag === 'true' || signedFlag === '1') {
      const expiresIn = 60 * 60 * 24 // 24 hours
      const { data: signedData, error: signedErr } = await supabaseAdmin.storage
        .from('avatars')
        .createSignedUrl(filePath, expiresIn)

      if (signedErr) {
        return NextResponse.json({ error: signedErr.message || String(signedErr) }, { status: 400 })
      }

      return NextResponse.json({ url: signedData.signedUrl })
    }

    const { data } = supabaseAdmin.storage.from('avatars').getPublicUrl(filePath)
    const publicUrl = data?.publicUrl ?? null

    return NextResponse.json({ publicUrl })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
