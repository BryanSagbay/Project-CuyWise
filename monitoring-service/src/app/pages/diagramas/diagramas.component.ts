import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DbConexionService } from '../../service/db-conexion.service';

@Component({
  selector: 'app-diagramas',
  templateUrl: './diagramas.component.html',
  styleUrls: ['./diagramas.component.css'],
})
export class DiagramasComponent implements OnInit {
  chart: any;
  activosChart: any;
  evolucionPesoChart: any;
  eventosChart: any;
  medicionesChart: any;
  animalesMesChart: any;
  pesoFechaChart: any;
  promedioPesoRazaChart: any;

  constructor(private DbConexionService: DbConexionService) {
    Chart.register(...registerables); 
  }

  ngOnInit(): void {
    //datos grafica 1
    this.DbConexionService.getDistribucionRazas().subscribe(data => {
      const labels = data.map(item => item.raza); 
      console.log(labels);
      const cantidades = data.map(item => parseInt(item.cantidad, 10)); 
      console.log(cantidades);
      this.createChart(labels, cantidades);
    });

    //datos grafica 2
    this.DbConexionService.getAnimalesActivosInactivos().subscribe(data => {
      const labels = data.map(item => item.activo ? 'Activos' : 'Inactivos');
      const cantidades = data.map(item => parseInt(item.cantidad, 10)); 

      this.createActivosChart(labels, cantidades);
    });

    //datos grafica 3
    this.DbConexionService.getEvolucionPesoPorAnimal().subscribe(data => {
      const labels = data.map(item => item.fecha_medicion.split('T')[0]); 
      const pesos = data.map(item => item.peso); 
  
      this.createEvolucionPesoChart(labels, pesos); 
      });

   // datos gráfica 4
  this.DbConexionService.getEventosPorTipo().subscribe(data => {
    const labels = data.map(item => item.tipo_evento); 
    const cantidades = data.map(item => parseInt(item.cantidad, 10)); 

    this.createEventosChart(labels, cantidades); 
  });

  // datos gráfica 5
  this.DbConexionService.getMedicionesPorAnimal().subscribe(data => {
    const labels = data.map(item => `Animal ${item.animal_id}`); 
    const cantidades = data.map(item => parseInt(item.cantidad, 10));

    this.createMedicionesChart(labels, cantidades); 
  });

  // datos grafica 6
  this.DbConexionService.getAnimalesPorMesAnio().subscribe(data => {
    const labels = data.map(item => item.mes_anio);
    const cantidades = data.map(item => parseInt(item.cantidad, 10)); 

    this.createAnimalesMesChart(labels, cantidades); 
  });

   // Datos gráfica 7
  this.DbConexionService.getRelacionPesoFecha().subscribe(data => {
    const fechas = data.map(item => new Date(item.fecha_medicion).toLocaleDateString());
    const pesos = data.map(item => item.peso); 

    this.createPesoFechaChart(fechas, pesos); 
  });

  // Datos gráfica 8
  this.DbConexionService.getPromedioPesoPorRaza().subscribe(data => {
    const razas = data.map(item => item.raza); 
    const pesosPromedio = data.map(item => item.peso_promedio); 

    this.createPromedioPesoRazaChart(razas, pesosPromedio); 
  });

  }

  //grafica 1
  createChart(labels: string[], data: number[]): void {
    const ctx = document.getElementById('Raza') as HTMLCanvasElement;

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label:'Razas',
          data: data,
          backgroundColor: [
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  //grafica 2
  createActivosChart(labels: string[], data: number[]): void {
    const ctx = document.getElementById('activosChart') as HTMLCanvasElement;

    this.activosChart = new Chart(ctx, {
      type: 'bar', // Gráfico tipo pastel
      data: {
        labels: labels,
        datasets: [{
          label: 'Distribución de Activos e Inactivos',
          data: data,
          backgroundColor: [
            'rgba(54, 162, 235, 0.2)', // Color para "Activos"
            'rgba(255, 99, 132, 0.2)'  // Color para "Inactivos"
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          }
        }
      }
    });
  }
  
  // grafica 3
  createEvolucionPesoChart(labels: string[], data: number[]): void {
    const ctx = document.getElementById('evolucionPesoChart') as HTMLCanvasElement;
    
    this.evolucionPesoChart = new Chart(ctx, {
      type: 'line', // Tipo línea
      data: {
        labels: labels,
        datasets: [{
          label: 'Evolción de Pesos',
          data: data,
          backgroundColor: [
            'rgba(54, 162, 235, 0.2)', // Color para "Activos"
            'rgba(255, 99, 132, 0.2)'  // Color para "Inactivos"
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1
        }]
      },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' // Posición de la leyenda
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Peso (kg)' // Etiqueta del eje Y
          }
        },
        x: {
          title: {
            display: true,
            text: 'Fecha' // Etiqueta del eje X
          }
        }
      }
    }
  });
}

  // grafica 4
  createEventosChart(labels: string[], data: number[]): void {
    const ctx = document.getElementById('eventosChart') as HTMLCanvasElement;

    this.eventosChart = new Chart(ctx, {
      type: 'doughnut', // Gráfico tipo dona
      data: {
        labels: labels,
        datasets: [{
          label: 'Cantidad de Eventos por Tipo',
          data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)', // Color para "Registro"
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(context: any) {
                return `${context.label}: ${context.raw} evento(s)`;
              }
            }
          }
        }
      }
    });
  }

  // gradica 5
  createMedicionesChart(labels: string[], data: number[]): void {
    const ctx = document.getElementById('medicionesChart') as HTMLCanvasElement;

    this.medicionesChart = new Chart(ctx, {
      type: 'bar', // Gráfico de barras
      data: {
        labels: labels,
        datasets: [{
          label: 'Mediciones por Animal',
          data: data,
          backgroundColor: [
            'rgba(75, 192, 192, 0.2)', 
            'rgba(153, 102, 255, 0.2)' 
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(context: any) {
                return `${context.label}: ${context.raw} medición(es)`;
              }
            }
          }
        }
      }
    });
  }

  // grafica 6
  createAnimalesMesChart(labels: string[], data: number[]): void {
    const ctx = document.getElementById('animalesMesChart') as HTMLCanvasElement;

    this.animalesMesChart = new Chart(ctx, {
      type: 'line', // Gráfico de líneas
      data: {
        labels: labels,
        datasets: [{
          label: 'Animales por Mes',
          data: data,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true, // Relleno bajo la línea
          tension: 0.4 // Curvatura de la línea
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Mes'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Cantidad de Animales'
            }
          }
        },
        plugins: {
          legend: {
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: function(context: any) {
                return `${context.label}: ${context.raw} animal(es)`;
              }
            }
          }
        }
      }
    });
  }

  // grafica 7
  createPesoFechaChart(labels: string[], data: number[]): void {
    const ctx = document.getElementById('pesoFechaChart') as HTMLCanvasElement;

    this.pesoFechaChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Peso vs Fecha',
          data: data,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Fecha de Medición'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Peso'
            }
          }
        },
        plugins: {
          legend: {
            position: 'top'
          }
        }
      }
    });
  }

  // Gráfica 8
  createPromedioPesoRazaChart(labels: string[], data: number[]): void {
    const ctx = document.getElementById('promedioPesoRazaChart') as HTMLCanvasElement;

    this.promedioPesoRazaChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: 'Promedio de Peso por Raza',
          data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)' 
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Peso Promedio'
            }
          }
        },
        plugins: {
          legend: {
            position: 'top'
          }
        }
      }
    });
  }

}
