package co.edu.unicauca.distribuidos.core.fachadaServices.services;

import java.util.List;

import co.edu.unicauca.distribuidos.core.fachadaServices.DTO.CategoriaDTORespuesta;

public interface ICategoriaService {
    public List<CategoriaDTORespuesta> findAll();
}
