# Proyecto Backend Node.js

Este es un proyecto backend de Node.js construido con Express y Mongoose.

## Descripción

Este proyecto proporciona una API RESTful para la gestión de productos y carritos.

## Instalación

1.  Clona el repositorio:

    ```bash
    git clone <url_del_repositorio>
    ```

2.  Instala las dependencias:

    ```bash
    npm install
    ```

3.  Crea un archivo `.env` con las siguientes variables de entorno:

    ```
    MONGODB_URI=<tu_uri_de_mongodb>
    PORT=<numero_de_puerto>
    ```

4.  Inicia el servidor:

    ```bash
    npm start
    ```

## Uso

La API proporciona los siguientes endpoints:

### Productos

- `GET /products`: Lista todos los productos con paginación, ordenamiento y filtrado.
  - Parámetros de consulta:
    - `limit`: Número de productos por página (predeterminado: 10).
    - `page`: Número de página (predeterminado: 1).
    - `sort`: Ordenar por precio (`asc` o `desc`).
    - `query`: Filtrar por categoría o disponibilidad.
- `GET /products/:pid`: Obtiene un producto específico por ID.
- `POST /products`: Agrega un nuevo producto.
- `PUT /products/:pid`: Actualiza un producto.
- `DELETE /products/:pid`: Elimina un producto.

### Carritos

- `POST /carts`: Crea un nuevo carrito.
- `GET /carts/:cid`: Lista los productos en un carrito.
- `DELETE /carts/:cid/products/:pid`: Elimina un producto de un carrito.
- `PUT /carts/:cid`: Actualiza el carrito con un array de productos.
- `PUT /carts/:cid/products/:pid`: Actualiza la cantidad de un producto en un carrito.
- `DELETE /carts/:cid`: Elimina todos los productos de un carrito.
