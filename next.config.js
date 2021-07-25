module.exports = {
  webpack: (config) => {
    return {
      ...config,
      module: {
        ...config.module,
        noParse: [require.resolve('typescript/lib/typescript.js')],
      },
    }
  },
}
