const env = process.env;
const config = {
  database: {
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    port: env.DB_PORT
  }
};
  
module.exports = config;