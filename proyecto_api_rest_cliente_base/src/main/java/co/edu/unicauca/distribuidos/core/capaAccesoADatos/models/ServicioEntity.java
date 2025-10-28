package co.edu.unicauca.distribuidos.core.capaAccesoADatos.models;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ServicioEntity {
	private Integer id;
	private String nombre;
	private String descripcion;
	private Float precio;
	private String imagen;

	private CategoriaEntity objCategoria;

	public ServicioEntity() {

	}
}

