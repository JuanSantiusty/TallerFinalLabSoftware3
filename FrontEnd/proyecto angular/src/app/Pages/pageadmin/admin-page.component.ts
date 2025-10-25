import { Component } from '@angular/core';
import { HeaderAdminComponent } from '../../header-admin/header-admin.component';
import { FooterComponent } from '../../footer/footer.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [HeaderAdminComponent, FooterComponent, RouterOutlet],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent {

}
