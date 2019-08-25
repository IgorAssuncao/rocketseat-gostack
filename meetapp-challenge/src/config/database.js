module.exports = {
  dialect: 'postgres',
  host: process.env.NODE_ENV !== undefined ? 'postgres' : '0.0.0.0',
  port: 5432,
  username: 'postgres',
  password: 'docker',
  database: 'meetapp',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
