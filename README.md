# Frontend - Red Sísmica

Frontend del Proyecto Práctico de Aplicación Integrador (TPI) de la carrera Ingeniería en Sistemas de Información, materia Diseño de Sistemas de la Universidad Tecnológica Nacional - Facultad Regional Villa María.

## 📋 Información Académica

- **Proyecto**: Proyecto Práctico de Aplicación Integrador (TPI)
- **Carrera**: Ingeniería en Sistemas de Información
- **Materia**: Diseño de Sistemas
- **Universidad**: Universidad Tecnológica Nacional - Facultad Regional Villa María
- **Año de Cursado**: 2025
- **Grupo**: 1

## 🎯 Caso de Estudio

### Red Sísmica

Este proyecto corresponde a la **tercera entrega** del caso de estudio "Red Sísmica", enfocada en el **diseño** del sistema.

La aplicación permite gestionar eventos sísmicos, incluyendo el registro, resolución y revisión manual de eventos sísmicos no revisados.

## 👥 Equipo

- **Barrionuevo Halavacs, Imanol** - 15.889 - [barrionuevoimanol@gmail.com](mailto:barrionuevoimanol@gmail.com)
- **Broilo, Mateo José** - 16.191 - [broilomateo@gmail.com](mailto:broilomateo@gmail.com)
- **Correa, Valentín** - 16.281 - [correavale2004@gmail.com](mailto:correavale2004@gmail.com)
- **Díaz, Gabriel** - 16.117 - [gabidiaz4231@gmail.com](mailto:gabidiaz4231@gmail.com)
- **Gambino, Tomás** - 15.870 - [tomigambino21@gmail.com](mailto:tomigambino21@gmail.com)
- **Gómez Ferrero, Andrés** - 16.172 - [andresgf925@gmail.com](mailto:andresgf925@gmail.com)
- **Gonzalez Meyer, Lorenzo** - 16.186 - [gonzalez.lorenzo2311@gmail.com](mailto:gonzalez.lorenzo2311@gmail.com)
- **Letona, Mateo** - 16.276 - [mateolet883@gmail.com](mailto:mateolet883@gmail.com)
- **Wursten Gill, Santiago** - 15.905 - [santiwgwuri@gmail.com](mailto:santiwgwuri@gmail.com)

## 👨‍🏫 Docentes

### Docentes del Curso

- **Lovay, Mónica**
- **Zanel, María Sol**

### Docentes Tutores

- **Zanel, María Sol**
- **Abdala, Valeria**

## 🛠️ Stack Tecnológico

