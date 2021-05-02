const path = require('path')

module.exports = {
  future: {
    webpack5: true,
    strictPostcssConfiguration: true,
  },

  webpack(config) {
    config.resolve.alias['client'] = path.resolve(__dirname, 'client')
    config.resolve.alias['store'] = path.resolve(__dirname, 'src/store')

    return config
  },
}
