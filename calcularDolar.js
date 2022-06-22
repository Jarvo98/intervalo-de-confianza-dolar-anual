const axios = require("axios");

axios.defaults.baseURL = "https://mercados.ambito.com";

const formatWithZero = (value) => (value > 9 ? value : `0${value}`);

const formatDate = (date) =>
  `${formatWithZero(date.getDate())}-${formatWithZero(
    date.getMonth() + 1
  )}-${date.getFullYear()}`;

const fetchDollarValue = async (date, dayBeforeDate) => {
  const response = await axios.get(
    `/dolar/informal/historico-general/${formatDate(
      dayBeforeDate
    )}/${formatDate(date)}`
  );

  return response.data;
};

const fetchAndParseDollarValue = async (date, dayBeforeDate) => {
  const [_, tableValues] = await fetchDollarValue(date, dayBeforeDate);

  if (tableValues) {
    const [unused, buyingPriceString, sellingPriceString] = tableValues;

    return (
      (Number(buyingPriceString.replace(",", ".")) +
        Number(sellingPriceString.replace(",", "."))) /
      2
    );
  } else {
    return 0;
  }
};

const calculateValueBasedOnDate = async (date) => {
  const dayBeforeDate = new Date(date.getTime() - 24 * 60 * 60 * 1000);

  return await fetchAndParseDollarValue(date, dayBeforeDate);
};

const getDollarToPesoValuesForBothDates = async (date, yearBeforeDate) => {
  const newerValue = await calculateValueBasedOnDate(date);
  const olderValue = await calculateValueBasedOnDate(yearBeforeDate);

  return {
    newerValue,
    olderValue,
  };
};

const calculateDollarToPesoValueYearByYear = async (date) => {
  const yearBeforeDate = new Date(date.getTime() - 365 * 24 * 60 * 60 * 1000);

  const { newerValue, olderValue } = await getDollarToPesoValuesForBothDates(
    date,
    yearBeforeDate
  );

  if (newerValue && olderValue) {
    return (newerValue * 100) / olderValue - 100;
  } else {
    return 0;
  }
};

const main = async () => {
  const yearCount = 4;

  for (let i = 0; i < yearCount * 365; i++) {
    const date = new Date(Date.now() - i * 86400000);
    const percentageIncrease = await calculateDollarToPesoValueYearByYear(date);

    if (percentageIncrease) {
      console.log(percentageIncrease);
    }
  }
};

main();
