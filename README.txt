README

1.- Descripcion del proyecto: PWA instalable basado den HTML y JavaScript que contiene un CRUD y
muestra una base de datos de MokApi, permitiendo la captura, edicion y eliminacion de los datos.

2.- Pasos para correr el proyecto localmente: Descargar todos los archivos del repositorio, poner
todo dentro de una carpeta y abrir la carpeta en un entorno de desarrollo (se recomienda Visual 
Studio Code) una vez dentro abrir un nuevo terminal y ejecutar la siguiente linea:

http-server -p 8081 --ssl --cert cert.pem --key key.pem -a localhost

Explicación de los parámetros:

-p 8081 → Puerto 8081.

--ssl → Activa HTTPS.

--cert cert.pem → Especifica el certificado SSL.

--key key.pem → Especifica la clave privada.

-a localhost → Fuerza a usar localhost en lugar de una IP.

Abrir direccion dada por la terminal.