Este proyecto fue generado con [Angular CLI](https://github.com/angular/angular-cli) versión 20.0.2.

### Tecnologías Principales

- **Angular**: 20.0.0
- **TypeScript**: 5.8.2
- **Bootstrap**: 5.3.8
- **FontAwesome**: 7.1.0
- **Bootstrap Icons**: 1.13.1
- **RxJS**: 7.8.0
- **Express**: 5.1.0 (para SSR)

### Características

- **Server-Side Rendering (SSR)**: Implementado con Angular SSR
- **Standalone Components**: Arquitectura basada en componentes standalone
- **Routing**: Navegación con Angular Router

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** (incluido con Node.js)
- **Angular CLI** (se instalará globalmente o se usará la versión local)

## 🚀 Instalación

1. Clona el repositorio:

```bash
git clone <url-del-repositorio>
cd TPI-DSI2025-G1-front-end
```

2. Instala las dependencias:

```bash
npm install
```

3. Asegúrate de que el backend esté corriendo en `http://localhost:8080`

## ⚙️ Configuración

### Backend API

La aplicación se conecta al backend en la siguiente URL:

- **Base URL**: `http://localhost:8080/reg-resultado-revision`

Si necesitas cambiar la URL del backend, modifica el archivo `src/app/service/service-es.service.ts`:

```typescript
private baseUrl = 'http://localhost:8080/reg-resultado-revision';
```

## 🏃 Uso

### Servidor de Desarrollo

Para iniciar el servidor de desarrollo, ejecuta:

```bash
ng serve
# o
npm start
```

Una vez que el servidor esté corriendo, abre tu navegador y navega a `http://localhost:4200/`. La aplicación se recargará automáticamente cuando modifiques cualquier archivo fuente.

### Build para Producción

Para compilar el proyecto para producción:

```bash
ng build
# o
npm run build
```

Esto compilará el proyecto y almacenará los artefactos de build en el directorio `dist/`. Por defecto, el build de producción optimiza la aplicación para rendimiento y velocidad.

### Build con Watch Mode

Para compilar en modo watch (desarrollo):

```bash
npm run watch
```

### Servidor SSR (Server-Side Rendering)

Para ejecutar el servidor SSR:

```bash
npm run serve:ssr:TPI-DSI2025-G1-front-end
```

## 🧪 Testing

### Ejecutar Tests Unitarios

Para ejecutar los tests unitarios con [Karma](https://karma-runner.github.io):

```bash
ng test
# o
npm test
```

### Ejecutar Tests End-to-End

Para ejecutar tests end-to-end (e2e):

```bash
ng e2e
```

Angular CLI no incluye un framework de testing e2e por defecto. Puedes elegir uno que se adapte a tus necesidades.

## 📁 Estructura del Proyecto

```text
src/
├── app/
│   ├── components/          # Componentes reutilizables
│   │   ├── modal-cargando-mapa/      # Modal de carga de mapa
│   │   ├── modal-confirmacion/       # Modal de confirmación
│   │   ├── modal-feedback/           # Modal de feedback
│   │   ├── modal-modificar-es/       # Modal para modificar evento sísmico
│   │   └── navbar/                   # Barra de navegación
│   ├── interfaces/          # Interfaces TypeScript
│   │   └── IEventoSismico.ts         # Interface para eventos sísmicos
│   ├── pages/               # Páginas principales
│   │   ├── home/                     # Página de inicio
│   │   ├── reg-res-rev-manual/       # Registro/Resolución/Revisión Manual
│   │   └── resultado-revision/       # Resultado de revisión
│   ├── service/             # Servicios
│   │   └── service-es.service.ts     # Servicio para comunicación con backend
│   ├── app.ts               # Componente raíz
│   ├── app.routes.ts        # Configuración de rutas
│   └── app.config.ts        # Configuración de la aplicación
├── assets/                  # Recursos estáticos
└── styles.css               # Estilos globales
```

## 🎨 Funcionalidades Principales

### Páginas

1. **Home** (`/`)
   - Página de inicio con opciones principales
   - Navegación a registro/resolución/revisión manual
   - Opciones futuras: cierre de orden de inspección, generar informe

2. **Registro/Resolución/Revisión Manual** (`/reg-res-rev-manual`)
   - Visualización de eventos sísmicos no revisados
   - Selección y revisión de eventos
   - Modificación de datos de eventos sísmicos
   - Visualización de mapas con ubicación de eventos

3. **Resultado de Revisión** (`/resultado-revision`)
   - Muestra el resultado de la revisión realizada
   - Confirmación de acciones realizadas

### Componentes Modales

- **Modal de Confirmación**: Para confirmar acciones del usuario
- **Modal de Feedback**: Para mostrar mensajes de éxito o error
- **Modal de Carga de Mapa**: Para mostrar el mapa durante la carga
- **Modal de Modificación ES**: Para modificar datos de eventos sísmicos

### Servicios

- **ServiceES**: Servicio para comunicación con el backend
  - Obtener eventos sísmicos no revisados
  - Seleccionar evento
  - Enviar resultado de selección

## 📚 Recursos Adicionales

Para más información sobre el uso de Angular CLI, incluyendo referencias detalladas de comandos, visita la página [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).

## 📝 Notas

- Este proyecto utiliza componentes standalone de Angular
- El backend debe estar corriendo en `http://localhost:8080` para que la aplicación funcione correctamente
- La aplicación está configurada para SSR (Server-Side Rendering)
