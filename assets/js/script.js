import { obtenerTodosLosIndicadores, obtenerUltimosPorIndicador } from './querys.js';

const montoClp = document.getElementById('monto-clp');
const tipoMoneda = document.getElementById('tipo-moneda');
const btnConvertir = document.getElementById('btn-convertir');
const resultado = document.getElementById('resultado');
const graficaIndicador = document.getElementById('graficaMoneda');

// FUNCION QUE CARGA LOS TIPOS DE MONEDA EN EL SELECT
const cargarTiposMonedas = async () => {

  const indicadores = await obtenerTodosLosIndicadores();

  if (!indicadores) {
    return;
  }

  Object.values(indicadores)
  .slice(3)
  .forEach((indicador) => {
      tipoMoneda.innerHTML += `<option value="${indicador.codigo}">${indicador.nombre}</option>`;
  });
  
};

// FUNCION QUE ME DEVUELVE EL VALOR SEGUN TIPO DE MONEDA
const obtenerValorTipoMoneda = async (tipoMoneda) => {
  const data = await obtenerTodosLosIndicadores();

  if (!data) {
    return "false";
  }
  const { [tipoMoneda]: { valor } } = data;
  return valor;

};

// FUNCION QUE GENERA EL GRAFICO Y LO MUESTRA EN EL DOM
const renderizarGraficaIndicador = async () => {
  const dataTipoMoneda = await obtenerUltimosPorIndicador(tipoMoneda.value);

  if(!dataTipoMoneda) {
    return ;
  }

  const tipoDeGrafica = 'line';
  const titulo = `Gráfica ${tipoMoneda.value.toUpperCase()}`;
  const fechas = dataTipoMoneda.map((moneda) => moneda.fecha);
  const valores = dataTipoMoneda.map((moneda) => moneda.valor);
  
  const config = {
    type: tipoDeGrafica,
    data: {
      labels: fechas,
      datasets: [{
          label: titulo,
          borderColor: 'rgb(214, 40, 40)',
          backgroundColor: 'rgba(214, 40, 40, 0.5)',
          data: valores,
          }]
      }
    };

  new Chart(graficaIndicador, config);
 
};

// FUNCION QUE VALIDA EL INPUT
function validarInput(input) {
  let valor = parseFloat(input.value);

  if (Number.isInteger(valor) && valor > 0) {
    input.style.animation = "";
    return true;

  } else { 
    input.style.animation = "shake-horizontal 0.8s ease-out";
    return false;

  }
}

// EVENTO QUE AL HACER CLICK EN EL INPUT REMUEVE EL ERROR
montoClp.addEventListener('click', () => {
  montoClp.classList.remove('is-invalid');
  montoClp.style.animation = "";
});

// EVENTO QUE REALIZA LA CONVERSION AL PRESIONAR EL BOTON CONVERTIR
btnConvertir.addEventListener('click', async () => {
  if (validarInput(montoClp)) {
    const valorTipoMoneda = await obtenerValorTipoMoneda(tipoMoneda.value);

    if (valorTipoMoneda != "false") {
      resultado.innerHTML = 'Resultado: $ ' + (montoClp.value / valorTipoMoneda).toFixed(2);
      await renderizarGraficaIndicador();
    }
    montoClp.value = '';
    montoClp.focus();

  } else {
    montoClp.classList.add('is-invalid');
    montoClp.value = '';
  }
});

// INICIALIZO LA FUNCION QUE CARGA LOS TIPOS DE MONEDA EN EL SELECT
cargarTiposMonedas();
