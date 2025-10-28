
package co.edu.unicauca.distribuidos.core.capaControladores;

import java.util.List;

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
			@RequestParam("imagen") MultipartFile imagen) {

		ServicioDTOPeticion servicioDTO = new ServicioDTOPeticion();
		servicioDTO.setNombre(nombre);
		servicioDTO.setDescripcion(descripcion);
		servicioDTO.setPrecio(precio);
		servicioDTO.setIdCategoria(idCategoria);
		servicioDTO.setImagenFile(imagen); // Pasamos el archivo

		ServicioDTORespuesta objServicio = servicioService.save(servicioDTO);
		return objServicio;
	}

	@PutMapping("/servicio/{id}")
	public ServicioDTORespuesta actualizarCliente(@RequestBody ServicioDTOPeticion cliente, @PathVariable Integer id) {
		ServicioDTORespuesta objCliente = null;
		ServicioDTORespuesta clienteActual = servicioService.findById(id);
		if (clienteActual != null) {
			objCliente = servicioService.update(id, cliente);
		}
		return objCliente;
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
