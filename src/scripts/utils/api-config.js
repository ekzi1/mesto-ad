export const apiSettings = {
  baseUrl: `https://mesto.nomoreparties.co/v1/${process.env.MESTO_COHORT}`,
  headers: {
    authorization: process.env.MESTO_TOKEN,
    "Content-Type": "application/json",
  },
};
