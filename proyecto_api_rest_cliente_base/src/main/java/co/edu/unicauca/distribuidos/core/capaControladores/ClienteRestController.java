
package co.edu.unicauca.distribuidos.core.capaControladores;

import java.util.List;

import co.edu.unicauca.distribuidos.core.fachadaServices.DTO.CategoriaDTOPeticion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import co.edu.unicauca.distribuidos.core.fachadaServices.DTO.ServicioDTOPeticion;
import co.edu.unicauca.distribuidos.core.fachadaServices.DTO.ServicioDTORespuesta;
import co.edu.unicauca.distribuidos.core.fachadaServices.services.IServicioService;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class ClienteRestController {

	@Autowired	//Otra forma de inyectar un objeto del contenedor de Spring
	private IServicioService servicioService;

	@GetMapping("/servicio")
	public List<ServicioDTORespuesta> listarServicios() {
		return servicioService.findAll();
	}

	@GetMapping("/servicio/{id}")
	public ServicioDTORespuesta consultarServicio(@PathVariable Integer id) {
		ServicioDTORespuesta objCliente = null;
		objCliente = servicioService.findById(id);
		return objCliente;
	}

	@GetMapping("/servicio/categoria/{id}")
	public List<ServicioDTORespuesta> listarCategorias(@PathVariable Integer id) {
		return servicioService.findByCategoria(id);
	}

	@PostMapping(value = "/servicio", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ServicioDTORespuesta crearServicio(
			@RequestParam("nombre") String nombre,
			@RequestParam("descripcion") String descripcion,
			@RequestParam("precio") Float precio,
			@RequestParam("idCategoria") Integer idCategoria,
			@RequestParam("estado") Boolean estado,
			@RequestParam("imagen") MultipartFile imagen) {

		ServicioDTOPeticion servicioDTO = new ServicioDTOPeticion();
		servicioDTO.setNombre(nombre);
		servicioDTO.setDescripcion(descripcion);
		servicioDTO.setPrecio(precio);
		servicioDTO.setIdCategoria(idCategoria);
		servicioDTO.setEstado(estado);
		servicioDTO.setImagenFile(imagen); // Pasamos el archivo

		ServicioDTORespuesta objServicio = servicioService.save(servicioDTO);
		return objServicio;
	}

	@PutMapping(value = "/servicio/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ServicioDTORespuesta actualizarServicio(
			@PathVariable Integer id,
			@RequestParam("nombre") String nombre,
			@RequestParam("descripcion") String descripcion,
			@RequestParam("precio") Float precio,
			@RequestParam("idCategoria") Integer idCategoria,
			@RequestParam("estado") Boolean estado, // Ajusta el tipo según tu entidad
			@RequestParam(value = "imagen", required = false) MultipartFile imagen) {

		ServicioDTOPeticion servicioDTO = new ServicioDTOPeticion();
		servicioDTO.setNombre(nombre);
		servicioDTO.setDescripcion(descripcion);
		servicioDTO.setPrecio(precio);
		servicioDTO.setIdCategoria(idCategoria);
		servicioDTO.setEstado(estado);
		servicioDTO.setImagenFile(imagen);

		ServicioDTORespuesta objServicio = servicioService.update(id, servicioDTO);
		return objServicio;
	}

	@DeleteMapping("/servicio/{id}")
	public Boolean eliminarCliente(@PathVariable Integer id) {
		Boolean bandera = false;
		ServicioDTORespuesta clienteActual = servicioService.findById(id);
		if (clienteActual != null) {
			bandera = servicioService.delete(id);
		}
		return bandera;
	}
	
}
