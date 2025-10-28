CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombreCategoria VARCHAR(255)
);

CREATE TABLE servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255),
    descripcion VARCHAR(255),
    precio FLOAT,
    imagen VARCHAR(255),
    idCategoria INT,
    FOREIGN KEY (idCategoria) REFERENCES categorias(id)
);









