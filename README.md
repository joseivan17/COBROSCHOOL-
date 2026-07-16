# COBROSCHOOL — Sistema de Gestión de Cuentas Críticas por Cobrar

Sistema web para dar seguimiento a cuentas críticas por cobrar, con login, roles, auditoría, base de datos Supabase de fábrica, actividades con costo, CRUD completo en Reporte Mensual, y respaldo de datos.

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

## Novedades de esta versión (arreglos del FODA)

1. **Actividades pendientes visibles en Reporte Mensual**: nueva columna "Activ. pend." muestra cuántas actividades (Robótica, Inglés, etc.) debe cada estudiante y el monto, sin tener que entrar a la ficha.
2. **Cuentas ya pagadas dejan de aparecer solas**: el Reporte Mensual ahora oculta por defecto las cuentas con balance pendiente en $0 (checkbox "Mostrar cuentas ya saldadas/regularizadas" para verlas si se necesita). Al registrar un abono que salda el balance por completo, el estado cambia automáticamente a "Regularizado".
3. CRUD completo (botón Editar), cancelar importaciones, y vaciar todos los datos (de una entrega anterior).

## Publicar con GitHub Pages
Settings → Pages → rama `main` → carpeta `/ (root)`. Sube `app/index.html` de nuevo si ya tenías una versión anterior.

Detalle completo en `ARQUITECTURA_Y_ESCALABILIDAD.md`.
