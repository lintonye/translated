const yandexTranslate = async ({ text, toLang, fromLang, apiKey }) => {
  const url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${apiKey}&text=${text}&lang=${fromLang}-${toLang}`;
  return (await (await fetch(url, { method: "GET" })).json()).text[0];
};

const googleTranslate = async ({ text, toLang, fromLang, apiKey }) => {
  const url = `https://www.googleapis.com/language/translate/v2?key=${apiKey}&source=${fromLang}&target=${toLang}&q=${text}`;
  const json = await (await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  })).json();
  const translated = json.data.translations[0].translatedText;
  return translated;
};

const cache = {};

const delay = millis =>
  new Promise((resolve, reject) => {
    setTimeout(resolve, millis);
  });

export const translate = async ({
  apiKey,
  text,
  translationService,
  fromLang = "en",
  toLang = "zh"
}) => {
  // sanitize input
  const lanCodePattern = /^[\w]{2,4}$/;
  if (!lanCodePattern.test(fromLang) || !lanCodePattern.test(toLang))
    throw `Incorrect languages: ${fromLang}=>${toLang}`;

  // don't translate numbers
  if (/^\d+$/.test(text)) return text;

  let translateFun;
  switch (translationService) {
    case "yandex":
      translateFun = yandexTranslate;
      break;
    case "google":
      translateFun = googleTranslate;
      if (!!!apiKey) throw "Enter your Google Translate API Key.";
      break;
    default:
      throw `Invalid translation service ${translationService}`;
  }

  const langKey = `${translationService}:${fromLang}-${toLang}`;
  const translation =
    (cache[langKey] && cache[langKey][text]) ||
    (await translateFun({ text, toLang, fromLang, apiKey }));

  cache[langKey] = { ...cache[langKey], [text]: translation };

  return translation;
};
