export default () => ({
  port: process.env.PORT,
  database: {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_POST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    name: process.env.POSTGRES_DATABASE,
  },
  youtubeApiKeys: process.env.YOUTUBE_API_KEYS,
});
