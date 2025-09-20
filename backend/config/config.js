module.exports = {
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET
  },
  database: {
    uri: process.env.MONGODB_URI
  },
  server: {
    port: process.env.PORT || 5000,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000'
  },
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'application/pdf']
  }
};