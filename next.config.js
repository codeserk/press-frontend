const path = require('path')

module.exports = {
  future: {
    webpack5: true,
    strictPostcssConfiguration: true,
  },

  webpack(config) {
    config.resolve.alias['client'] = path.resolve(__dirname, 'client')
    return config
  },
}
