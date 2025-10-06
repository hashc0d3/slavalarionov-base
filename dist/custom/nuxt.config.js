"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rollup_plugin_1 = require("@optimize-lodash/rollup-plugin");
const dotenv_1 = require("dotenv");
const isDev = process.env.NODE_ENV === 'development';
const envFilename = isDev ? '.env.dev' : '.env.prod';
(0, dotenv_1.config)({ path: envFilename });
exports.default = defineNuxtConfig({
    hooks: {
        'vite:extendConfig': (config) => {
            config?.plugins?.push((0, rollup_plugin_1.optimizeLodashImports)());
        }
    },
    modules: [
        [
            '@pinia/nuxt',
            {
                autoImports: ['defineStore']
            }
        ],
        '@nuxtjs/apollo',
        '@nuxtjs/strapi',
        '@nuxtjs/eslint-module'
    ],
    strapi: {
        url: process.env.STRAPI_URL || 'http://localhost:1337'
    },
    apollo: {
        clients: {
            default: {
                httpEndpoint: process.env.STRAPI_URL + '/graphql' ||
                    'http://localhost:1337/graphql'
            }
        }
    },
    components: [
        {
            path: '~/components',
            pathPrefix: false
        }
    ],
    eslint: {
        lintOnStart: false
    },
    css: ['~/assets/scss/main.scss'],
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@use "@/assets/scss/_variables.scss" as *;'
                }
            },
            modules: {
                generateScopedName: '[hash:base64:8]'
            }
        },
        plugins: []
    },
    runtimeConfig: {
        public: {
            API_BASE_URL: process.env.STRAPI_URL || 'http://localhost:1337',
            SERVICE_PATH: process.env.SERVICE_PATH,
            BACKEND_BASE_ADDRESS: process.env.BACKEND_BASE_ADDRESS,
            YANDEX_API_KEY: process.env.YANDEX_API_KEY
        }
    },
    imports: {
        dirs: ['store']
    },
    build: {},
    experimental: {
        inlineSSRStyles: false
    }
});
//# sourceMappingURL=nuxt.config.js.map