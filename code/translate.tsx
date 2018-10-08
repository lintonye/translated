const yandexTranslate = async ({ text, toLang, fromLang, apiKey }) => {
  const url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${apiKey}&text=${text}&lang=${fromLang}-${toLang}`;
  return await (await fetch(url, { method: "GET" })).json();
};

const cache = {};

const delay = millis =>
  new Promise((resolve, reject) => {
    setTimeout(resolve, millis);
  });

export const translate = async ({
  apiKey,
  text,
  fromLang = "en",
  toLang = "zh"
}) => {
  // don't translate numbers
  if (/^\d+$/.test(text)) return text;

  const langKey = `${fromLang}-${toLang}`;
  const translation =
    (cache[langKey] && cache[langKey][text]) ||
    (await yandexTranslate({ text, toLang, fromLang, apiKey })).text[0];

  cache[langKey] = { ...cache[langKey], [text]: translation };

  return translation;
};
