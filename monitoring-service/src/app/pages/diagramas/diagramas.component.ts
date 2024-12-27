import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DbConexionService } from '../../service/db-conexion.service';

@Component({
  selector: 'app-diagramas',
  templateUrl: './diagramas.component.html',
  styleUrls: ['./diagramas.component.css'],
})
export class DiagramasComponent implements OnInit {
  // Gráficos
  @ViewChild('barChartRazas') barChartRazas!: ElementRef;
  @ViewChild('pieChartActivos') pieChartActivos!: ElementRef;
  @ViewChild('lineChartPeso') lineChartPeso!: ElementRef;
  @ViewChild('barChartEventos') barChartEventos!: ElementRef;
  @ViewChild('barChartMediciones') barChartMediciones!: ElementRef;
  @ViewChild('lineChartMes') lineChartMes!: ElementRef;
  @ViewChild('scatterChartPesoFecha') scatterChartPesoFecha!: ElementRef;
  @ViewChild('barChartPesoRaza') barChartPesoRaza!: ElementRef;
  

  constructor(private DbConexionService: DbConexionService) {
    Chart.register(...registerables);
  } 

  ngOnInit(): void {
    this.cargarGraficos();
  }

  cargarGraficos() {
    // Gráfico 1: Distribución de razas
    this.DbConexionService.getDistribucionRazas().subscribe(data => {
      const labels = data.map(item => item.raza);
      const values = data.map(item => item.cantidad);
      this.createBarChart(this.barChartRazas.nativeElement, labels, values, 'Distribución de Razas');
    });

    // Gráfico 2: Animales activos vs inactivos
    this.DbConexionService.getAnimalesActivosInactivos().subscribe(data => {
      const activos = data.filter(item => item.activo === true).length;
      const inactivos = data.filter(item => item.activo === false).length;
      this.createPieChart(this.pieChartActivos.nativeElement, ['Activos', 'Inactivos'], [activos, inactivos]);
    });

    // Gráfico 3: Evolución de peso por animal
    this.DbConexionService.getEvolucionPesoPorAnimal().subscribe(data => {
      const labels = data.map(item => item.fecha);
      const values = data.map(item => item.peso);
      this.createLineChart(this.lineChartPeso.nativeElement, labels, values, 'Evolución de Peso');
    });

    // Gráfico 4: Eventos por tipo
    this.DbConexionService.getEventosPorTipo().subscribe(data => {
      const labels = data.map(item => item.tipo);
      const values = data.map(item => item.cantidad);
      this.createBarChart(this.barChartEventos.nativeElement, labels, values, 'Eventos por Tipo');
    });

    // Gráfico 5: Mediciones por animal
    this.DbConexionService.getMedicionesPorAnimal().subscribe(data => {
      const labels = data.map(item => item.animal);
      const values = data.map(item => item.mediciones);
      this.createBarChart(this.barChartMediciones.nativeElement, labels, values, 'Mediciones por Animal');
    });

    // Gráfico 6: Animales por mes/año
    this.DbConexionService.getAnimalesPorMesAnio().subscribe(data => {
      const labels = data.map(item => `${item.mes}/${item.anio}`);
      const values = data.map(item => item.cantidad);
      this.createLineChart(this.lineChartMes.nativeElement, labels, values, 'Animales por Mes/Año');
    });

    // Gráfico 7: Relación peso vs fecha
    this.DbConexionService.getRelacionPesoFecha().subscribe(data => {
      const values = data.map(item => ({ x: item.fecha, y: item.peso }));
      this.createScatterChart(this.scatterChartPesoFecha.nativeElement, values, 'Peso vs Fecha');
    });

    // Gráfico 8: Promedio de peso por raza
    this.DbConexionService.getPromedioPesoPorRaza().subscribe(data => {
      const labels = data.map(item => item.raza);
      const values = data.map(item => item.promedio);
      this.createBarChart(this.barChartPesoRaza.nativeElement, labels, values, 'Promedio de Peso por Raza');
    });
  }

  createBarChart(canvas: HTMLCanvasElement, labels: string[], data: number[], label: string) {
    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: label,
          data: data,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
      }
    });
  }

  createPieChart(canvas: HTMLCanvasElement, labels: string[], data: number[]) {
    new Chart(canvas, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: ['#FF6384', '#36A2EB']
        }]
      },
      options: {
        responsive: true,
      }
    });
  }

  createLineChart(canvas: HTMLCanvasElement, labels: string[], data: number[], label: string) {
    new Chart(canvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: label,
          data: data,
          fill: false,
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
      }
    });
  }

  createScatterChart(canvas: HTMLCanvasElement, data: {x: any, y: any}[], label: string) {
    new Chart(canvas, {
      type: 'scatter',
      data: {
        datasets: [{
          label: label,
          data: data,
          backgroundColor: 'rgba(75, 192, 192, 1)',
          pointRadius: 5
        }]
      },
      options: {
        responsive: true,
      }
    });
  }
}
