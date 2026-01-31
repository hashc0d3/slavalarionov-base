/**
 * Импорт JSON-бэкапа моделей часов (файл bd) в базу данных.
 * Картинки по http(s)-ссылкам скачиваются и сохраняются в backend/uploads/.
 * Использование: npx ts-node prisma/import-backup.ts [путь/к/bd]
 *
 * По умолчанию читает файл bd из корня проекта.
 */

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

/** Кэш: URL картинки -> локальный путь для БД (/uploads/...) */
const imageUrlToLocalPath = new Map<string, string>()

function isImageUrl(value: string | null | undefined): value is string {
  if (!value || typeof value !== 'string') return false
  const trimmed = value.trim()
  return trimmed.startsWith('http://') || trimmed.startsWith('https://')
}

/**
 * Скачивает картинку по URL и сохраняет в uploadsDir.
 * Возвращает путь для записи в БД (например /uploads/filename.png).
 * Повторные вызовы с тем же URL возвращают путь из кэша без повторной загрузки.
 */
async function downloadImageToUploads(
  imageUrl: string,
  uploadsDir: string,
): Promise<string> {
  const url = imageUrl.trim()
  const cached = imageUrlToLocalPath.get(url)
  if (cached) return cached

  let localPath: string
  try {
    const response = await fetch(url, { redirect: 'follow' })
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    const buffer = Buffer.from(await response.arrayBuffer())
    const urlPathname = new URL(url).pathname
    const basename = path.basename(urlPathname) || `image_${Date.now()}.png`
    const safeName = basename.replace(/[^a-zA-Z0-9._-]/g, '_')
    const filePath = path.join(uploadsDir, safeName)
    fs.mkdirSync(uploadsDir, { recursive: true })
    fs.writeFileSync(filePath, buffer)
    localPath = `/uploads/${safeName}`
    imageUrlToLocalPath.set(url, localPath)
  } catch (err) {
    console.warn(`   ⚠ Не удалось скачать ${url}:`, (err as Error).message)
    return url
  }
  return localPath
}

/**
 * Для строки с URL — скачивает и возвращает локальный путь; иначе возвращает значение как есть.
 */
async function resolveImageUrl(
  value: string | null | undefined,
  uploadsDir: string,
): Promise<string | undefined> {
  if (!value) return undefined
  if (isImageUrl(value)) {
    return downloadImageToUploads(value, uploadsDir)
  }
  return value
}

/** Собирает все http(s) URL из объекта рекурсивно, в т.ч. из JSON-строк (strap_params и т.д.). */
function extractAllImageUrls(obj: unknown, out: Set<string>): void {
  if (obj == null) return
  if (typeof obj === 'string') {
    const s = obj.trim()
    if (s.startsWith('http://') || s.startsWith('https://')) {
      out.add(s)
    } else if ((s.startsWith('{') && s.endsWith('}')) || (s.startsWith('[') && s.endsWith(']'))) {
      try {
        extractAllImageUrls(JSON.parse(s), out)
      } catch {
        // не JSON — игнор
      }
    }
    return
  }
  if (Array.isArray(obj)) {
    obj.forEach((item) => extractAllImageUrls(item, out))
    return
  }
  if (typeof obj === 'object') {
    for (const v of Object.values(obj)) extractAllImageUrls(v, out)
  }
}

/** Заменяет все URL картинок в объекте на локальные пути из кэша (после скачивания). */
function replaceUrlsInValue(val: unknown): unknown {
  if (val == null) return val
  if (typeof val === 'string') {
    const s = val.trim()
    const local = imageUrlToLocalPath.get(s)
    if (local) return local
    if ((s.startsWith('{') && s.endsWith('}')) || (s.startsWith('[') && s.endsWith(']'))) {
      try {
        return JSON.stringify(replaceUrlsInValue(JSON.parse(s)))
      } catch {
        return val
      }
    }
    return val
  }
  if (Array.isArray(val)) return val.map(replaceUrlsInValue)
  if (typeof val === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(val)) out[k] = replaceUrlsInValue(v)
    return out
  }
  return val
}

interface ColorFromBackup {
  id: number
  technical_name: string
  display_name: string
  hex_code: string
  createdAt: string
  updatedAt: string
}

interface FrameColorFromBackup {
  id: number
  colorId: number
  view1Image: string | null
  view2Image: string | null
  view3Image: string | null
  watchModelId: number
  color: ColorFromBackup
}

interface WatchSizeFromBackup {
  id: number
  watch_size: string
  watchModelId: number
}

interface WatchStrapFromBackup {
  id: number
  strap_name: string
  strap_title: string
  strap_description?: string | null
  strap_short_description?: string | null
  price: number
  preview_image?: string | null
  ultra_preview_image?: string | null
  has_buckle_butterfly?: boolean
  buckle_butterfly_price?: number
  buckle_butterfly_image?: string | null
  strap_params: string
  createdAt?: string
  updatedAt?: string
}

