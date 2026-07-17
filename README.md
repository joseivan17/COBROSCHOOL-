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

## Novedad: el Reporte Mensual ya no deja campos en blanco

**Problema resuelto**: al importar el Reporte Mensual, si el "Codigo_Estudiante" del archivo no coincidía con ningún estudiante ya registrado (por diferencias de código, o porque aún no se había importado ese estudiante), el registro de deuda se perdía por completo o se mostraba sin nombre ni familia.

**Ahora:**
- El registro **siempre se importa**, aunque el estudiante no esté formalmente vinculado — se muestra con el nombre y familia que traía el archivo, y una etiqueta clara **"⚠ No vinculado"** para que sepas exactamente cuáles hay que revisar.
- Si marcas "Crear automáticamente estudiantes faltantes", se crean y vinculan de una vez, usando los datos del archivo.
- Los **responsables** que traiga el archivo y todavía no existan en el catálogo se agregan solos — ya aparecen disponibles en el desplegable de "Responsable" sin tener que crearlos a mano en Catálogos.

Se probó exactamente el escenario que reportaron: un código de estudiante que no existe en el sistema, con la casilla de creación automática desmarcada — el registro se importa igual, con el nombre y la familia visibles, marcado como no vinculado, y el responsable nuevo del archivo aparece de inmediato en el desplegable.

## Arreglos anteriores incluidos
- Vista de familias con acordeón (en vez de matrícula de estudiante como código principal).
- Balance familiar agregado (suma de todos los hijos de una familia).
- Vinculación automática por código coincidente (y auto-reparación de datos antiguos).
- Vaciado de datos y eliminar datos de muestra funcionan de verdad en modo compartido (Supabase).

## Publicar con GitHub Pages
Settings → Pages → rama `main` → carpeta `/ (root)`. Sube `app/index.html` de nuevo para que los cambios tomen efecto.

Detalle completo en `ARQUITECTURA_Y_ESCALABILIDAD.md`.
