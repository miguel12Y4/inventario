## Descripción

El programa es una pagina web para el manejo del inventario de productos, cada producto esta asociado a un rubro, una persona, una ubicación y una especie (ejemplo: CPU)

**Funcionalidades realizadas:**

Agregar elementos a cualquier categoría (rubro, persona, ubicación y especie)

Agregar productos (Asociados a una categoría)

Buscar productos de una instancia de alguna categoría

Buscar productos dado un numero de identificación o un rango de numeros

**Tecnologías usadas:**

- **Frontend:**
    - HTML
    - BOOTSTRAP: Framework de CSS
    - Javascript: Lenguaje de programación
- **Backend:**
    - Nodejs
        - Express: Modulo para crear el servidor
        - ejs: Motor de plantillas
    - MariaDB: Gestor de base de datos Relacional

**Organización de carpetas del proyecto**

![image](https://user-images.githubusercontent.com/89826382/131717538-a03d26fd-95aa-4503-95d1-facf6e6ebf0a.png)
![image](https://user-images.githubusercontent.com/89826382/131717675-497423a6-b9ed-4869-8e10-34bef4675e42.png)



**Carpetas:**

- **SQL:** contiene archivo de la base de datos
    - **tablas.sql**: contiene el esquema de las tablas a insertar en el gestor de base de datos
- **src:** contiene todos los archivos del programa
    - **public / js:** archivos javascript públicos
        - **enviarFormulario:** contiene los archivos Javascript necesarios para enviar formularios desde el lado del cliente al servidor
        - **search.js:** archivo javascript de la vista que contiene la funcionalidad **buscar productos por categoria**
        - **searchId.js**: archivo javascript de la vista que contiene la funcionalidad **buscar productos por numero de identificación o rangos**
        - **productos.js:**
        - **searchId.js**: archivo javascript de la vista que contiene la funcionalidad **agregar productos**
    - **routes:** contiene las rutas del backend
        - **addData.js:** contiene todas las rutas que modifiquen datos
        - **getInfo.js:** contiene todas las rutas que muestren información
        - **index.js:** contiene ruta principal
    - **views:** contiene las vistas del lado del cliente (Frontend)
        - **partials:** contiene elementos HTML re-utilizables
            - head.ejs
            - nav.ejs
            - footer.ejs
        - **addEspecie.ejs:** vista que muestra la **funcionalidad agregar Especie**
        - **addPersona.ejs:** vista que muestra la **funcionalidad agregar Persona**
        - **addProducto.ejs:** vista que muestra la **funcionalidad agregar Producto**
        - **addRubro.ejs:** vista que muestra la **funcionalidad agregar Rubro**
        - **addUbicacion.ejs:** vista que muestra la **funcionalidad agregar Ubicación**
        - **index.ejs:** vista que muestra la pantalla principal
        - **search.ejs:** vista que muestra **la funcionalidad buscar productos por categoría**
        - **searchId.ejs:** vista que muestra **la funcionalidad buscar productos por numero de id o rango**
    - **database.js:** archivo encargado de conectarse con la Base de Datos
    - **index.js:** archivo encargado de la configuración y la ejecución del servidor.
    - **key.js:** archivo con las claves de conexión a la base de datos



## Configurar base de datos

En este caso usaré Mariadb

- Descargar desde su pagina oficial
- Al momento de instalarlo se le pedirá una contraseña para el usuario "root"
- Buscar un programa llamado MySQL Client (MariaDB)

    ![image](https://user-images.githubusercontent.com/89826382/131717074-cdcdfe14-a1a8-44df-b5a5-fbc9a6e093fa.png)


    - Ingresar la contraseña, luego aparecerá:

![image](https://user-images.githubusercontent.com/89826382/131717146-cf90d20f-775a-4cfa-9776-e6ccf907141a.png)

Aquí debe ingresar los siguientes comandos:

```bash
CREATE DATABASE INSUCO;
USE INSUCO;
```

Debería salir algo así:


![image](https://user-images.githubusercontent.com/89826382/131717193-792dc756-6545-4c4f-8f9f-8838bf217655.png)

Luego ingresar los datos del archivo tabla.sql de la carpeta SQL

Si no hay errores, eso es lo único que hay que hacer en la base de datos.

## Obtener repositorio e instalar dependencias

Para descargar el proyecto se debe tener instalado NodeJs y Git (buscar en la web)

Una vez descargado e instalado los programas ingresar a la consola o teminal de comandos y clonar el repositorio. usar:

```bash
git clone https://github.com/mgeld542/inventario
```

luego de esto deberá:

- Ingresar a la carpeta inventario
- Instalar paquetes con npm

Para esto debe ejecutar

```bash
cd inventario
npm install
```
![image](https://user-images.githubusercontent.com/89826382/131717265-fba24a92-e0eb-42a5-a2a5-7b6e02f428d0.png)

Luego debe cambiar los valores del archivo **keys.js**

- en user debe poner **root**
- en password debe poner la contraseña que escogió al momento de instalar la base de datos

Luego debe ingresar en la consola:

```bash
npm run dev
```
![image](https://user-images.githubusercontent.com/89826382/131717294-8c6ee6ce-18f3-4e20-92a2-406acc4f1b01.png)


Luego debe ingresar en un navegador a [http://localhost:5001/](http://localhost:5001/) donde le debe salir algo como esto:

![image](https://user-images.githubusercontent.com/89826382/131717338-18ca1449-d7f0-48b7-a2f6-f70d4f6a53cc.png)

Cualquier cambio realizado en los archivos debería reflejarse al momento de guardar los cambios, (Gracias al modulo de desarrollo nodemon)
