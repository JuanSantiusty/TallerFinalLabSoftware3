package co.edu.unicauca.distribuidos.core.capaControladores;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import co.edu.unicauca.distribuidos.core.fachadaServices.DTO.CategoriaDTORespuesta;
import co.edu.unicauca.distribuidos.core.fachadaServices.services.ICategoriaService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200", methods = {RequestMethod.GET})
public class CategoriaRestController {

    @Autowired
	private ICategoriaService categoriaService;

    @GetMapping("/categorias")
	public List<CategoriaDTORespuesta> listarCategorias() {			
		return categoriaService.findAll();
	}

}
