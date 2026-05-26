/**
 * URL и заголовки подставляются из .env при сборке (см. webpack + dotenv).
 * Скопируйте .env.example в .env и укажите cohort и токен из личного кабинета Практикума.
 */
export const apiSettings = {
  baseUrl: `https://mesto.nomoreparties.co/v1/${process.env.MESTO_COHORT}`,
  headers: {
    authorization: process.env.MESTO_TOKEN,
    "Content-Type": "application/json",
  },
};
