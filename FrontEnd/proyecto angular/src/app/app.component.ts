import { Component } from '@angular/core';
import { AdminPageComponent } from './Pages/pageadmin/admin-page.component';
import { ClientPageComponent } from './Pages/pageclient/client-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AdminPageComponent,ClientPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'primerProyecto';
}

