
package co.edu.unicauca.distribuidos.core.fachadaServices.services;

import java.util.List;

import co.edu.unicauca.distribuidos.core.fachadaServices.DTO.ServicioDTOPeticion;
import co.edu.unicauca.distribuidos.core.fachadaServices.DTO.ServicioDTORespuesta;

public interface IServicioService {

	public List<ServicioDTORespuesta> findAll();

	public ServicioDTORespuesta findById(Integer id);

	public List<ServicioDTORespuesta> findByCategoria(Integer id);

	public ServicioDTORespuesta save(ServicioDTOPeticion cliente);

	public ServicioDTORespuesta update(Integer id, ServicioDTOPeticion cliente);

	public boolean delete(Integer id);
}


