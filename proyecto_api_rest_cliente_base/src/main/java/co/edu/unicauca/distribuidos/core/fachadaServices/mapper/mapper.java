package co.edu.unicauca.distribuidos.core.fachadaServices.mapper;

import co.edu.unicauca.distribuidos.core.capaAccesoADatos.models.ServicioEntity;
import co.edu.unicauca.distribuidos.core.fachadaServices.DTO.ServicioDTOPeticion;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class mapper {
    @Bean 
    public ModelMapper crearMapper() {
        ModelMapper objMapeador= new ModelMapper();
        objMapeador.typeMap(ServicioDTOPeticion.class, ServicioEntity.class)
                .addMappings(mapper -> {
                    mapper.map(ServicioDTOPeticion::getNombre, ServicioEntity::setNombre);
                    mapper.map(ServicioDTOPeticion::getDescripcion, ServicioEntity::setDescripcion);
                    mapper.map(ServicioDTOPeticion::getPrecio, ServicioEntity::setPrecio);
                    // Ignorar el campo imagenFile ya que lo manejamos manualmente
                    mapper.skip(ServicioEntity::setImagen);
                    mapper.map(ServicioDTOPeticion::getEstado, ServicioEntity::setEstado);
                });
        return objMapeador;//El objeto retornado se almacena en el contenedor de Spring
    }
}
