const { withPlausibleProxy } = require('next-plausible')

let config = {
  webpack: config => {
    return {
      ...config,

      experiments: { topLevelAwait: true },

      resolve: {
        ...config.resolve,
        fallback: {
          ...config.resolve.fallback,
          fs: false,
          module: false,
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
