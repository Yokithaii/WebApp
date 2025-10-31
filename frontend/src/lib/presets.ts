export function buildQueries(quote: string, person?: string, date?: string){
  const q = `"${quote.trim()}"`; const who = person?`"${person.trim()}"`:"";
  const base = encodeURIComponent([q, who].filter(Boolean).join(" "));
  const yandex = `https://yandex.ru/search/?text=${base}`;
  const google = `https://www.google.com/search?q=${base}`;
  const newsRu = `https://yandex.ru/news/instant?text=${base}`;
  const telegram = `https://www.google.com/search?q=site%3At.me%20${base}`;
  const govRu = `https://www.google.com/search?q=site%3A*.gov.ru%20${base}`;
  const eduRu = `https://www.google.com/search?q=site%3A*.edu.ru%20${base}`;
  const interview = `https://www.google.com/search?q=${encodeURIComponent(`${who} интервью ${quote}`)}`;
  return [
    { label: "Яндекс (всё)", url: yandex },
    { label: "Google (всё)", url: google },
    { label: "Яндекс.Новости", url: newsRu },
    { label: "Telegram (t.me)", url: telegram },
    { label: "*.gov.ru", url: govRu },
    { label: "*.edu.ru", url: eduRu },
    { label: "Интервью/стенограммы", url: interview },
  ];
}
