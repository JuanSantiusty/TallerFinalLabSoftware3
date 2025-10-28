package co.edu.unicauca.distribuidos.core.capaAccesoADatos.repositories;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.*;

import org.springframework.stereotype.Repository;

import co.edu.unicauca.distribuidos.core.capaAccesoADatos.models.CategoriaEntity;
import co.edu.unicauca.distribuidos.core.capaAccesoADatos.models.ServicioEntity;
import co.edu.unicauca.distribuidos.core.capaAccesoADatos.repositories.conexion.ConexionBD;

@Repository //El objeto creado se almacena en el contenedor de Spring
public class ServicioRepositoryBaseDatos {
    private final ConexionBD conexionABaseDeDatos;

    public ServicioRepositoryBaseDatos() {
        conexionABaseDeDatos = new ConexionBD();
    }

    /**
     * 
     * @author: Daniel Eduardo Paz Perafán
     * @version: 09/12/2024
     * @param cliente El parámetro encapsula la información del cliente a registrar
     *                en el sistema
     * @return si el cliente se registro correctamente, el método retorna el cliente
     *         con los datos registrados,null en caso contrario
     */

     public ServicioEntity save(ServicioEntity objServicio) {
        System.out.println("registrando servicio en base de datos");
        ServicioEntity objServicioAlmacenado = null;
        int resultado = -1;

        try {

            conexionABaseDeDatos.conectar();

            PreparedStatement sentencia = null;
            String consulta = "insert into servicios(nombre, descripcion, precio, imagen,idCategoria) values(?,?,?,?,?)";
            sentencia = conexionABaseDeDatos.getConnection().prepareStatement(consulta, Statement.RETURN_GENERATED_KEYS);
            sentencia.setString(1, objServicio.getNombre());
            sentencia.setString(2, objServicio.getDescripcion());
            sentencia.setFloat(3, objServicio.getPrecio());
            sentencia.setString(4, objServicio.getImagen());
            sentencia.setInt(5,objServicio.getObjCategoria().getId());
            System.out.println(sentencia);
            resultado = sentencia.executeUpdate();
            
            ResultSet generatedKeys = sentencia.getGeneratedKeys();
            if (generatedKeys.next()) {
                int idGenerado = generatedKeys.getInt(1); 
                objServicio.setId(idGenerado);
                System.out.println("ID generado: " + idGenerado);
                if (resultado == 1) {
                    objServicioAlmacenado = this.findById(idGenerado).get();
                }
            }
            else {
                System.out.println("No se pudo obtener el ID generado.");
            }

            generatedKeys.close();
            sentencia.close();
            conexionABaseDeDatos.desconectar();

        } catch (SQLException e) {
            System.out.println("error en la inserción: " + e.getMessage());
        }

       
        return objServicioAlmacenado;
    }

    public Optional<Collection<ServicioEntity>> findAll() {
        System.out.println("listando clientes de base de datos");        
        Collection<ServicioEntity> servicios = new LinkedList<ServicioEntity>();

        conexionABaseDeDatos.conectar();
        try {
            PreparedStatement sentencia = null;
            String consulta = "select * from servicios join categorias on servicios.idCategoria=categorias.id";
            sentencia = conexionABaseDeDatos.getConnection().prepareStatement(consulta);
            ResultSet res = sentencia.executeQuery();
            while (res.next()) {
                ServicioEntity objServicio = new ServicioEntity();
                objServicio.setId(res.getInt("id"));
                objServicio.setNombre(res.getString("nombre"));
                objServicio.setDescripcion(res.getString("descripcion"));
                objServicio.setPrecio(res.getFloat("precio"));
                objServicio.setImagen(res.getString("imagen"));
                objServicio.setObjCategoria(new CategoriaEntity(res.getInt("idCategoria"), res.getString("nombreCategoria")));
                servicios.add(objServicio);
            }
            sentencia.close();
            conexionABaseDeDatos.desconectar();

        } catch (SQLException e) {
            System.out.println("error en la consulta: " + e.getMessage());
        }

        return servicios.isEmpty() ? Optional.empty() : Optional.of(servicios);
    }