interface AvailableStrapFromBackup {
  id: number
  watchModelId: number
  watchStrapId: number
  watchStrap: WatchStrapFromBackup
}

interface WatchModelFromBackup {
  id: number
  model_name: string
  watch_model_name: string
  watch_model_manufacturer: string | null
  main_image: string | null
  createdAt: string
  updatedAt: string
  watch_sizes: WatchSizeFromBackup[]
  frame_colors: FrameColorFromBackup[]
  available_straps?: AvailableStrapFromBackup[]
}

interface BackupFile {
  timestamp: string
  data: WatchModelFromBackup[]
}

function getBackupPath(): string {
  const arg = process.argv[2]
  if (arg) return path.resolve(process.cwd(), arg)
  const root = path.join(__dirname, '../..')
  const candidates = ['bd', 'bd.json'].map((name) => path.join(root, name))
  for (const p of candidates) {
    if (fs.existsSync(p)) return p
  }
  return path.join(root, 'bd')
}

async function main() {
  const backupPath = getBackupPath()
  console.log('📂 Чтение бэкапа:', backupPath)

  if (!fs.existsSync(backupPath)) {
    console.error('❌ Файл не найден:', backupPath)
    console.log('   Укажите путь: npx ts-node prisma/import-backup.ts путь/к/bd')
    process.exit(1)
  }

  let raw = fs.readFileSync(backupPath, 'utf-8')
  // Убираем BOM, если есть (часто бывает при сохранении из браузера/редактора)
  if (raw.charCodeAt(0) === 0xfeff) {
    raw = raw.slice(1)
  }
  raw = raw.trim()
  if (!raw) {
    console.error('❌ Файл бэкапа пустой')
    process.exit(1)
  }
  let backup: BackupFile
  try {
    backup = JSON.parse(raw)
  } catch (e) {
    const err = e as SyntaxError
    console.error('❌ Неверный JSON в файле бэкапа:', err.message)
    if (err.message.includes('position')) {
      const match = err.message.match(/position (\d+)/)
      if (match) {
        const pos = parseInt(match[1], 10)
        const start = Math.max(0, pos - 40)
        const snippet = raw.slice(start, pos + 40).replace(/\n/g, ' ')
        console.error('   Фрагмент вокруг ошибки:', snippet)
      }
    }
    process.exit(1)
  }

  if (!backup.data || !Array.isArray(backup.data)) {
    console.error('❌ В бэкапе нет поля data или это не массив')
    process.exit(1)
  }

  console.log(`📊 Найдено моделей часов: ${backup.data.length}`)

  // Собираем все уникальные URL картинок по всему бэкапу (включая strap_params и вложенные JSON)
  const allImageUrls = new Set<string>()
  extractAllImageUrls(backup, allImageUrls)
  const uploadsDir = path.join(process.cwd(), 'uploads')
  fs.mkdirSync(uploadsDir, { recursive: true })
  if (allImageUrls.size > 0) {
    console.log(`🖼  Уникальных ссылок на картинки: ${allImageUrls.size} (одинаковые URL в файле считаются один раз), скачиваю...`)
    let done = 0
    for (const url of allImageUrls) {
      await downloadImageToUploads(url, uploadsDir)
      done++
      if (done % 100 === 0 || done === allImageUrls.size) {
        console.log(`   ${done}/${allImageUrls.size}`)
      }
    }
    console.log(`🖼  Скачано уникальных картинок: ${imageUrlToLocalPath.size}`)
  }

  // Собираем уникальные цвета по technical_name
  const colorsMap = new Map<string, ColorFromBackup>()
  for (const model of backup.data) {
    for (const fc of model.frame_colors || []) {
      if (fc.color && fc.color.technical_name) {
        colorsMap.set(fc.color.technical_name, fc.color)
      }
    }
  }
  const uniqueColors = Array.from(colorsMap.values())
  console.log(`🎨 Уникальных цветов: ${uniqueColors.length}`)

  // 1. Убеждаемся, что все цвета есть в БД (upsert по technical_name)
  const colorIdMap = new Map<number, number>() // старый id -> новый id
  for (const c of uniqueColors) {
    const color = await prisma.color.upsert({
      where: { technical_name: c.technical_name },
      create: {
        technical_name: c.technical_name,
        display_name: c.display_name,
        hex_code: c.hex_code,
      },
      update: {
        display_name: c.display_name,
        hex_code: c.hex_code,
      },
    })
    colorIdMap.set(c.id, color.id)
  }

  // 2. Удаляем существующие модели часов (каскадно удалятся frame_colors, watch_sizes, watch_model_straps)
  const deleted = await prisma.watchModel.deleteMany({})
  console.log(`🗑️  Удалено старых моделей: ${deleted.count}`)

  // 2b. Собираем уникальные ремешки из available_straps и импортируем с подстановкой локальных путей
  const strapsByName = new Map<string, WatchStrapFromBackup>()
  for (const model of backup.data) {
    for (const av of model.available_straps || []) {
      if (av.watchStrap && av.watchStrap.strap_name) {
        strapsByName.set(av.watchStrap.strap_name, av.watchStrap)
      }
    }
  }
  const strapIdMap = new Map<number, number>() // старый id -> новый id
  if (strapsByName.size > 0) {
    console.log(`👜 Ремешков в бэкапе: ${strapsByName.size}, импортирую...`)
    for (const strap of strapsByName.values()) {
      const strapParamsObj = replaceUrlsInValue(
        (() => {
          try {
            return JSON.parse(strap.strap_params)
          } catch {
            return {}
          }
        })(),
      )
      const strapParamsStr =
        typeof strapParamsObj === 'string' ? strapParamsObj : JSON.stringify(strapParamsObj)
      const previewRaw = strap.preview_image?.trim()
      const preview = (previewRaw && imageUrlToLocalPath.get(previewRaw)) ?? previewRaw ?? undefined
      const ultraRaw = strap.ultra_preview_image?.trim()
      const ultraPreview = (ultraRaw && imageUrlToLocalPath.get(ultraRaw)) ?? ultraRaw ?? undefined
      const buckleRaw = strap.buckle_butterfly_image?.trim()
      const buckleImage = (buckleRaw && imageUrlToLocalPath.get(buckleRaw)) ?? buckleRaw ?? undefined
      const created = await prisma.watchStrap.upsert({
        where: { strap_name: strap.strap_name },
        create: {
          strap_name: strap.strap_name,
          strap_title: strap.strap_title,
          strap_description: strap.strap_description ?? undefined,
          strap_short_description: strap.strap_short_description ?? undefined,
          price: strap.price,
          preview_image: preview,
          ultra_preview_image: ultraPreview,
          has_buckle_butterfly: strap.has_buckle_butterfly ?? false,
          buckle_butterfly_price: strap.buckle_butterfly_price ?? 0,
          buckle_butterfly_image: buckleImage,
          strap_params: strapParamsStr,
        },
        update: {
          strap_title: strap.strap_title,
          strap_description: strap.strap_description ?? undefined,
          strap_short_description: strap.strap_short_description ?? undefined,
          price: strap.price,
          preview_image: preview,
          ultra_preview_image: ultraPreview,
          has_buckle_butterfly: strap.has_buckle_butterfly ?? false,
          buckle_butterfly_price: strap.buckle_butterfly_price ?? 0,
          buckle_butterfly_image: buckleImage,
          strap_params: strapParamsStr,
        },
      })
      strapIdMap.set(strap.id, created.id)
      console.log('   ✓', created.strap_title)
    }
  }

  console.log('🖼  Картинки в:', uploadsDir)

  // 3. Создаём модели с размерами и цветами корпуса; картинки по URL уже в кэше
  const modelIdMap = new Map<number, number>() // старый id -> новый id
  for (const model of backup.data) {
    const mainImageResolved = await resolveImageUrl(model.main_image, uploadsDir)

    const frameColorsData = await Promise.all(
      (model.frame_colors || []).map(async (fc) => {
        const newColorId = colorIdMap.get(fc.colorId) ?? fc.colorId
        return {
          colorId: newColorId,
          view1Image: await resolveImageUrl(fc.view1Image, uploadsDir),
          view2Image: await resolveImageUrl(fc.view2Image, uploadsDir),
          view3Image: await resolveImageUrl(fc.view3Image, uploadsDir),
        }
      }),
    )

    const newModel = await prisma.watchModel.create({
      data: {
        model_name: model.model_name,
        watch_model_name: model.watch_model_name,
        watch_model_manufacturer: model.watch_model_manufacturer ?? undefined,
        main_image: mainImageResolved ?? undefined,
        watch_sizes: {
          create: (model.watch_sizes || []).map((s) => ({ watch_size: s.watch_size })),
        },
        frame_colors: {
          create: frameColorsData,
        },
      },
    })
    modelIdMap.set(model.id, newModel.id)
    console.log('   ✓', newModel.watch_model_name)
  }

  // 4. Связи модель–ремешок (available_straps)
  let linksCreated = 0
  for (const model of backup.data) {
    const newModelId = modelIdMap.get(model.id)
    if (!newModelId) continue
    for (const av of model.available_straps || []) {
      const newStrapId = strapIdMap.get(av.watchStrapId)
      if (newStrapId == null) continue
      try {
        await prisma.watchModelStrap.create({
          data: { watchModelId: newModelId, watchStrapId: newStrapId },
        })
        linksCreated++
      } catch (e: unknown) {
        if (e && typeof e === 'object' && 'code' in e && (e as { code: string }).code === 'P2002') {
          // unique constraint — связь уже есть
        } else throw e
      }
    }
  }
  if (linksCreated > 0) {
    console.log(`🔗 Связей модель–ремешок: ${linksCreated}`)
  }

  console.log('')
  console.log('✅ Бэкап успешно применён.')
  console.log('   Промокоды и настройки конфигуратора не изменялись.')
}

main()
  .catch((e) => {
    console.error('Ошибка импорта:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
