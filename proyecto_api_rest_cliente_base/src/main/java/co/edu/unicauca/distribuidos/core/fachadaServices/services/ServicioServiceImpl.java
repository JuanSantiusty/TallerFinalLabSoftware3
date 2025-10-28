
package co.edu.unicauca.distribuidos.core.fachadaServices.services;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import co.edu.unicauca.distribuidos.core.capaAccesoADatos.models.CategoriaEntity;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;

import co.edu.unicauca.distribuidos.core.capaAccesoADatos.models.ServicioEntity;
import co.edu.unicauca.distribuidos.core.capaAccesoADatos.repositories.ServicioRepositoryBaseDatos;
import co.edu.unicauca.distribuidos.core.fachadaServices.DTO.ServicioDTOPeticion;
import co.edu.unicauca.distribuidos.core.fachadaServices.DTO.ServicioDTORespuesta;
import org.springframework.web.multipart.MultipartFile;

@Service//El objeto creado se almacena en el contenedor de Spring
public class ServicioServiceImpl implements IServicioService {

	
	private ServicioRepositoryBaseDatos servicioAccesoBaseDatos;
	private ModelMapper modelMapper;

	//El contructor inyecta los objetos que se encuentran en el contenedor de Spring
	public ServicioServiceImpl(ServicioRepositoryBaseDatos servicioAccesoBaseDatos, ModelMapper modelMapper) {
		this.servicioAccesoBaseDatos = servicioAccesoBaseDatos;
		this.modelMapper = modelMapper;
	}

	@Override
	public List<ServicioDTORespuesta> findAll() {
		List<ServicioDTORespuesta> listaRetornar;
		Optional<Collection<ServicioEntity>> clientesEntityOpt = this.servicioAccesoBaseDatos.findAll();
		
		// Si el Optional está vacío, devolvemos una lista vacía
		if (clientesEntityOpt.isEmpty()) {
			listaRetornar=List.of(); // Retorna una lista inmutable vacía
		}
		else{
			// Convertimos la colección a una lista y la mapeamos a ClienteDTO
			Collection<ServicioEntity> clientesEntity = clientesEntityOpt.get();
			listaRetornar= this.modelMapper.map(clientesEntity, new TypeToken<List<ServicioDTORespuesta>>() {}.getType());
			
		}
	
		
		return listaRetornar;
	}
	
	@Override
	public ServicioDTORespuesta findById(Integer id) {
		ServicioDTORespuesta clienteRetornar=null;
		Optional<ServicioEntity> optionalCliente = this.servicioAccesoBaseDatos.findById(id);
		if(optionalCliente.isPresent())
		{
			ServicioEntity servicioEntity =optionalCliente.get();
			clienteRetornar= this.modelMapper.map(servicioEntity, ServicioDTORespuesta.class);
		}


		return clienteRetornar;
		
	}

	@Override
	public List<ServicioDTORespuesta> findByCategoria(Integer id) {
		List<ServicioDTORespuesta> listaRetornar;
		Optional<Collection<ServicioEntity>> clientesEntityOpt = this.servicioAccesoBaseDatos.findByCategoria(id);

		// Si el Optional está vacío, devolvemos una lista vacía
		if (clientesEntityOpt.isEmpty()) {
			listaRetornar=List.of(); // Retorna una lista inmutable vacía
		}
		else{
			// Convertimos la colección a una lista y la mapeamos a ClienteDTO
			Collection<ServicioEntity> clientesEntity = clientesEntityOpt.get();
			listaRetornar= this.modelMapper.map(clientesEntity, new TypeToken<List<ServicioDTORespuesta>>() {}.getType());

		}
		return listaRetornar;
	}

	@Override
	public ServicioDTORespuesta save(ServicioDTOPeticion servicioDTO) {
		try {
			// Guardar la imagen y obtener la ruta
			String rutaImagen = guardarImagen(servicioDTO.getImagenFile());

			// Mapear el DTO a Entity
			ServicioEntity servicioEntity = this.modelMapper.map(servicioDTO, ServicioEntity.class);
			servicioEntity.setObjCategoria(new CategoriaEntity(servicioDTO.getIdCategoria(),""));
			servicioEntity.setImagen(rutaImagen); // Establecer la ruta de la imagen


			// Guardar en la base de datos
			ServicioEntity objServicioEntity = this.servicioAccesoBaseDatos.save(servicioEntity);
			System.out.println(objServicioEntity);

			ServicioDTORespuesta servicioDTORespuesta = this.modelMapper.map(objServicioEntity, ServicioDTORespuesta.class);
			return servicioDTORespuesta;

		} catch (IOException e) {
			System.out.println("Error al guardar la imagen: " + e.getMessage());
			throw new RuntimeException("Error al procesar la imagen", e);
		}
	}

	private String guardarImagen(MultipartFile imagen) throws IOException {
		// Crear directorio si no existe
		String uploadDir = "C:\\Users\\usuario\\Pictures\\imagenesServicio";
		File directory = new File(uploadDir);
		if (!directory.exists()) {
			directory.mkdirs();
		}

		// Generar nombre único para la imagen
		String originalFileName = imagen.getOriginalFilename();
		String fileExtension = "";
		if (originalFileName != null && originalFileName.contains(".")) {
			fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
		}

		String fileName = "servicio_" + System.currentTimeMillis() + fileExtension;
		Path filePath = Paths.get(uploadDir, fileName);

		// Guardar el archivo
		Files.copy(imagen.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

		// Retornar la ruta relativa o absoluta según tu necesidad
		return filePath.toString();
	}

	@Override
	public ServicioDTORespuesta update(Integer id, ServicioDTOPeticion servicio) {
		ServicioEntity servicioActualizado=null;
		Optional<ServicioEntity> clienteEntityOp = this.servicioAccesoBaseDatos.findById(id);

		if(clienteEntityOp.isPresent())
		{
			ServicioEntity objCLienteDatosNuevos=clienteEntityOp.get();
			objCLienteDatosNuevos.setNombre(servicio.getNombre());
			objCLienteDatosNuevos.setDescripcion(servicio.getDescripcion());
			objCLienteDatosNuevos.setPrecio(servicio.getPrecio());
			objCLienteDatosNuevos.getObjCategoria().setId(servicio.getIdCategoria());
			objCLienteDatosNuevos.getObjCategoria().setNombre("");

			Optional<ServicioEntity> optionalCliente = this.servicioAccesoBaseDatos.update(id, objCLienteDatosNuevos);
			servicioActualizado=optionalCliente.get();
		}

		return this.modelMapper.map(servicioActualizado, ServicioDTORespuesta.class);
	}

	@Override
	public boolean delete(Integer id) {
		return this.servicioAccesoBaseDatos.delete(id);
	}
}
