package co.edu.unicauca.distribuidos.core.capaAccesoADatos.repositories.conexion;

import java.sql.*;

/**
 * Esta clase permite que las Clases tipo Entidad tengan persistencia
 * por medio de una base de datos relacional
 */
public class ConexionBD {

    private Connection connection;

    public ConexionBD() {}    

    public void conectar() {
        try {
            Class.forName("org.h2.Driver");
            connection = DriverManager.
            getConnection("jdbc:h2:mem:testdb", "sa", "");
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public Connection getConnection() {
        return connection;
    }

    public void desconectar() {
        try {
            if (connection != null) connection.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

}
