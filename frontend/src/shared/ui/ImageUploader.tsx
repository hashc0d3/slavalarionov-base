'use client'

import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import styles from './ImageUploader.module.css'

interface ImageUploaderProps {
  onImageUpload: (base64: string) => void
  currentImage?: string
  fallbackUrl?: string
}

export const ImageUploader = ({ onImageUpload, currentImage, fallbackUrl }: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите файл изображения')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target?.result as string
      onImageUpload(base64)
    }
    reader.readAsDataURL(file)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const displayImage = currentImage || fallbackUrl

  return (
    <div className={styles.container}>
      <div
        className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {displayImage ? (
          <div className={styles.imagePreview}>
            <img src={displayImage} alt="Preview" />
            <div className={styles.overlay}>
              <span>Нажмите или перетащите новое изображение</span>
            </div>
          </div>
        ) : (
          <div className={styles.placeholder}>
            <div className={styles.uploadIcon}>📁</div>
            <p>Перетащите изображение сюда</p>
            <p className={styles.or}>или</p>
            <button type="button" className={styles.selectButton}>
              Выбрать файл
            </button>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className={styles.fileInput}
        />
      </div>
      
      {currentImage && currentImage !== fallbackUrl && (
        <div className={styles.imageInfo}>
          <span className={styles.badge}>✓ Загружено с устройства</span>
        </div>
      )}
      
      {!currentImage && fallbackUrl && (
        <div className={styles.imageInfo}>
          <span className={styles.badgeUrl}>🔗 Используется URL</span>
        </div>
      )}
    </div>
  )
}

