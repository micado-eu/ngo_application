// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js

module.exports = function (ctx) {
  return {
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://quasar.dev/quasar-cli/cli-documentation/boot-files
    boot: [
      'envvar',
      'i18n',
      'auth',
      'axios',
      'featureflag',
      'loadData',
      'countly',
      'mermaid'
    ],

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-css
    css: [
      'app.css'
    ],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      // 'mdi-v4',
      // 'fontawesome-v5',
      // 'eva-icons',
      // 'themify',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      //'roboto-font', // optional, you are not bound to it
      'material-icons' // optional, you are not bound to it
    ],

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-framework
    framework: {
      // iconSet: 'ionicons-v4', // Quasar icon set
      // lang: 'de', // Quasar language pack

      // Possible values for "all":
      // * 'auto' - Auto-import needed Quasar components & directives
      //            (slightly higher compile time; next to minimum bundle size; most convenient)
      // * false  - Manually specify what to import
      //            (fastest compile time; minimum bundle size; most tedious)
      // * true   - Import everything from Quasar
      //            (not treeshaking Quasar; biggest bundle size; convenient)
      all: 'auto',

      components: [
        'QChatMessage'],
      directives: [],
      config: {
        brand: {
          primary: '#efefef',
          secondary: '#0b91ce',
          accent: '#0f3a5d',

          dark: '#0d0d0d',

          positive: '#21BA45',
          negative: '#C10015',
          info: '#ff7c44',
          warning: '#F2C037'
        }
      },

      // Quasar plugins
      plugins: ['Cookies', 'Notify']
    },

    // https://quasar.dev/quasar-cli/cli-documentation/supporting-ie
    supportIE: true,

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-build
    build: {
      scopeHoisting: true,
      vueRouterMode: 'history',
      env: {
        APP_BUILD_DATE: Date.now()
      },
      transpile: true,
      transpileDependencies: ['@vuex-orm/plugin-axios', 'fuse.js'],
      // showProgress: false,
      // gzip: true,
      // analyze: true,
      // preloadChunks: false,
      // extractCSS: false,

      // https://quasar.dev/quasar-cli/cli-documentation/handling-webpack
      extendWebpack (cfg) {
      },
      chainWebpack (chain, { isServer, isClient }) {
        chain.resolve.alias.set('api-chatbot-client', 'src/api/chatbot/mock');
        chain.resolve.alias.set('api-documents-client', 'src/api/documents/server');
        chain.resolve.alias.set('api-document_type-client', 'src/api/document_type/server');
        chain.resolve.alias.set('api-information-client', 'src/api/information/server');
        chain.resolve.alias.set('api-information_category-client', 'src/api/information_category/server');
        chain.resolve.alias.set('api-event-client', 'src/api/event/server');
        chain.resolve.alias.set('api-event_category-client', 'src/api/event_category/server');
        chain.resolve.alias.set('api-user-client', 'src/api/user/server');
        chain.resolve.alias.set('api-features-client', 'src/api/features/server');
        chain.resolve.alias.set('api-flows-client', 'src/api/flows/server');
        chain.resolve.alias.set('api-glossary-client', 'src/api/glossary/server');
        chain.resolve.alias.set('api-language-client', 'src/api/language/server');
        chain.resolve.alias.set('api-settings-client', 'src/api/settings/server');
        chain.resolve.alias.set('api-interventions-client', 'src/api/interventions/server');
        chain.resolve.alias.set('api-comments-client', 'src/api/comments/server');
        chain.resolve.alias.set('api-topic-client', 'src/api/topic/server');
        chain.resolve.alias.set('api-tenant-client', 'src/api/tenant/server');
        chain.resolve.alias.set('api-user_type-client', 'src/api/user_type/server');
        chain.resolve.alias.set('api-images-client', 'src/api/images/server')
      }
    },

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-devServer
    devServer: {
      // https: true,
      // port: 8080,
      open: true // opens browser window automatically
    },

    // animations: 'all', // --- includes all animations
    // https://quasar.dev/options/animations
    animations: [],

    // https://quasar.dev/quasar-cli/developing-ssr/configuring-ssr
    ssr: {
      pwa: false
    },

    // https://quasar.dev/quasar-cli/developing-pwa/configuring-pwa
    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {}, // only for NON InjectManifest
      manifest: {
        // name: 'Micado app',
        // short_name: 'Micado app',
        // description: 'Migrant application',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },

    // https://quasar.dev/quasar-cli/developing-cordova-apps/configuring-cordova
    cordova: {
      // id: 'org.cordova.quasar.app',
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    // https://quasar.dev/quasar-cli/developing-electron-apps/configuring-electron
    electron: {
      // bundler: 'builder', // or 'packager'

      extendWebpack (cfg) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      },

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        // appId: 'micado'
      }
    }
  }
}
