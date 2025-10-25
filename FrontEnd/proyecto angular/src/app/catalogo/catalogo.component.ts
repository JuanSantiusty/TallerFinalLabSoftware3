import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Categoria } from '../categorias/modelos/categoria';
import { categoriaService } from '../categorias/servicios/categoria.service';
import { Cliente } from '../clientes/modelos/cliente';
import { ClienteService } from '../clientes/servicios/cliente.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [FormsModule,HttpClientModule,CommonModule],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css'
})
export class CatalogoComponent {
  public clientes: Cliente[] = [];
  public categorias: Categoria[] = [];
  public categoriaSeleccionada: string = '';

  constructor(private categoriaService: categoriaService, private clienteService: ClienteService, private objClienteService: ClienteService) { }

  ngOnInit(): void {
    this.categoriaSeleccionada = 'Todo';
    this.categoriaService.getCategorias().subscribe(
      categorias => this.categorias = categorias      
    );    
    this.filtrarClientes();
  }

   onCategoriaChange(): void {
    this.filtrarClientes();
  }

    filtrarClientes(): void {
    if (!this.categoriaSeleccionada || this.categoriaSeleccionada != 'Todo') {
      this.objClienteService.getClientes().subscribe(
        clientes => {
          this.clientes = clientes;
        }
      );
    } else {
      this.objClienteService.getClientes().subscribe(
        clientes => {
          this.clientes = clientes;
        }
      );
    }
  }

}
