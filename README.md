# Delilah Restó

Esta aplicación tiene como objetivo la creación del Backend para administrar el servicio de las actividades realizadas por el restaurante Delilah-Restó.

## Funcionalidades
- Creación, obtención, modificación y eliminación de los platos ofrecidos por el restaurante.
- Registro de nuevos usuarios.
- Ingreso de usuarios y validación de roles (administrador o no administrador).
- Creación de pedidos por parte del usuario.
- Modificacion y eliminación de pedidos por parte del usuario administrador.

## Especificaciones OPEN API
- [Documento Open API](/spec.yml)

## Instalación
### Clonación del repositorio de GIT:
```
$ git clone https://github.com/ingridbanguero/Proyecto---Delilah-Resto.git
```
o realizar la descarga directamente desde GitHub

### Instalación de dependencias
En la línea de comandos:
```
$ npm install
```
### Configuración de la base de datos

####Configuración automatica
Esta es la forma mas recomendada para la instalación de la base de datos.
- Ejecute un servidor MySQL
- Ingrese al archivo `config.js` que se encuentra en el interior de la carpeta `database` y edite los parámetros para ingresar a la base de datos. Los parametros a editar son:
	1. Host
	2. Puerto
	3. Nombre de la base de datos
	4.  Usuario
	5. Contraseña

- Ingrese a una línea de comandos en el interior de la carpeta `database` y ponga en funcionamiento el archivo `database.js` mediante node o nodemon.

```
$ cd database
$ node database.js
```
Esto creara el esquema de la base de datos con sus respectivas tablas e importara los datos que se encuentran en los archivos `productos.csv` y `usuarios.csv`. Estos archivos pueden ser modificados de acuerdo a las necesidades a la hora de crear la base de datos.

####Configuración manual
En caso de presentar algún problema con la instalación automatica recomendamos:
- Inicializar el servidor MySQL.
- Crear una base de datos llamada **delilah_resto** o con el nombre deseado. Puede hacer esto mediante la línea de comandos o directamente con la aplicación de escritorio.
- Cree el esquema y las tablas necesarias de acuerdo a las queries que se muestran en el archivo `database.sql`
- Modifique los datos para ingresar a la base de datos ingresando al archivo `config.js`.

## Poner en funcionamieno el servidor
Para poner en funcionamiento el servidor posicione una terminal en la carpeta base de los archivos e inicialice el archivo `index.js` con node o nodemon.
```
$ node index.js
```