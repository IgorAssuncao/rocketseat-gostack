export default {
  host: process.env.NODE_ENV !== undefined ? 'redis' : '0.0.0.0',
  port: '6379'
}
