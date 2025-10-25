import { Component } from '@angular/core';
import { Cliente } from '../modelos/cliente';
import { ClienteService } from '../servicios/cliente.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { HttpClientModule } from '@angular/common/http';
import { Categoria } from '../../categorias/modelos/categoria';
import { categoriaService } from '../../categorias/servicios/categoria.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [FormsModule, CommonModule, SweetAlert2Module, HttpClientModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {
  public cliente: Cliente = new Cliente();
  public categorias: Categoria[] = [];
  public titulo: String = 'Crear cliente';

  constructor(private categoriaService: categoriaService, private clienteService: ClienteService, private router:Router) { }

  ngOnInit(): void {
    this.cliente.objCategoria = null;
    this.categoriaService.getCategorias().subscribe(
      categorias => this.categorias = categorias      
    );    
  }

  public crearCliente()
  {
    console.log("Creando cliente");
    this.clienteService.create(this.cliente).subscribe(
     {
        next: (respose) => {
          console.log("Cliente creado exitosamente");
          console.log(this.cliente);
          this.router.navigate(['clientes/listarCLientes']),
          Swal.fire('Nuevo cliente',`Cliente ${respose.nombre} creado con éxito!`, 'success');
        },
        error: (err) => {
          console.error('Error al crear cliente:', err.message);         
        }
      }
    )
      
  }

}