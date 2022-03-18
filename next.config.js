const { withPlausibleProxy } = require("next-plausible")

let config = {
  webpack: config => {
    return {
      ...config,
      module: {
        ...config.module,
        noParse: [require.resolve("typescript/lib/typescript.js")],
      },
    }
  },
}

config = withPlausibleProxy({
  customDomain: "https://analytics.cryptostats.community",
})(config)

module.exports = config
