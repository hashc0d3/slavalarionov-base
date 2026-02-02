import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: '.next',
  // Отключаем линтинг и проверку типов в production build для ускорения
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Оптимизации для ускорения сборки
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // Отключаем генерацию source maps для ускорения сборки
  productionBrowserSourceMaps: false,
  // Оптимизация изображений
  images: {
    unoptimized: false,
    // Разрешаем загрузку изображений с внешних доменов
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    // Кэширование изображений
    minimumCacheTTL: 60,
    // Форматы изображений
    formats: ['image/avif', 'image/webp'],
  },
  // Уменьшаем количество оптимизаций во время сборки
  experimental: {
    optimizeCss: false, // Отключаем CSS оптимизацию во время сборки
  },
  // Явно указываем webpack для разрешения путей
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src'),
    };
    // Снижаем частоту HMR при изменении CSS — уменьшает ошибку removeChild в dev
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: /node_modules/,
        aggregateTimeout: 400,
      };
    }
    return config;
  },
};

export default nextConfig;
