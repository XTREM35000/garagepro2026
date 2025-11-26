"use client"

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

type Props = {
  value?: string | null
  bucket?: string
  upload?: boolean // if true, upload to Supabase storage automatically
  onChange?: (file: File | null) => void
  onUpload?: (publicUrl: string | null) => void
}

export default function AvatarUploader({ value = null, bucket = 'avatars', upload = true, onChange, onUpload }: Props) {
  const isDev = process.env.NODE_ENV !== 'production'
  const [preview, setPreview] = useState<string | null>(value)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleFile = async (f: File | null) => {
    setError(null)
    setFile(f)
    if (!f) {
      setPreview(value)
      onChange?.(null)
      return
    }

    if (!f.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image.')
      onChange?.(null)
      return
    }

    const url = URL.createObjectURL(f)
    setPreview(url)
    onChange?.(f)

    if (upload) {
      setUploading(true)
      try {
        if (isDev) console.log('[AvatarUploader] 🟢 Starting upload for file:', f.name, 'type:', f.type, 'size:', (f as any).size)

        const form = new FormData()
        form.append('file', f as File)
        form.append('signed', 'false')

        if (isDev) console.log('[AvatarUploader] FormData created, about to fetch /api/upload/avatar')

        const res = await fetch('/api/upload/avatar', {
          method: 'POST',
          body: form,
        })

        const status = res.status
        if (isDev) console.log('[AvatarUploader] Response status:', status)

        const json = await res.json()
        if (isDev) console.log('[AvatarUploader] ✅ Response body:', json)

        if (!res.ok) {
          if (isDev) console.warn('[AvatarUploader] ❌ Upload failed:', json?.error)
          setError(json?.error || "Erreur lors de l'upload")
          onUpload?.(null)
        } else {
          if (isDev) console.log('[AvatarUploader] ✅ Upload successful, publicUrl:', json.publicUrl)
          onUpload?.(json.publicUrl ?? null)
        }
      } catch (err: any) {
        if (isDev) console.error('[AvatarUploader] ❌ Exception during upload:', err)
        setError("Erreur lors de l'upload de l'avatar.")
        onUpload?.(null)
      } finally {
        setUploading(false)
      }
    }
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null
    handleFile(f)
  }

  return (
    <div className="flex items-center gap-4">
      <div className="h-16 w-16 rounded-full bg-gray-100 overflow-hidden relative">
        {preview ? (
          <Image src={preview} alt={preview ? "Aperçu de l'avatar" : 'Avatar par défaut'} className="object-cover" fill sizes="64px" />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <span className="text-gray-400">A</span>
          </div>
        )}
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="avatar">Choisir un fichier</label>
          <button
            type="button"
            aria-label="Choisir un avatar"
            className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
            onClick={() => inputRef.current?.click()}
          >
            Choisir
          </button>
          {file && (
            <button
              type="button"
              aria-label="Supprimer l'avatar sélectionné"
              className="rounded bg-red-100 px-3 py-1 text-sm text-red-700 hover:bg-red-200"
              onClick={() => {
                setFile(null)
                setPreview(value)
                setError(null)
                onChange?.(null)
                onUpload?.(null)
                if (inputRef.current) inputRef.current.value = ''
              }}
            >
              Supprimer
            </button>
          )}
        </div>
        <input id="avatar" name="avatar" ref={inputRef} type="file" accept="image/*" onChange={onInputChange} className="hidden" aria-describedby="avatar-desc" />
        <p id="avatar-desc" className="text-xs text-gray-500 mt-1">Taille recommandée: 256x256 (PNG/JPG)</p>
        {uploading && <p role="status" aria-live="polite" className="text-xs text-gray-500 mt-1">Upload en cours...</p>}
        {error && <p role="alert" className="text-xs text-red-600 mt-1">{error}</p>}
      </div>
    </div>
  )
}
