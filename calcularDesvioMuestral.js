const listaPrecios = require("./precios.json");
const promedioMuestral = 85.42145050244415;
const n = 912;
sumatoria = 0;

listaPrecios.forEach((precio) => {
  sumatoria += (precio - promedioMuestral) ** 2;
});

console.log(((1 / (n - 1)) * sumatoria) ** (1 / 2));
