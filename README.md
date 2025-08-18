## 🐋Levantar el entorno Docker🐋

1. Instalar Docker y Docker Desktop
2. Dejar libre el puerto 3000 (desarrollo) y 3001 (tests)
3. Levantar backend y base de datos:
   ```bash
   make up
   ```
4. Crear tablas e insertar en la base de datos:
   ```bash
   make db-init
   ```

## 🧪 Entorno de Testing 🧪

### Ejecutar tests con Docker (recomendado)

```bash
# Ejecutar tests una vez (cierra cuando termina)
make test

# Ejecutar tests en modo watch (deja la terminal abierta)
make test-watch
```

### Comandos adicionales de testing

```bash
# Levantar solo los servicios de test en background
make up-test

# Inicializar base de datos de test
make db-init-test

# Abrir shell en el contenedor de test
make test-shell

# Ver logs de los servicios de test
make logs-test

# Parar servicios de test
make down-test
```

### Diferencias entre entornos

- **Desarrollo**: Puerto 3000, base de datos `sequraBackendDB.sqlite` (persistente)
- **Test**: Puerto 3001, base de datos en memoria (no persistente, se reinicia en cada ejecución)
- Los tests usan `NODE_ENV=test` automáticamente
- Usa un solo archivo `docker-compose.yml` con perfiles para separar entornos
