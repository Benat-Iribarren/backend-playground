#   🛠️BACKEND-PLAYGROUND🛠️

Este proyecto es un entorno de práctica y experimentación backend construido siguiendo buenas prácticas de Arquitectura Hexagonal, vertical slicing y Domain-Driven Design (DDD) ligero.

La idea es mantener un código modular, desacoplado y fácil de mantener, aplicando principios de código sostenible y buenas prácticas de testing automatizado.

El objetivo no es solo levantar un backend funcional, sino hacerlo de manera que el proyecto pueda evolucionar sin generar deuda técnica, asegurando mantenibilidad a largo plazo.

##📐Principios aplicados📐

Arquitectura Hexagonal: separación clara entre dominio, aplicación e infraestructura.

Vertical Slicing: cada caso de uso aislado en su propio módulo (endpoints, servicios, repositorios).

Domain-Driven Design (DDD) ligero: el dominio es la fuente de verdad de las reglas de negocio.

Clean Code & Testing: código enfocado en la simplicidad, acompañado de tests unitarios, de integración y E2E.

Automatización con Makefile: para simplificar comandos de Docker, tests y base de datos.

Entornos reproducibles con Docker: separación entre entorno de desarrollo y test.
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
