import { Component } from '@angular/core';
import { Cliente } from '../modelos/cliente';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ClienteService } from '../servicios/cliente.service';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule,RouterLink,HttpClientModule,SweetAlert2Module],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent {

  clientes: Cliente[]=[];

  constructor(private objClienteService: ClienteService,private router: Router) {}
    
    ngOnInit(): void{
      this.objClienteService.getClientes().subscribe
      (
      clientes => {
        console.log("listando clientes");
        this.clientes = clientes;
      }
      );
    }

    editarCliente(id: number): void {
      this.router.navigate(['/clientes/actualizar', id]);
    }

    eliminarCliente(id: number): void {
      Swal.fire({
        title: '¿Desea eliminar el cliente?',
        text: "La eliminación no se puede revertir",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.objClienteService.deleteCliente(id).subscribe(() => {
            this.clientes = this.clientes.filter(cliente => cliente.id !== id);//actualizar la lista
            Swal.fire(
              'Eliminado',
              'El cliente ha sido eliminado exitosamente',
              'success'
            );
          });
        }
        else{
          console.log("Eliminación cancelada");
        }
      });
}

      

}

