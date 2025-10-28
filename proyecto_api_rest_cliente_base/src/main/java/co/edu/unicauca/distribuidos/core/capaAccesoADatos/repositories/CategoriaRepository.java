package co.edu.unicauca.distribuidos.core.capaAccesoADatos.repositories;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Collection;
import java.util.LinkedList;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import co.edu.unicauca.distribuidos.core.capaAccesoADatos.models.CategoriaEntity;
import co.edu.unicauca.distribuidos.core.capaAccesoADatos.repositories.conexion.ConexionBD;

@Repository //El objeto creado se almacena en el contenedor de Spring
public class CategoriaRepository {

    private final ConexionBD conexionABaseDeDatos;

    public CategoriaRepository() {
        conexionABaseDeDatos = new ConexionBD();
    }

     // Listar todos los clientes (opcional si está vacío)
    public Optional<Collection<CategoriaEntity>> findAll() {
        
        System.out.println("listando categorias de base de datos");        
        Collection<CategoriaEntity> categorias = new LinkedList<CategoriaEntity>();

        conexionABaseDeDatos.conectar();
        try {
            PreparedStatement sentencia = null;
            String consulta = "select * from categorias";
            sentencia = conexionABaseDeDatos.getConnection().prepareStatement(consulta);
            ResultSet res = sentencia.executeQuery();
            while (res.next()) {
                CategoriaEntity objCategoria = new CategoriaEntity();
                objCategoria.setId(res.getInt("id"));
                objCategoria.setNombre(res.getString("nombreCategoria"));
                categorias.add(objCategoria);
            }
            sentencia.close();
            conexionABaseDeDatos.desconectar();

        } catch (SQLException e) {
            System.out.println("error en la consulta: " + e.getMessage());
        }

        return categorias.isEmpty() ? Optional.empty() : Optional.of(categorias); 
   }

  
}
