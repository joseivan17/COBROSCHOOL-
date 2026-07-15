# COBROSCHOOL — Sistema de Gestión de Cuentas Críticas por Cobrar

Sistema web para dar seguimiento a cuentas críticas por cobrar (familias/clientes en mora): importación desde Excel/CSV, dashboard con semáforo de mora, abonos con fecha, **login obligatorio con roles y auditoría**, **base de datos real conectable (Supabase)**, respaldo/restauración de datos, e historial completo de seguimiento.

## Estructura del repositorio

```
├── app/
│   └── index.html                    → Aplicación principal
├── landing/
│   └── index.html                    → Landing page de presentación (con contacto)
├── plantillas/
│   ├── Plantilla_Familias_Estudiantes.xlsx
│   └── Plantilla_Reporte_Mensual_Cuentas_Criticas.xlsx
├── ARQUITECTURA_Y_ESCALABILIDAD.md   → FODA, límites reales, y guía completa de Supabase
└── README.md
```

## Primer uso

Al abrir `app/index.html` por primera vez en un dispositivo, la app pregunta si:
- **Ya existe una base de datos Supabase configurada por tu equipo** → conéctate ahí para ver e iniciar sesión con las cuentas reales que ya existen, o
- **Es la primera vez que se usa el sistema** → crea la cuenta del Administrador.

No hay contraseñas de fábrica conocidas.

## ⚠️ Cómo abrir `app/index.html`

**No le des doble clic.** Abierto como `file://...`, la mayoría de navegadores bloquean el guardado de datos. Ábrelo publicado con **GitHub Pages** (abajo) desde el link `https://...`, o dentro de Claude.ai como artifact.

## Publicar con GitHub Pages (gratis)

1. **Settings → Pages** en este repositorio.
2. Source: rama `main`, carpeta `/ (root)` o la que prefieras.
3. GitHub te da una URL pública. Abre la app desde ahí.

## Subir estos archivos a tu repositorio

**Desde la web de GitHub:** "Add file" → "Upload files" → arrastra `app/`, `landing/`, `plantillas/` y los `.md`. **Si ya tenías una versión subida, tienes que volver a subir `app/index.html` para reemplazarla.**

**Con git:**
```bash
git clone https://github.com/TU-USUARIO/TU-REPO.git
cd TU-REPO
# copia aquí las carpetas de este paquete (reemplazando lo que ya exista)
git add .
git commit -m "Sistema de cuentas críticas con login, auditoría y Supabase"
git push origin main
```

## Conectar Supabase (base de datos real)

1. Crea proyecto gratis en supabase.com.
2. SQL Editor → New query → pega y ejecuta:
   ```sql
   create table kv_store (
     key text primary key,
     value jsonb,
     updated_at timestamptz default now()
   );
   alter table kv_store enable row level security;
   create policy "Acceso de lectura y escritura" on kv_store
     for all using (true) with check (true);
   ```
3. Settings → API → copia el **Project URL** y la **anon public key**.
4. Dentro de la app (ya logueado como Administrador) → **"Base de Datos (Supabase)"** → pega ambos → "Probar conexión" → "Guardar y activar". Su cuenta de Administrador se traslada automáticamente a la base compartida.
5. **En cada dispositivo adicional del equipo**: en la pantalla de inicio (antes de crear ninguna cuenta), hacer clic en **"¿Su equipo ya tiene una base de datos configurada? Conectar"**, pegar el mismo Project URL y anon key, y ya podrán iniciar sesión con las cuentas reales del equipo — sin crear cuentas duplicadas.

Detalle completo, capturas de dónde hacer clic y la Fase 2 (esquema relacional + RLS por rol) en `ARQUITECTURA_Y_ESCALABILIDAD.md`.

## Arquitectura — resumen

- **Almacenamiento en 5 niveles**, verificado en tiempo real: Supabase (si lo conectas) → Nube de Claude.ai → IndexedDB → localStorage → memoria.
- **Base de datos real (Supabase)**: sincronización probada de punta a punta entre dos dispositivos distintos, incluyendo el flujo de conectarse desde cero sin duplicar cuentas.
- **Guardado con fusión segura**: evita que dos personas guardando casi al mismo tiempo se pisen los cambios.
- **Coincidencia de códigos normalizada**: `FAM-0001` y `fam-0001` se tratan igual.
- **Login obligatorio**: correo + contraseña, bloqueo tras 5 intentos fallidos, cierre por inactividad, recuperación por pregunta de seguridad.
- **Auditoría**: quién hizo qué y cuándo.
- **Roles**: Administrador / Contable / Auxiliar.

## Notas importantes

- **Formulario de contacto** (landing page): sin backend, abre el cliente de correo (`mailto:`). Reemplaza el correo/teléfono de ejemplo por los reales.
- **Datos de muestra**: elimínalos con un clic desde "Respaldo de Datos" antes de cargar información real.
- **Seguridad**: para RLS por rol en Supabase, ver la "Fase 2" en la guía de arquitectura.
