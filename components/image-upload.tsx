"use client"

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface ImageUploadProps {
  currentImage?: string
  onImageChange: (imagePath: string) => void
  type: 'service' | 'project'
  disabled?: boolean
}

export default function ImageUpload({ currentImage, onImageChange, type, disabled = false }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError('')
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('type', type)

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        onImageChange(result.imagePath)
      } else {
        setError(result.error || 'Upload failed')
      }
    } catch (error) {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    onImageChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      {/* Current Image Display */}
      {currentImage && (
        <div className="relative">
          <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={currentImage}
              alt="Current image"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                target.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-500"><span>Image not found</span></div>'
              }}
            />
          </div>
          {!disabled && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Upload Area */}
      {!disabled && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#4fdce5] hover:bg-[#4fdce5]/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex flex-col items-center space-y-2">
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4fdce5]"></div>
                  <span className="text-sm text-gray-600">Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-gray-400" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">
                      {currentImage ? 'Change Image' : 'Upload Image'}
                    </p>
                    <p className="text-xs text-gray-500">
                      JPEG, PNG, WebP up to 5MB
                    </p>
                  </div>
                </>
              )}
            </div>
          </button>

          {error && (
            <p className="text-sm text-red-600 mt-2">{error}</p>
          )}
        </div>
      )}

      {/* Image URL Input (Fallback) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image URL (Alternative)
        </label>
        <div className="relative">
          <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={currentImage || ''}
            onChange={(e) => onImageChange(e.target.value)}
            placeholder="/placeholder.jpg"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4fdce5] focus:border-[#4fdce5] text-gray-900 bg-white"
            disabled={disabled}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Use the upload button above or paste an image URL here
        </p>
      </div>
    </div>
  )
}
