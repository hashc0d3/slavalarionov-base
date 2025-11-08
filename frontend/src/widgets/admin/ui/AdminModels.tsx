'use client'

import { observer } from 'mobx-react-lite'
import { configuratorStore, WatchModel, FrameColor, WatchSize } from '@/shared/store/configurator.store'
import { useState, useEffect, useRef } from 'react'
import { ImageUploader } from '@/shared/ui/ImageUploader'
import styles from './AdminPanel.module.css'

export const AdminModels = observer(() => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string>('')
  const [fallbackUrl, setFallbackUrl] = useState<string>('')
  const [formData, setFormData] = useState<Partial<WatchModel>>({
    model_name: '',
    watch_model_name: '',
    watch_model_manufacturer: '',
    main_image: '',
    watch_sizes: [],
    frame_colors: [],
    available_strap_ids: []
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Загружаем данные из API при монтировании
  useEffect(() => {
    configuratorStore.loadWatchModelsFromAPI()
    configuratorStore.loadWatchStrapsFromAPI()
  }, [])

  const startEdit = (index: number) => {
    setEditingIndex(index)
    const model = configuratorStore.watchModels[index]
    
    // Разделяем загруженное изображение и URL
    const isBase64 = model.main_image?.startsWith('data:image')
    setUploadedImage(isBase64 ? model.main_image || '' : '')
    setFallbackUrl(!isBase64 ? model.main_image || '' : '')
    
    setFormData({
      model_name: model.model_name,
      watch_model_name: model.watch_model_name,
      watch_model_manufacturer: model.watch_model_manufacturer,
      main_image: model.main_image,
      watch_sizes: [...model.watch_sizes],
      frame_colors: [...model.frame_colors],
      available_strap_ids: model.available_strap_ids || []
    })
    setIsAdding(false)
  }

  const startAdd = () => {
    setIsAdding(true)
    setEditingIndex(null)
    setUploadedImage('')
    setFallbackUrl('')
    setFormData({
      model_name: '',
      watch_model_name: '',
      watch_model_manufacturer: '',
      main_image: '',
      watch_sizes: [],
      frame_colors: [],
      available_strap_ids: []
    })
  }

  const cancelEdit = () => {
    setEditingIndex(null)
    setIsAdding(false)
    setUploadedImage('')
    setFallbackUrl('')
    setFormData({
      model_name: '',
      watch_model_name: '',
      watch_model_manufacturer: '',
      main_image: '',
      watch_sizes: [],
      frame_colors: []
    })
  }

  const handleImageUpload = (base64: string) => {
    setUploadedImage(base64)
    setFormData({ ...formData, main_image: base64 })
  }

  const saveModel = async () => {
    if (!formData.model_name || !formData.watch_model_name) {
      alert('Заполните обязательные поля: model_name и watch_model_name')
      return
    }

    // Приоритет: загруженное изображение > fallback URL
    const finalImage = uploadedImage || fallbackUrl || ''

    const modelData: WatchModel = {
      model_name: formData.model_name,
      watch_model_name: formData.watch_model_name,
      watch_model_manufacturer: formData.watch_model_manufacturer || '',
      main_image: finalImage,
      choosen: false,
      watch_sizes: formData.watch_sizes || [],
      frame_colors: formData.frame_colors || []
    }

    try {
      if (isAdding) {
        await configuratorStore.addWatchModel(modelData)
      } else if (editingIndex !== null) {
        await configuratorStore.updateWatchModel(editingIndex, modelData)
      }
      cancelEdit()
    } catch (error) {
      alert('Ошибка при сохранении модели. Проверьте консоль.')
    }
  }

  const deleteModel = async (index: number) => {
    if (confirm('Вы уверены, что хотите удалить эту модель?')) {
      try {
        await configuratorStore.deleteWatchModel(index)
      } catch (error) {
        alert('Ошибка при удалении модели. Проверьте консоль.')
      }
    }
  }

  const handleBackup = async () => {
    try {
      await configuratorStore.createBackup()
      alert('Бэкап успешно создан и скачан!')
    } catch (error) {
      alert('Ошибка при создании бэкапа. Проверьте консоль.')
    }
  }

  const handleRestoreClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.json')) {
      alert('Пожалуйста, выберите JSON файл')
      return
    }

    if (!confirm(`Восстановить данные из файла "${file.name}"? Это удалит все текущие модели и заменит их данными из бэкапа.`)) {
      return
    }

    try {
      const result = await configuratorStore.restoreFromBackup(file)
      alert(`✓ Бэкап успешно восстановлен! Загружено ${result.restoredCount} моделей.`)
    } catch (error) {
      alert('Ошибка при восстановлении бэкапа. Проверьте формат файла и консоль.')
      console.error(error)
    }

    // Очищаем input для возможности повторной загрузки того же файла
    if (e.target) {
      e.target.value = ''
    }
  }

  const addColor = () => {
    const name = prompt('Название цвета:')
    const code = prompt('Код цвета (например, #000000):')
    if (name) {
      const newColors = [...(formData.frame_colors || [])]
      newColors.push({ color_name: name, color_code: code || '', choosen: false })
      setFormData({ ...formData, frame_colors: newColors })
    }
  }

  const deleteColor = (colorIndex: number) => {
    const newColors = [...(formData.frame_colors || [])]
    newColors.splice(colorIndex, 1)
    setFormData({ ...formData, frame_colors: newColors })
  }

  const addSize = () => {
    const size = prompt('Размер (например, 40):')
    if (size) {
      const newSizes = [...(formData.watch_sizes || [])]
      newSizes.push({ watch_size: size, choosen: false })
      setFormData({ ...formData, watch_sizes: newSizes })
    }
  }

  const deleteSize = (sizeIndex: number) => {
    const newSizes = [...(formData.watch_sizes || [])]
    newSizes.splice(sizeIndex, 1)
    setFormData({ ...formData, watch_sizes: newSizes })
  }

  const resetToDefault = () => {
    if (confirm('Вы уверены, что хотите сбросить все модели к начальным данным? Все изменения будут удалены.')) {
      configuratorStore.resetWatchModelsToDefault()
      cancelEdit()
    }
  }

  return (
    <div>
      <div className={styles.header}>
        <h1>Управление моделями часов</h1>
        <div className={styles.headerButtons}>
          {!isAdding && editingIndex === null && (
            <>
              <button onClick={handleBackup} className={styles.backupButton}>
                💾 Скачать бэкап
              </button>
              <button onClick={handleRestoreClick} className={styles.restoreButton}>
                📂 Загрузить бэкап
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <button onClick={resetToDefault} className={styles.resetButton}>
                🔄 Сбросить к начальным
              </button>
              <button onClick={startAdd} className={styles.addButton}>
                + Добавить новую модель
              </button>
            </>
          )}
        </div>
      </div>

      {(isAdding || editingIndex !== null) && (
        <div className={styles.editForm}>
          <h2>{isAdding ? 'Новая модель' : 'Редактирование модели'}</h2>
          
          <div className={styles.formGroup}>
            <label>
              Название модели (model_name) *
              <input
                type="text"
                value={formData.model_name || ''}
                onChange={(e) => setFormData({ ...formData, model_name: e.target.value })}
                placeholder="Apple Watch"
              />
            </label>
          </div>

          <div className={styles.formGroup}>
            <label>
              Серия модели (watch_model_name) *
              <input
                type="text"
                value={formData.watch_model_name || ''}
                onChange={(e) => setFormData({ ...formData, watch_model_name: e.target.value })}
                placeholder="4-6 серия, SE"
              />
            </label>
          </div>

          <div className={styles.formGroup}>
            <label>
              Производитель (watch_model_manufacturer)
              <input
                type="text"
                value={formData.watch_model_manufacturer || ''}
                onChange={(e) => setFormData({ ...formData, watch_model_manufacturer: e.target.value })}
                placeholder="Apple Watch"
              />
            </label>
          </div>

          <div className={styles.formGroup}>
            <label>Изображение модели</label>
            <ImageUploader
              onImageUpload={handleImageUpload}
              currentImage={uploadedImage}
              fallbackUrl={fallbackUrl}
            />
          </div>

          <div className={styles.formGroup}>
            <label>
              URL картинки (запасной вариант)
              <input
                type="text"
                value={fallbackUrl}
                onChange={(e) => setFallbackUrl(e.target.value)}
                placeholder="https://api.slavalarionov.store/uploads/..."
              />
            </label>
            <p className={styles.hint}>
              💡 Этот URL будет использоваться, если изображение не загружено с устройства
            </p>
          </div>

          <div className={styles.formGroup}>
            <label>Размеры</label>
            <div className={styles.list}>
              {formData.watch_sizes?.map((size, idx) => (
                <div key={idx} className={styles.listItem}>
                  <span>{size.watch_size}mm</span>
                  <button onClick={() => deleteSize(idx)} className={styles.deleteBtn}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button onClick={addSize} className={styles.addSmallBtn}>
              + Добавить размер
            </button>
          </div>

          <div className={styles.formGroup}>
            <label>Цвета корпуса</label>
            <div className={styles.list}>
              {formData.frame_colors?.map((color, idx) => (
                <div key={idx} className={styles.listItem}>
                  <div className={styles.colorItem}>
                    <div
                      className={styles.colorPreview}
                      style={{ backgroundColor: color.color_code }}
                    />
                    <span>{color.color_name}</span>
                  </div>
                  <button onClick={() => deleteColor(idx)} className={styles.deleteBtn}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button onClick={addColor} className={styles.addSmallBtn}>
              + Добавить цвет
            </button>
          </div>

          <div className={styles.formGroup}>
            <label>Доступные ремешки для этой модели</label>
            <p className={styles.hint}>
              💡 Выберите ремешки, которые совместимы с этой моделью часов (Ctrl/Cmd+клик для выбора нескольких)
            </p>
            <select
              multiple
              value={formData.available_strap_ids?.map(String) || []}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions).map(option => parseInt(option.value))
                setFormData({ ...formData, available_strap_ids: selected })
              }}
              className={styles.multiSelect}
            >
              {configuratorStore.watchStraps.map((strap) => {
                const strapId = strap.attributes.watch_strap.id
                return (
                  <option key={strapId} value={strapId}>
                    {strap.attributes.watch_strap.strap_title} (ID: {strapId})
                  </option>
                )
              })}
            </select>
            <div className={styles.multiSelectActions}>
              <button
                type="button"
                onClick={() => {
                  const allStrapIds = configuratorStore.watchStraps.map(s => s.attributes.watch_strap.id)
                  setFormData({ ...formData, available_strap_ids: allStrapIds })
                }}
                className={styles.addSmallBtn}
              >
                Выбрать все
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, available_strap_ids: [] })}
                className={styles.addSmallBtn}
              >
                Очистить
              </button>
            </div>
          </div>

          <div className={styles.formActions}>
            <button onClick={saveModel} className={styles.saveBtn}>
              {isAdding ? 'Добавить' : 'Сохранить'}
            </button>
            <button onClick={cancelEdit} className={styles.cancelBtn}>
              Отмена
            </button>
          </div>
        </div>
      )}

      <div className={styles.modelsList}>
        <h2>Существующие модели ({configuratorStore.watchModels.length})</h2>
        {configuratorStore.watchModels.map((model, index) => (
          <div key={index} className={styles.modelCard}>
            <div className={styles.modelHeader}>
              {model.main_image && (
                <img src={model.main_image} alt={model.watch_model_name} className={styles.modelImage} />
              )}
              <div className={styles.modelInfo}>
                <h3>{model.watch_model_name}</h3>
                <p className={styles.modelName}>{model.model_name}</p>
                {model.watch_model_manufacturer && (
                  <p className={styles.manufacturer}>{model.watch_model_manufacturer}</p>
                )}
              </div>
            </div>

            <div className={styles.modelDetails}>
              <div className={styles.detailSection}>
                <strong>Размеры:</strong>
                <div className={styles.tags}>
                  {model.watch_sizes.map((size, idx) => (
                    <span key={idx} className={styles.tag}>
                      {size.watch_size}mm
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.detailSection}>
                <strong>Цвета корпуса:</strong>
                <div className={styles.colors}>
                  {model.frame_colors.map((color, idx) => (
                    <div key={idx} className={styles.colorTag}>
                      <div
                        className={styles.colorCircle}
                        style={{ backgroundColor: color.color_code }}
                      />
                      <span>{color.color_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.modelActions}>
              <button onClick={() => startEdit(index)} className={styles.editBtn}>
                Редактировать
              </button>
              <button onClick={() => deleteModel(index)} className={styles.deleteButton}>
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})

