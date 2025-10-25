import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../../header/header.component";
import { FooterComponent } from '../../footer/footer.component';
import { CatalogoComponent } from '../../catalogo/catalogo.component';

@Component({
  selector: 'app-client-page',
  standalone: true,
  imports: [HeaderComponent, FooterComponent,CatalogoComponent],
  templateUrl: './client-page.component.html',
  styleUrl: './client-page.component.css'
})
export class ClientPageComponent {

}
