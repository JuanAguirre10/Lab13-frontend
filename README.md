# Sistema de Gestión Académica - Frontend

Aplicación web desarrollada con React para la gestión de estudiantes, cursos y matrículas con interfaz moderna y responsive.

## 🚀 Tecnologías

- **React 18**
- **Axios**
- **CSS3**
- **JavaScript ES6+**

## 🎨 Características

- ✅ Interfaz moderna y responsive
- ✅ Gestión completa de Estudiantes
- ✅ Gestión completa de Cursos
- ✅ Sistema de Matrículas interactivo
- ✅ Filtrado de matrículas por estado
- ✅ Actualización de calificaciones en tiempo real
- ✅ Diseño profesional con animaciones

## 📱 Capturas

### Módulo de Matrículas
- Vista de todas las matrículas
- Filtros por estado (Activo, Completado, Retirado)
- Crear nuevas matrículas
- Actualizar estado y calificaciones

### Módulo de Estudiantes
- Lista de estudiantes con código único
- Crear, editar y eliminar estudiantes
- Ver cantidad de cursos inscritos

### Módulo de Cursos
- Lista de cursos con créditos
- Crear, editar y eliminar cursos
- Ver cantidad de estudiantes matriculados

## 🔧 Instalación Local

### Prerrequisitos

- Node.js 14+
- npm o yarn

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/JuanAguirre10/Lab13-frontend.git
cd Lab13-frontend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar la URL del backend**

Editar los archivos de servicios en `src/services/`:

**StudentService.js, CourseService.js, EnrollmentService.js:**
```javascript
const API_URL = 'http://localhost:8081/api/students'; // Para desarrollo local
// const API_URL = 'https://lab13-student-course-api.onrender.com/api/students'; // Para producción
```

4. **Ejecutar en modo desarrollo**
```bash
npm start
```

La aplicación estará disponible en: `http://localhost:3000`

5. **Compilar para producción**
```bash
npm run build
```

## 📂 Estructura del Proyecto
```
src/
├── components/
│   ├── StudentList.js         # Componente de estudiantes
│   ├── StudentList.css
│   ├── CourseList.js          # Componente de cursos
│   ├── CourseList.css
│   ├── EnrollmentList.js      # Componente de matrículas
│   └── EnrollmentList.css
├── services/
│   ├── StudentService.js      # API de estudiantes
│   ├── CourseService.js       # API de cursos
│   └── EnrollmentService.js   # API de matrículas
├── App.js                     # Componente principal
├── App.css                    # Estilos globales
└── index.js                   # Punto de entrada
```

## 🎯 Funcionalidades Principales

### 1. Gestión de Estudiantes
- ➕ Crear estudiante con código, nombre, apellido y email
- ✏️ Editar información del estudiante
- 🗑️ Eliminar estudiante
- 📊 Ver cursos inscritos

### 2. Gestión de Cursos
- ➕ Crear curso con código, nombre, descripción y créditos
- ✏️ Editar información del curso
- 🗑️ Eliminar curso
- 📊 Ver estudiantes matriculados

### 3. Sistema de Matrículas
- ➕ Matricular estudiante en curso
- 🔄 Cambiar estado (Activo/Completado/Retirado)
- 📝 Registrar calificaciones
- 🔍 Filtrar por estado
- 🗑️ Eliminar matrícula

## 🌐 Despliegue en Render

La aplicación está desplegada en: **https://lab13-frontend.onrender.com**

### Configuración de Despliegue

**Build Command:**
```bash
npm install && npm run build
```

**Publish Directory:**
```
build
```

## 🎨 Paleta de Colores

- **Primario:** `#667eea` (Morado)
- **Secundario:** `#764ba2` (Morado oscuro)
- **Éxito:** `#d4edda` (Verde claro)
- **Alerta:** `#fff3cd` (Amarillo)
- **Error:** `#f8d7da` (Rojo claro)
- **Fondo:** `#f5f6fa` (Gris claro)

## 🔌 Conexión con el Backend

El frontend se comunica con el backend mediante Axios:
```javascript
// Ejemplo de petición GET
StudentService.getAllStudents().then(response => {
    setStudents(response.data);
});

// Ejemplo de petición POST
StudentService.createStudent(formData).then(response => {
    console.log('Estudiante creado:', response.data);
});
```

## 📱 Responsive Design

La aplicación está optimizada para:
- 💻 Desktop (>1024px)
- 📱 Tablet (768px - 1024px)
- 📱 Mobile (<768px)

## 🔄 Estados de Matrícula

| Estado | Descripción | Color |
|--------|-------------|-------|
| **ACTIVE** | Matrícula activa | Verde |
| **COMPLETED** | Curso completado | Azul |
| **DROPPED** | Estudiante retirado | Rojo |

## 👥 Autor

**Juan Aguirre**
- GitHub: [@JuanAguirre10](https://github.com/JuanAguirre10)
