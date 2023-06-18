const CurrencyOption = [
  {
    locale: "de-DE",
    currency: "EUR",
  },
  {
    locale: "en-US",
    currency: "USD",
  },
  {
    locale: "en-GB",
    currency: "GBP",
  },
  {
    locale: "ja-JP",
    currency: "JPY",
  },
  {
    locale: "en-IN",
    currency: "INR",
  },
  {
    locale: "vi-VN",
    currency: "VND",
  },
];

function formatMoney(value: number, currency: string) {
  if (!value || !currency) return;

  let locale = "vi-VN";
  const findCurrency = CurrencyOption.find((ele) => ele.currency === currency);

  if (findCurrency) {
    locale = findCurrency.locale;
  }

  const formattedValue = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);

  return formattedValue;
}

export { formatMoney };
