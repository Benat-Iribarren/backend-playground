## 🐋Levantar el entorno Docker🐋
1. Instalar Composer y composer Desktop
2. Dejar libre el puerto 3000
3. Construir la imagen:
    ```bash
    docker compose build
    ```
4. Levantar los servicios de backend y base de datos;
    ```bash
    docker compose up
    ```
5. Parar el contenedor:
    ```bash
    docker compose down
    ```
6. Reconstruir cuando se modifiquen las dependencias:
    ```bash
    docker compose up --build
    ```