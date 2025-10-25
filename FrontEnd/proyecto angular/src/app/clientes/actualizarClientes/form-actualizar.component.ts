import { Component } from '@angular/core';
import { Cliente } from '../modelos/cliente';
import { ClienteService } from '../servicios/cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Categoria } from '../../categorias/modelos/categoria';
import { CommonModule } from '@angular/common';
import { categoriaService } from '../../categorias/servicios/categoria.service';

@Component({
  selector: 'app-form-actualizar',
  standalone: true,
  imports: [FormsModule,CommonModule, SweetAlert2Module, HttpClientModule],
  templateUrl: './form-actualizar.component.html',
  styleUrl: './form-actualizar.component.css'
})
export class FormActualizarComponent {
  public cliente: Cliente = new Cliente();
  public categorias: Categoria[] = [];
  public titulo: String = 'Actualizar cliente';

  constructor(
    private categoriaService: categoriaService, 
    private clienteService: ClienteService, 
    private router:Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    const clienteId = this.route.snapshot.paramMap.get('id');
  
    this.categoriaService.getCategorias().subscribe(categorias => {
      this.categorias = categorias;
  
      if (clienteId) {
        this.clienteService.getClienteById(+clienteId).subscribe(cliente => {
          // Reasignar la categoría del cliente con la misma instancia del arreglo
          this.cliente = cliente;
          if (cliente.objCategoria !== null && cliente.objCategoria !== undefined) {
            this.cliente.objCategoria = this.categorias.find(cat => cat.id === cliente.objCategoria?.id) || null;
          }
        });
      }
    });
  }
  

  public actualizarCliente(): void {
    console.log("Actualizando cliente", this.cliente);
    this.clienteService.update(this.cliente).subscribe(
      response => {
        console.log("Cliente actualizado exitosamente");
        this.router.navigate(['clientes/listarCLientes']);
        Swal.fire('Cliente actualizado', `Cliente ${response.nombre} actualizado con éxito!`, 'success');
      },
      error => {
        console.error('Error al actualizar el cliente:', error);       
      }
    );
  }

}
