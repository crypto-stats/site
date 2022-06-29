const path = require('path')
const { withPlausibleProxy } = require('next-plausible')

let config = {
  webpack: (config, { isServer }) => {
    return {
      ...config,

      experiments: {
        ...config.experiments,
        topLevelAwait: true,
      },

      resolve: {
        ...config.resolve,
        fallback: {
          ...config.resolve.fallback,
          module: false,
        },

        alias: isServer
          ? config.resolve.alias
          : {
              ...config.resolve.alias,
              fs: path.resolve(__dirname, 'alias/fs'),
              'fs-extra': path.resolve(__dirname, 'alias/fs-extra'),
            },
      },

      module: {
        ...config.module,
        noParse: [require.resolve('typescript/lib/typescript.js')],
      },
    }
  },
}

config = withPlausibleProxy({
  customDomain: 'https://analytics.cryptostats.community',
})(config)

module.exports = config
