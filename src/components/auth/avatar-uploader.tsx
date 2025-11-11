"use client"

import React, { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'

type Props = {
  value?: string | null
  bucket?: string
  upload?: boolean // if true, upload to Supabase storage automatically
  onChange?: (file: File | null) => void
  onUpload?: (publicUrl: string | null) => void
}

export default function AvatarUploader({ value = null, bucket = 'avatars', upload = true, onChange, onUpload }: Props) {
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
        const form = new FormData()
        form.append('file', f as File)

        const res = await fetch('/api/upload/avatar', {
          method: 'POST',
          body: form,
        })

        const json = await res.json()
        if (!res.ok) {
          setError(json?.error || 'Erreur lors de l\'upload')
          onUpload?.(null)
        } else {
          onUpload?.(json.publicUrl ?? null)
        }
      } catch (err) {
        console.warn('Avatar upload exception', err)
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
      <div className="h-16 w-16 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="avatar" className="h-full w-full object-cover" />
        ) : (
          <span className="text-gray-400">A</span>
        )}
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
            onClick={() => inputRef.current?.click()}
          >
            Choisir
          </button>
          {file && (
            <button
              type="button"
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
        <input ref={inputRef} type="file" accept="image/*" onChange={onInputChange} className="hidden" />
        <p className="text-xs text-gray-500 mt-1">Taille recommandée: 256x256 (PNG/JPG)</p>
        {uploading && <p className="text-xs text-gray-500 mt-1">Upload en cours...</p>}
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      </div>
    </div>
  )
}
