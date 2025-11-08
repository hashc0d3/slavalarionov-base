'use client'

import { observer } from 'mobx-react-lite'
import { Strap, StrapColor } from '@/shared/store/configurator.store'
import styles from './AdminPanel.module.css'

interface StrapFormProps {
  formData: Partial<Strap>
  onChange: (data: Partial<Strap>) => void
  onSave: () => void
  onCancel: () => void
  isAdding: boolean
}

export const StrapForm = observer(({ formData, onChange, onSave, onCancel, isAdding }: StrapFormProps) => {
  const watchStrap = formData.attributes?.watch_strap || {}

  const updateStrapField = (field: string, value: any) => {
    onChange({
      ...formData,
      attributes: {
        watch_strap: {
          ...watchStrap,
          [field]: value
        }
      }
    })
  }

  const addColor = (colorType: 'leather_colors' | 'stitching_colors' | 'edge_colors' | 'buckle_colors' | 'adapter_colors') => {
    const name = prompt('Название цвета:')
    const code = prompt('Код цвета (например, #000000):')
    if (name) {
      const colors = [...(watchStrap.strap_params?.[colorType] || [])]
      colors.push({ color_title: name, color_code: code || '', choosen: false })
      
      updateStrapField('strap_params', {
        ...watchStrap.strap_params,
        [colorType]: colors
      })
    }
  }

  const deleteColor = (colorType: string, index: number) => {
    const colors = [...(watchStrap.strap_params?.[colorType] || [])]
    colors.splice(index, 1)
    
    updateStrapField('strap_params', {
      ...watchStrap.strap_params,
      [colorType]: colors
    })
  }

  return (
    <div className={styles.form}>
      <h2>{isAdding ? 'Добавить ремешок' : 'Редактировать ремешок'}</h2>

      <div className={styles.formGroup}>
        <label>Название (strap_name)</label>
        <input
          type="text"
          value={watchStrap.strap_name || ''}
          onChange={(e) => updateStrapField('strap_name', e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Заголовок (strap_title)</label>
        <input
          type="text"
          value={watchStrap.strap_title || ''}
          onChange={(e) => updateStrapField('strap_title', e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Описание</label>
        <textarea
          value={watchStrap.strap_description || ''}
          onChange={(e) => updateStrapField('strap_description', e.target.value)}
          rows={3}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Краткое описание</label>
        <input
          type="text"
          value={watchStrap.strap_short_description || ''}
          onChange={(e) => updateStrapField('strap_short_description', e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Цена</label>
        <input
          type="number"
          value={watchStrap.price || 0}
          onChange={(e) => updateStrapField('price', parseFloat(e.target.value))}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Изображение (URL)</label>
        <input
          type="text"
          value={watchStrap.preview_image || ''}
          onChange={(e) => updateStrapField('preview_image', e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Ultra изображение (URL)</label>
        <input
          type="text"
          value={watchStrap.ultra_preview_image || ''}
          onChange={(e) => updateStrapField('ultra_preview_image', e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label>
          <input
            type="checkbox"
            checked={watchStrap.has_buckle_butterfly || false}
            onChange={(e) => updateStrapField('has_buckle_butterfly', e.target.checked)}
          />
          {' '}Есть пряжка-бабочка
        </label>
      </div>

      {/* Цвета кожи */}
      <div className={styles.formGroup}>
        <label>Цвета кожи</label>
        <div className={styles.list}>
          {(watchStrap.strap_params?.leather_colors || []).map((color: StrapColor, idx: number) => (
            <div key={idx} className={styles.listItem}>
              <div className={styles.colorItem}>
                <div className={styles.colorPreview} style={{ backgroundColor: color.color_code }} />
                {color.color_title}
              </div>
              <button onClick={() => deleteColor('leather_colors', idx)} className={styles.deleteBtn}>×</button>
            </div>
          ))}
        </div>
        <button onClick={() => addColor('leather_colors')} className={styles.addSmallBtn}>Добавить цвет</button>
      </div>

      {/* Цвета строчки */}
      <div className={styles.formGroup}>
        <label>Цвета строчки</label>
        <div className={styles.list}>
          {(watchStrap.strap_params?.stitching_colors || []).map((color: StrapColor, idx: number) => (
            <div key={idx} className={styles.listItem}>
              <div className={styles.colorItem}>
                <div className={styles.colorPreview} style={{ backgroundColor: color.color_code }} />
                {color.color_title}
              </div>
              <button onClick={() => deleteColor('stitching_colors', idx)} className={styles.deleteBtn}>×</button>
            </div>
          ))}
        </div>
        <button onClick={() => addColor('stitching_colors')} className={styles.addSmallBtn}>Добавить цвет</button>
      </div>

      {/* Цвета края */}
      <div className={styles.formGroup}>
        <label>Цвета края</label>
        <div className={styles.list}>
          {(watchStrap.strap_params?.edge_colors || []).map((color: StrapColor, idx: number) => (
            <div key={idx} className={styles.listItem}>
              <div className={styles.colorItem}>
                <div className={styles.colorPreview} style={{ backgroundColor: color.color_code }} />
                {color.color_title}
              </div>
              <button onClick={() => deleteColor('edge_colors', idx)} className={styles.deleteBtn}>×</button>
            </div>
          ))}
        </div>
        <button onClick={() => addColor('edge_colors')} className={styles.addSmallBtn}>Добавить цвет</button>
      </div>

      {/* Цвета пряжки */}
      <div className={styles.formGroup}>
        <label>Цвета пряжки</label>
        <div className={styles.list}>
          {(watchStrap.strap_params?.buckle_colors || []).map((color: StrapColor, idx: number) => (
            <div key={idx} className={styles.listItem}>
              <div className={styles.colorItem}>
                <div className={styles.colorPreview} style={{ backgroundColor: color.color_code }} />
                {color.color_title}
              </div>
              <button onClick={() => deleteColor('buckle_colors', idx)} className={styles.deleteBtn}>×</button>
            </div>
          ))}
        </div>
        <button onClick={() => addColor('buckle_colors')} className={styles.addSmallBtn}>Добавить цвет</button>
      </div>

      {/* Цвета адаптера */}
      <div className={styles.formGroup}>
        <label>Цвета адаптера</label>
        <div className={styles.list}>
          {(watchStrap.strap_params?.adapter_colors || []).map((color: StrapColor, idx: number) => (
            <div key={idx} className={styles.listItem}>
              <div className={styles.colorItem}>
                <div className={styles.colorPreview} style={{ backgroundColor: color.color_code }} />
                {color.color_title}
              </div>
              <button onClick={() => deleteColor('adapter_colors', idx)} className={styles.deleteBtn}>×</button>
            </div>
          ))}
        </div>
        <button onClick={() => addColor('adapter_colors')} className={styles.addSmallBtn}>Добавить цвет</button>
      </div>

      <div className={styles.formActions}>
        <button onClick={onSave} className={styles.saveBtn}>Сохранить</button>
        <button onClick={onCancel} className={styles.cancelBtn}>Отмена</button>
      </div>
    </div>
  )
})


