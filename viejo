# Arquitectura y Sostenibilidad — Cuentas Críticas por Cobrar

Este documento explica, sin rodeos, qué tan robusto es el sistema hoy, cuáles son sus límites reales, y cómo conectar la base de datos real (Supabase) que ya viene integrada.

---

## 1. Qué se reforzó en esta versión

| Área | Antes | Ahora |
|---|---|---|
| Acceso | Selector libre "Trabajando como" (sin clave) | Login obligatorio (correo + contraseña) |
| Cuentas por defecto | 3 cuentas de fábrica con contraseñas públicas | Asistente de primer uso: tú creas el Administrador real |
| Intentos fallidos | Sin límite | Bloqueo automático tras 5 intentos, por 5 minutos |
| Sesión | No expiraba | Cierre automático tras 30 minutos de inactividad |
| Almacenamiento local | `localStorage` (≈5-10 MB, sin estructura) | **IndexedDB** (mucha mayor capacidad, estructurado), con `localStorage` como respaldo adicional |
| Base de datos real | No existía | **Supabase conectable** desde el módulo "Base de Datos (Supabase)" — ver sección 3 |
| Sincronización entre usuarios | Sobrescritura completa (riesgo de perder cambios ajenos) | **Guardado con fusión segura**: se relee la versión más reciente antes de escribir y se fusiona por clave, para no perder lo que otra persona guardó casi al mismo tiempo |
| Coincidencia de códigos | Sensible a mayúsculas/espacios (podía duplicar registros) | Normalizada: `FAM-0001` y `fam-0001` se tratan como el mismo código |
| Trazabilidad | Ninguna | Módulo de **Auditoría**: quién hizo qué y cuándo |
| Autorización | Solo ocultaba botones en la interfaz | Guardia central: ninguna función que modifica datos se ejecuta sin una sesión válida |

### Hallazgos de la revisión de importación y sincronización

Antes de integrar Supabase se auditó el código existente y se corrigieron dos problemas reales:

1. **Pérdida silenciosa de datos ("lost update")**: en modo nube compartida, si dos personas guardaban casi al mismo tiempo, el sistema sobrescribía el arreglo completo y uno de los dos cambios podía desaparecer sin aviso. Se corrigió con una función de fusión (`mergeYGuardar`) que vuelve a leer la versión más reciente justo antes de escribir y combina los cambios por clave (id o código), en vez de sobrescribir a ciegas. Se probó simulando dos "dispositivos" guardando registros distintos al mismo tiempo: ambos sobrevivieron.
2. **Duplicados por mayúsculas/espacios**: un código importado como `fam-0001` no coincidía con el registro existente `FAM-0001`, generando un duplicado en vez de actualizar. Se corrigió normalizando todos los códigos a mayúsculas y espacios recortados, tanto al importar como al capturar manualmente.

También se blindó la lectura de Excel: las celdas que Excel guarda como número (perdiendo ceros a la izquierda, por ejemplo) ahora se fuerzan a texto antes de compararse, para evitar falsos "no existe" al importar.

## 2. El límite que ninguna app 100% estática puede resolver

Esta aplicación es un solo archivo HTML. Sin un backend propio, cualquier persona con el archivo puede abrir las herramientas de desarrollador de su navegador y leer, en texto plano, todo lo que la página tiene cargado en memoria — sin importar cuántos candados de JavaScript se construyan encima. Conectar Supabase (sección 3) resuelve la parte de **sincronización real entre dispositivos** y **autenticación server-side**, pero el frontend sigue siendo HTML público: la seguridad fina (quién puede ver o editar cada fila) debe reforzarse con las reglas de Row Level Security de Postgres, no solo confiar en lo que oculta la interfaz.

## 3. Supabase — ya integrado (Fase 1: sincronización de datos)

La app ahora tiene un módulo **"Base de Datos (Supabase)"** (solo Administrador) que conecta un proyecto de Supabase real como fuente de datos, por encima de la Nube de Claude.ai / IndexedDB / localStorage. Se implementó hablando directamente con la API REST de Supabase (`fetch`, sin librerías externas), así que no depende de ningún CDN.

**Cómo se guardan los datos hoy con Supabase conectado:** una sola tabla `kv_store` (clave/valor) que replica exactamente lo que ya guardaba la app — un cambio de bajo riesgo, sin tocar cada función de negocio una por una. Esto ya te da lo más urgente: **una base de datos real, compartida de verdad entre todos los dispositivos que se conecten al mismo proyecto**, con guardado verificado (se prueba escribiendo y releyendo antes de confirmar) y con la fusión segura descrita arriba también aplicada aquí.

Esto se probó de punta a punta simulando dos "computadoras" distintas conectadas al mismo proyecto: una crea una familia, y la otra la ve aparecer de inmediato sin recargar nada manualmente — la sincronización real funciona.

