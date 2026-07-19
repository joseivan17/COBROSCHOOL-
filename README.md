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

## Arreglo importante: reimportar el Reporte Mensual ya no duplica

**El bug**: cada vez que se importaba el Reporte Mensual, el sistema siempre creaba un registro nuevo — sin revisar si ya existía uno para ese mismo estudiante y ese mismo periodo. Al subir el mismo archivo dos veces (por ejemplo, con montos corregidos), terminabas con dos filas para la misma familia en el mismo mes, duplicando los totales.

**Ahora**: si ya existe un registro para ese estudiante y periodo, se **actualiza** con los nuevos datos del archivo — nunca se duplica. Además, el `id` interno del registro se conserva, así que **los abonos que ya hubieras registrado contra esa cuenta no se pierden** al reimportar.

Se probó exactamente el escenario reportado: importar el mismo periodo dos veces con datos distintos (resultado: 1 sola fila, con el balance actualizado), y reimportar después de haber registrado un abono (resultado: el abono se mantiene aplicado correctamente al nuevo balance).

## Arreglos anteriores incluidos
- El Reporte Mensual siempre muestra nombre/familia, aunque el estudiante no esté formalmente vinculado ("⚠ No vinculado").
- Los responsables que traiga el archivo se agregan solos al catálogo.
- Vista de familias con acordeón, balance familiar agregado, vinculación automática por código.
- Vaciado de datos y eliminar datos de muestra funcionan de verdad en modo compartido (Supabase).

## Publicar con GitHub Pages
Settings → Pages → rama `main` → carpeta `/ (root)`. Sube `app/index.html` de nuevo para que los cambios tomen efecto.

Detalle completo en `ARQUITECTURA_Y_ESCALABILIDAD.md`.
