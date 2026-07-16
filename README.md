# COBROSCHOOL — Sistema de Gestión de Cuentas Críticas por Cobrar

Sistema web para dar seguimiento a cuentas críticas por cobrar, con login, roles, auditoría, base de datos Supabase de fábrica, actividades con costo, CRUD completo en Reporte Mensual, exportación reimportable, vinculación automática por código, balance familiar agregado, y respaldo de datos.

## Estructura
```
├── app/index.html                    → Aplicación principal
├── landing/index.html                → Landing page
├── plantillas/                       → Plantillas Excel de importación
├── ARQUITECTURA_Y_ESCALABILIDAD.md
└── README.md
```

## ⚠️ No le des doble clic a app/index.html
Ábrelo publicado con GitHub Pages o dentro de Claude.ai.

## Novedad: "Estudiantes / Familias" ahora muestra Familias primero

La lista principal del módulo cambió por completo:
- Antes: una fila por estudiante, con su matrícula individual como "Código".
- Ahora: una fila por **familia** (con el código de familia, el responsable, y cuántos estudiantes tiene). Al hacer clic, se despliega la lista de estudiantes de esa familia (con sus nombres y matrículas propias). Al hacer clic en un estudiante, se abre su ficha completa como antes (con el nuevo "Balance familiar" incluido).

Esto resuelve la confusión de "la columna de código trae la matrícula del estudiante" — ahora esa columna, en la vista principal, es el código de la **familia**; la matrícula del estudiante solo aparece al desplegar, donde tiene sentido verla.

La búsqueda también funciona sobre ambos niveles: buscar el nombre de un estudiante despliega automáticamente su familia.

## Arreglos anteriores incluidos
- Balance familiar agregado (suma de todos los hijos de una familia).
- Vinculación automática por código coincidente (y auto-reparación de datos antiguos).
- Vaciado de datos y eliminar datos de muestra funcionan de verdad en modo compartido (Supabase).
- Reporte Mensual exportable/reimportable con Familia y demás columnas informativas.
- CRUD completo en Reporte Mensual, cancelar importaciones, actividades con costo/pago.

## Publicar con GitHub Pages
Settings → Pages → rama `main` → carpeta `/ (root)`. Sube `app/index.html` de nuevo para que los cambios tomen efecto.

Detalle completo en `ARQUITECTURA_Y_ESCALABILIDAD.md`.
