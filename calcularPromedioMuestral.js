const listaPrecios = require("./precios.json");

let total = 0;
let cant = 0;

listaPrecios.forEach((precio) => {
  total += precio;
  cant++;
});

console.log(total / cant);
