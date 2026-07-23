# COBROSCHOOL — Sistema de Gestión de Cuentas Críticas por Cobrar

Sistema web para dar seguimiento a cuentas críticas por cobrar, con login, roles con permisos afinados, auditoría, base de datos Supabase de fábrica, actividades con costo y CRUD completo, CRUD completo en Reporte Mensual, exportación reimportable sin duplicar, vinculación automática por código, balance familiar agregado, historial de seguimiento accesible desde la ficha, y respaldo de datos.

## Estructura
```
├── app/index.html                    → Aplicación principal
├── landing/index.html                → Landing page
├── plantillas/                       → Plantillas Excel de importación
├── ARQUITECTURA_Y_ESCALABILIDAD.md
├── FODA_actualizado.md
└── README.md
```

## ⚠️ No le des doble clic a app/index.html
Ábrelo publicado con GitHub Pages o dentro de Claude.ai.

## Novedad: Historial de Seguimiento arreglado y con exportación

**Lo que encontré**: la única forma de registrar una gestión era desde el Reporte Mensual, fila por fila — no había ningún botón para hacerlo directamente desde la ficha de un estudiante. Si intentabas registrar un seguimiento desde ahí, simplemente no existía esa opción.

**Arreglado:**
- Nuevo botón **"+ Registrar gestión"** directamente en la ficha de cada estudiante — funciona incluso si el estudiante todavía no tiene ninguna cuenta crítica cargada.
- Nueva columna **"Familia"** en el Historial de Seguimiento, para identificar de un vistazo a qué familia pertenece cada gestión.
- Nuevo botón **"⭳ Exportar historial"** — descarga en CSV exactamente lo que estás viendo en pantalla (respeta los filtros de responsable, medio, resultado y búsqueda aplicados).

Se probó registrando una gestión desde la ficha (con y sin cuenta activa) y confirmando que aparece correctamente en Historial de Seguimiento, y se verificó el contenido real del archivo exportado.

## Arreglos anteriores incluidos
- Solo Administrador puede eliminar registros; Contable puede editar pero no borrar.
- CRUD completo de Actividades en la ficha del estudiante.
- Reimportar el Reporte Mensual ya no duplica registros ni pierde abonos.
- Vista de familias con acordeón, balance familiar agregado, vinculación automática por código.

## Publicar con GitHub Pages
Settings → Pages → rama `main` → carpeta `/ (root)`. Sube `app/index.html` de nuevo para que los cambios tomen efecto.

Detalle completo en `ARQUITECTURA_Y_ESCALABILIDAD.md` y `FODA_actualizado.md`.