    public Optional<ServicioEntity> findById(Integer idServicio) {
        System.out.println("consultar servicio de base de datos");
        ServicioEntity objServicio = null;

        conexionABaseDeDatos.conectar();
        try {
            PreparedStatement sentencia = null;
            String consulta = "select * from servicios join categorias on servicios.idCategoria=categorias.id where servicios.id=?";
            sentencia = conexionABaseDeDatos.getConnection().prepareStatement(consulta);
            sentencia.setInt(1, idServicio);
            ResultSet res = sentencia.executeQuery();
            while (res.next()) {
                System.out.println("servicio encontrado");
                objServicio = new ServicioEntity();
                objServicio.setId(res.getInt("id"));
                objServicio.setNombre(res.getString("nombre"));
                objServicio.setDescripcion(res.getString("descripcion"));
                objServicio.setPrecio(res.getFloat("precio"));
                objServicio.setImagen(res.getString("imagen"));
                objServicio.setObjCategoria(new CategoriaEntity(res.getInt("idCategoria"), res.getString("nombre")));
            }
            sentencia.close();
            conexionABaseDeDatos.desconectar();

        } catch (SQLException e) {
            System.out.println("error en la consulta: " + e.getMessage());
        }

        return objServicio == null ? Optional.empty() : Optional.of(objServicio);
    }

    public Optional<ServicioEntity> update(Integer idServicio, ServicioEntity objServicio) {
        System.out.println("actualizar servicio de base de datos");
        ServicioEntity objServicioActualizado = null;
        conexionABaseDeDatos.conectar();
        int resultado = -1;
        try {
            PreparedStatement sentencia = null;
            String consulta = "update servicios set servicios.nombre=?,"
                    + "servicios.descripcion=?,"
                    + "servicios.precio=?,"
                    + "servicios.imagen=?,"
                    + "servicios.idCategoria=? "
                    + "where servicios.id=?";
            sentencia = conexionABaseDeDatos.getConnection().prepareStatement(consulta);

            sentencia.setString(1, objServicio.getNombre());
            sentencia.setString(2, objServicio.getDescripcion());
            sentencia.setFloat(3, objServicio.getPrecio());
            sentencia.setString(4, objServicio.getImagen());
            sentencia.setInt(5, objServicio.getObjCategoria().getId());
            sentencia.setInt(6, idServicio);
            resultado = sentencia.executeUpdate();
            sentencia.close();
            conexionABaseDeDatos.desconectar();

        } catch (SQLException e) {
            System.out.println("error en la actualización: " + e.getMessage());
        }

        if (resultado == 1) {
            objServicioActualizado = this.findById(idServicio).get();
        }
        return objServicioActualizado == null ? Optional.empty() : Optional.of(objServicioActualizado);
    }

    public boolean delete(Integer idServicio) {
        System.out.println("eliminar servicio de base de datos");
        conexionABaseDeDatos.conectar();
        int resultado = -1;
        try {
            PreparedStatement sentencia = null;
            String consulta = "delete from servicios where servicios.id=?";
            sentencia = conexionABaseDeDatos.getConnection().prepareStatement(consulta);
            sentencia.setInt(1, idServicio);
            resultado = sentencia.executeUpdate();
            sentencia.close();
            conexionABaseDeDatos.desconectar();

        } catch (SQLException e) {
            System.out.println("error en la eliminación: " + e.getMessage());
        }

        return resultado == 1;
    }

    //Funcion que se encarga de listar servicios por categoria
    public Optional<Collection<ServicioEntity>> findByCategoria(Integer idCategoria) {
        System.out.println("consultar servicios por categoría de base de datos");
        Collection<ServicioEntity> servicios = new LinkedList<ServicioEntity>();

        conexionABaseDeDatos.conectar();
        try {
            PreparedStatement sentencia = null;
            String consulta = "select * from servicios join categorias on servicios.idCategoria=categorias.id where servicios.idCategoria=?";
            sentencia = conexionABaseDeDatos.getConnection().prepareStatement(consulta);
            sentencia.setInt(1, idCategoria);
            ResultSet res = sentencia.executeQuery();
            while (res.next()) {
                System.out.println("servicio encontrado para la categoría: " + idCategoria);
                ServicioEntity objServicio = new ServicioEntity();
                objServicio.setId(res.getInt("id"));
                objServicio.setNombre(res.getString("nombre"));
                objServicio.setDescripcion(res.getString("descripcion"));
                objServicio.setPrecio(res.getFloat("precio"));
                objServicio.setImagen(res.getString("imagen"));
                objServicio.setObjCategoria(new CategoriaEntity(res.getInt("idCategoria"), res.getString("nombre")));
                servicios.add(objServicio);
            }
            sentencia.close();
            conexionABaseDeDatos.desconectar();

        } catch (SQLException e) {
            System.out.println("error en la consulta por categoría: " + e.getMessage());
        }

        return servicios.isEmpty() ? Optional.empty() : Optional.of(servicios);
    }
}

