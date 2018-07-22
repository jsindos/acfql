const settings = {
  'public': {
    'uploads': '',
    'amazonS3': false
  },
  'private': {
    'wp_prefix': 'wp_',
    'database': {
      'name': '',
      'username': '',
      'password': '',
      'host': '127.0.0.1'
    }
  }
}

const publicSettings = settings.public
const privateSettings = settings.private

module.exports.publicSettings = publicSettings
module.exports.privateSettings = privateSettings
