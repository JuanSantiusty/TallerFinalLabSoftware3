package co.edu.unicauca.distribuidos.core.fachadaServices.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
public class ServicioDTOPeticion {
	
	private String nombre;
	private String descripcion;
	private Float precio;

	private Integer idCategoria;

	private MultipartFile imagenFile;

	public ServicioDTOPeticion() {

	}
}