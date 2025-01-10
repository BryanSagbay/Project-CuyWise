import { Component, OnInit } from '@angular/core';
import { Chart, Colors, Legend, registerables, Title } from 'chart.js';
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
    
      const options: ApexOptions = {
        chart: {
            id: 'distribucion-razas',
            type: 'area',
            height: '100%', // Se ajusta al contenedor de la tarjeta
            width: '100%',
            zoom: {
                enabled: false,
            },
        },
        fill: {
          colors: ['#aed6f1'],
        },
        series: [{
            name: "Cantidad",
            data: cantidadesDR,
        }],
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'smooth',
        },
        title: {
            text: 'Distribución de Razas',
            align: 'center',
        },
        labels: razasDR,
        xaxis: {
          labels: {
            show: false,
          }
        },
        yaxis: {
          labels: {
            show: false,
          },
        },
        grid:{
          show: false, 
        },
        responsive: [{
            breakpoint: 768,
            options: {
                chart: {
                    height: 250,
                },
            },
        }],
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
          height: '100%',
          width: '100%',
        },
        series: cantidadesInac,
        labels: actInac,
        title: {
          text: 'Activos e Inactivos',
          align: 'center'
        },
        legend:{
          show: false,
        },
        responsive: [{
          breakpoint: 768,
          options: {
              chart: {
                  height: 250,
              },
          },
      }],  
      };
    
      const chart = new ApexCharts(document.querySelector('#activo-inactivo'), options);
      chart.render();
    });
    
    //grafica 3
    this.DbConexionService.getEvolucionPesoPorAnimal().subscribe(data => {
      const fechasPA = data.map(item => item.fecha_medicion.split('T')[0]); 
      const pesosPA = data.map(item => item.peso); 
      const animalIds = data.map(item => item.animal_id);
      
      const options: ApexOptions = {
        chart: {
          id: 'evolucion-peso',
          type: 'line',
          height: '100%',
          width: '100%',
          zoom: {
            enabled: false,
          },
        },
        series: [
          {
            name: 'Peso',
            data: pesosPA  
          }
        ],
        xaxis: {
          categories: fechasPA,
          title: {
           //text: 'Fecha de Medición'
          },
          tickAmount: 6,
          labels:{
            show: false,
          },
          axisBorder: {
            show: false,
          },
          },
          yaxis: {
            title: {
              //text: 'Peso (Kg)'
            },
            labels:{
              show: false,
            },
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
          grid:{
            show: false,
          },
          responsive: [{
            breakpoint: 768,
            options: {
              chart: {
                height: 250,  
              },
              xaxis: {
                labels: {
                  rotate: -45,
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
        height: '100%',
        width: '100%',
        zoom:{
          enable: false,
        },
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
      title:{
        text: 'Eventos por Tipo',
      },
      responsive: [{
        breakpoint: 768,
        options: {
          legend: {
              show: false
          },
          chart: {
            height: 250,
          },
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
          type: 'line',
          height: '100%',
          width: '100%',
          zoom:{
            enable: false,
          },
        },
        series: [
          {
            name: 'Cantidad',
            data: cantidadesMA 
          }
        ],
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth' 
        },
        xaxis: {
          categories: labelsA,  
          title: {
            //text: 'Animal ID'
          },
          labels:{
            show: false,
          },
          axisBorder:{
            show: false,
          },
        },
        yaxis: {
          labels:{
            show: false,
          }
        },
        grid:{
          show: false,
        },
        tooltip: {
          x: {
            format: 'dd/MM/yy'  
          }
        },
        title: {
          text: 'Cantidad por Animal',
          align: 'center'
        },
        fill:{
          colors:['#3768d0'],
        },
        responsive: [{
          breakpoint: 768,
          options: {
              chart: {
                  height: 250,
              },
          },
      }],
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
          height: '100%',
          width: '100%',
          zoom:{
              enabled: false,
          }
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
            //text: 'Mes'
          },
          labels:{
            show: false,
          },
          axisBorder: {
            show: false,
          }
        },
        yaxis:{
          labels:{
            show: false,
          }
        },
        grid:{
          show: false,
        },
        fill:{
          colors:['#3768d0']
        },
        title: {
          text: 'Animales por Mes',
          align: 'center'
        },
        responsive: [{
          breakpoint: 768,
          options: {
              chart: {
                height: 250, 
              },
          },
      }],
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
          height: '100%',
          width: '100%',
          zoom:{
            enabled: false,
          }
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
          labels:{
            show: false,
          },
          categories: razasPR, 
          title: {
            //text: 'Raza'
          },
          axisBorder: {
            show: false // Oculta la línea del borde del eje X
          },
        },
        yaxis:{
          show: false,
        },
        grid:{
          show: false,
        },
        fill:{
          colors:['#76d7c4'],
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
              height: '100%',
              width: '100%'
          },
          series: [{
              name: 'Peso',
              data: pesosRPF
          }],
          plotOptions: {
              bar: {
                  borderRadius: 10,
                  borderRadiusApplication: 'end',
                  horizontal: true,
              }
          },
          dataLabels: {
              enabled: false
          },
          xaxis: {
              categories: fechasRPF,
              labels:{
                  show: false,
              },
              axisBorder: {
                  show: false // Oculta la línea del borde del eje X
              },
              axisTicks: {
                  show: false // Oculta las marcas del eje X
              }
          },
          yaxis:{
              labels:{
                  show: false
              },
              axisBorder: {
                  show: false // Oculta la línea del borde del eje Y si es necesario
              },
              axisTicks: {
                  show: false // Oculta las marcas del eje Y si es necesario
              }
          },
          grid:{
              show: false, // Asegúrate de que la cuadrícula esté oculta
          },
          title: {
              text: 'Relación Peso-Fecha',
              align: 'center'
          },
          fill:{
            colors:['#5dade2'],
          },
          responsive: [{
              breakpoint: 768,
              options: {
                  chart: {
                      height: 250,
                  },
              },
          }],
      };
  
      const chart = new ApexCharts(document.querySelector('#relacion-peso'), options);
      chart.render();
    });  
    
    }

  }