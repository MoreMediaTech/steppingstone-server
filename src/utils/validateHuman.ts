const axios = require("axios").default;

export async function validateHuman(token: string) {
  const secret = process.env.RECAPTCHA_SITE_KEY;
  const {data }= await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`
  );

  return data.success;
}
