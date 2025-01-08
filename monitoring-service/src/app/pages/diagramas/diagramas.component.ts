import { Component, OnInit } from '@angular/core';
import { Chart, registerables, Title } from 'chart.js';
import { DbConexionService } from '../../service/db-conexion.service';
import ApexCharts from 'apexcharts';
import { ApexOptions } from 'apexcharts'; 
@Component({
  selector: 'app-diagramas',
  templateUrl: './diagramas.component.html',
  styleUrls: ['./diagramas.component.css'],
})
export class DiagramasComponent implements OnInit {
  
  constructor(private DbConexionService: DbConexionService) {
  }
  
  ngOnInit(): void {

    //grafica 1
    this.DbConexionService.getDistribucionRazas().subscribe(data => {
      const razasDR = data.map(item => item.raza);
      const cantidadesDR = data.map(item => parseInt(item.cantidad, 10));
    
      const options = {
        chart: {
          id: 'distribucion-razas',
          type: 'area',
          height: 200,
          width:400,
          zoom: {
          enabled: false
        }
      },
      series: [{
        name: "cantidad",
        data: cantidadesDR
      }],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      title: {
        text: 'Disrubución de Razas',
        align: 'center'
      },
      labels: razasDR,
      yaxis: {
        opposite: true
      },
      legend: {
        horizontalAlign: 'left'
      },
      
      };
    
      const chart = new ApexCharts(document.querySelector('#distribucion-razas'), options);
      chart.render();
    });
    
    //grafica 2
    this.DbConexionService.getAnimalesActivosInactivos().subscribe(data => {
      const actInac = data.map(item => item.activo ? 'Activos' : 'Inactivos');
      const cantidadesInac = data.map(item => parseInt(item.cantidad, 10)); 
    
      const options = {
        chart: {
          id: 'activo-inactivo',
          type: 'donut',
          height: 320,
          width: 320
        },
        series: cantidadesInac,
        labels: actInac,
        title: {
          text: 'Activos e Inactivos',
          align: 'center'
        }
      };
    
      const chart = new ApexCharts(document.querySelector('#activo-inactivo'), options);
      chart.render();
    });
    
    //grafica 3
    this.DbConexionService.getEvolucionPesoPorAnimal().subscribe(data => {

  // Extraemos las fechas (solo la parte de la fecha, sin la hora)
  const fechasPA = data.map(item => item.fecha_medicion.split('T')[0]); 
  // Extraemos los pesos
  const pesosPA = data.map(item => item.peso); 
  // Extraemos los animal_id (para mostrar el cuy correspondiente)
  const animalIds = data.map(item => item.animal_id);

  const options: ApexOptions = {
    chart: {
      id: 'evolucion-peso',
      type: 'line',
      height: 410,
      width: 490
    },
    series: [
      {
        name: 'Peso',
        data: pesosPA  // Los datos del peso en el eje Y
      }
    ],
    xaxis: {
      categories: fechasPA,  // Las fechas como categorías en el eje X
      title: {
        text: 'Fecha de Medición'
      },
      tickAmount: 6, // Opcional: para controlar el número de ticks visibles en el eje X
    },
    yaxis: {
      title: {
        text: 'Peso (Kg)'
      }
    },
    title: {
      text: 'Evolución de Peso por Animal',
      align: 'left'
    },
    tooltip: {
      custom: function({ seriesIndex, dataPointIndex, w }: { seriesIndex: number; dataPointIndex: number; w: any }) {
        const fecha = fechasPA[dataPointIndex];
        const peso = w.globals.series[seriesIndex][dataPointIndex]; 
        const animalId = animalIds[dataPointIndex];

        return `<div class="arrow_box">
                  <strong>Peso:</strong> ${peso} Kg<br>
                  <strong>Cuy (ID):</strong> ${animalId}
                </div>`;
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          height: 300  
        },
        xaxis: {
          labels: {
            rotate: -45 
          }
        }
      }
    }]
  };

  const chart = new ApexCharts(document.querySelector('#evolucion-peso'), options);
  chart.render();
    });

    
    //grafica 4
    this.DbConexionService.getEventosPorTipo().subscribe(data => {
      const tiposEv = data.map(item => item.tipo_evento);
      const cantidadesEv = data.map(item => parseInt(item.cantidad, 10));
    
      const  options = {
        series: cantidadesEv,
        chart: {
        height: 390,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: '30%',
            background: 'transparent',
            image: undefined,
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              show: false,
            }
          },
          barLabels: {
            enabled: true,
            useSeriesColors: true,
            offsetX: -8,
            fontSize: '16px',
            formatter: function (_: unknown, opts: { seriesIndex: number }) {
              const index = opts.seriesIndex;
              return tiposEv[index] + ": " + cantidadesEv[index];
            }
          },
        }
      },
      colors: ['#1ab7ea', '#0084ff', '#39539E', '#0077B5'],
      labels: tiposEv,
      responsive: [{
        breakpoint: 480,
        options: {
          legend: {
              show: false
          }
        }
      }]
      };

      const chart = new ApexCharts(document.querySelector('#eventos-tipo'), options);
      chart.render();
    });

    //grafica 5
    this.DbConexionService.getMedicionesPorAnimal().subscribe(data => {
      const labelsA = data.map(item => `Animal ${item.animal_id}`); 
      const cantidadesMA = data.map(item => parseInt(item.cantidad, 10));
    
      const options = {
        chart: {
          id: 'cantidad-por-animal',
          type: 'line', // Usamos un gráfico de líneas
          height: 200,
          width: 900
        },
        series: [
          {
            name: 'Cantidad',
            data: cantidadesMA // Usamos las cantidades de los animales
          }
        ],
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth' // Líneas suaves
        },
        xaxis: {
          categories: labelsA,  // Los animal_id como categorías en el eje X
          title: {
            text: 'Animal ID'
          }
        },
        tooltip: {
          x: {
            format: 'dd/MM/yy'  // El formato para el tooltip
          }
        },
        title: {
          text: 'Cantidad por Animal',
          align: 'center'
        }
      };
      const chart = new ApexCharts(document.querySelector('#mediciones-animal'), options);
      chart.render();
    });
  
    //grafica 6
    this.DbConexionService.getAnimalesPorMesAnio().subscribe(data => {
      const labelsxMA = data.map(item => item.mes_anio); // Extraer meses
      const cantidadesxMA = data.map(item => parseInt(item.cantidad, 10)); // Extraer cantidades
    
      const options = {
        chart: {
          id: 'animales-mes',
          type: 'line',
          height: 200,
          width: 800
        },
        series: [
          {
            name: 'Cantidad de Animales',
            data: cantidadesxMA
          }
        ],
        xaxis: {
          categories: labelsxMA,
          title: {
            text: 'Mes'
          }
        },
        title: {
          text: 'Animales por Mes',
          align: 'center'
        }
      };
    
      const chart = new ApexCharts(document.querySelector('#animales-mes'), options);
      chart.render();
    });

    //grafica 7
    this.DbConexionService.getPromedioPesoPorRaza().subscribe(data => {
      const razasPR = data.map(item => item.raza);
      const pesosPromedioPR = data.map(item => item.peso_promedio);
    
      // Dado que solo tienes un valor para cada raza, lo manejamos como una sola serie de datos
      const options = {
        chart: {
          id: 'promedio-peso',
          type: 'line',
          height: 200,
          width: 400
        },
        series: [
          {
            name: 'Peso Promedio',
            data: pesosPromedioPR // Usamos los pesos promedio para cada raza
          }
        ],
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        xaxis: {
          categories: razasPR, // Usamos las razas como categorías en el eje X
          title: {
            text: 'Raza'
          }
        },
        tooltip: {
          x: {
            format: 'dd/MM/yy'
          }
        },
        title: {
          text: 'Promedio de Peso por Raza',
          align: 'left'
        }
      };
    
      const chart = new ApexCharts(document.querySelector('#promedio-peso'), options);
      chart.render();
    });
    
    //grafica 8
    this.DbConexionService.getRelacionPesoFecha().subscribe(data => {
      const fechasRPF = data.map(item => new Date(item.fecha_medicion).toLocaleDateString());
      const pesosRPF = data.map(item => item.peso);
    
      const options = {
        chart: {
          id: 'grafica-relacion-peso-fecha',
          type: 'bar',
          height: 450,
          width: 400
        },
        series: [
          {
            name: 'Peso',
            data: pesosRPF
          }
        ],
        plotOptions: {
          bar: {
            borderRadius: 4,
            borderRadiusApplication: 'end',
            horizontal: true,
          }
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          categories: fechasRPF,
          title: {
            text: 'Fecha de Medición'
          }
        },
        title: {
          text: 'Relación Peso-Fecha',
          align: 'center'
        }
      };
    
      const chart = new ApexCharts(document.querySelector('#relacion-peso'), options);
      chart.render();
    });
    
    }

  }