### Cómo conectar tu proyecto (5 minutos)
1. Crea una cuenta gratuita en **supabase.com** y un proyecto nuevo.
2. En el editor SQL de tu proyecto, ejecuta:
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
   (Esta política deja la tabla abierta a quien tenga la anon key — adecuado para empezar rápido. Antes de manejar datos muy sensibles, ver la Fase 2 abajo para restringirlo por rol.)
3. Copia tu **Project URL** y tu **anon public key** (Settings → API).
4. Dentro de la app, ve a **"Base de Datos (Supabase)"**, pégalos, dale "Probar conexión" y luego "Guardar y activar".
5. **Importante si ya tenías datos cargados**: la app te avisará antes de activar. Exporta un respaldo (.json) desde "Respaldo de Datos" ANTES de conectar, y restáuralo DESPUÉS de conectar — así migras todo de una vez a Supabase.
6. Repite el paso 4 en cada dispositivo/computadora de tu equipo, apuntando al mismo proyecto.

### Fase 2 (pendiente, opcional): esquema relacional completo + autenticación real de Supabase

Lo de arriba te da sincronización real de datos, pero el login sigue siendo el sistema local de la app (con su propio hash de contraseñas, no visible a Supabase). El siguiente nivel —recomendado antes de manejar datos muy sensibles a gran escala— es migrar a tablas relacionales reales (una por entidad, no un solo blob) con Row Level Security por rol, y mover también el login a Supabase Auth (contraseñas verificadas en el servidor, sesiones con tokens firmados). El esquema para ese paso:

```sql
-- Ejecutar en el editor SQL de tu proyecto Supabase (Fase 2, opcional)

create table familias (
  codigo text primary key,
  responsable text not null,
  tel1 text, tel2 text, correo text, direccion text,
  estado text default 'Activo'
);

create table estudiantes (
  codigo text primary key,
  nombre text not null,
  codigo_familia text references familias(codigo),
  nivel text, grado text,
  internado text default 'No',
  internado_inicio date, internado_fin date,
  estado text default 'Activo'
);

create table cuentas (
  id uuid primary key default gen_random_uuid(),
  codigo_estudiante text references estudiantes(codigo),
  periodo text not null,
  meses_adeudados int default 0,
  balance_anio_anterior numeric default 0,
  balance numeric default 0,
  fecha_ultimo_pago date, monto_ultimo_pago numeric,
  estado text default 'Pendiente',
  responsable text,
  fecha_ultima_gestion date, proximo_seguimiento date,
  observaciones text
);

create table abonos (
  id uuid primary key default gen_random_uuid(),
  codigo_estudiante text references estudiantes(codigo),
  cuenta_id uuid references cuentas(id),
  fecha date not null, monto numeric not null,
  observaciones text, registrado_por text
);

create table seguimientos (
  id uuid primary key default gen_random_uuid(),
  fecha date not null,
  codigo_estudiante text references estudiantes(codigo),
  responsable text, medio text, resultado text,
  proxima_gestion date, observaciones text, creado_por text
);

create table auditoria (
  id uuid primary key default gen_random_uuid(),
  fecha timestamptz default now(),
  usuario text, accion text, detalle text
);

-- Perfil de usuario con rol, ligado a la autenticación de Supabase
create table perfiles (
  id uuid primary key references auth.users(id),
  nombre text, rol text check (rol in ('admin','contable','auxiliar'))
);

-- Ejemplo de regla de seguridad real (Row Level Security):
alter table cuentas enable row level security;
create policy "Todos los usuarios autenticados pueden leer"
  on cuentas for select using (auth.role() = 'authenticated');
create policy "Solo admin/contable pueden editar"
  on cuentas for update using (
    exists (select 1 from perfiles where id = auth.uid() and rol in ('admin','contable'))
  );
```

Este paso es una reescritura más profunda de la capa de datos (una tabla por entidad, en vez de un blob) y del login. No se hizo en esta entrega porque conviene probarlo primero contra tu proyecto real ya conectado en Fase 1 — vuelve a este chat cuando quieras dar ese salto y lo construimos juntos con tus credenciales reales.

## 4. Cómo operar de forma segura con lo que hay hoy

- Conecta Supabase (Fase 1, arriba) si tu equipo trabaja desde distintos dispositivos — es la forma correcta de tener todos los datos sincronizados de verdad.
- Si no conectas Supabase, usa la app dentro de Claude.ai para que el equipo comparta datos automáticamente (nube de Claude.ai), o exporta respaldos (.json) con frecuencia desde "Respaldo de Datos" si trabajas desde un solo dispositivo.
- Revisa el módulo de **Auditoría** periódicamente.
- No compartas el archivo `.html` con datos reales cargados fuera de tu equipo de confianza.

