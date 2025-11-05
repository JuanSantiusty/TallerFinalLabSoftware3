import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  public proyecto = { anio: '2024', nombreProyecto: 'Luxury Barber' };
  public tecnologia = { leyenda: 'WebApp desarrollada con ', tec1: 'Angular ', tec2: 'Spring Boot' };
  public autor = 'Desarrollado por Tu Nombre Aquí';
  
}
