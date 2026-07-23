# FODA — Sistema de Gestión de Cuentas Críticas por Cobrar
*Actualizado tras la ronda de arreglos: sincronización con Supabase, vinculación automática por código, balance familiar, CRUD de Reporte Mensual, y CRUD de actividades.*

## Fortalezas

- **Núcleo de negocio completo y probado**: dashboard con semáforo de mora, Reporte Mensual con CRUD completo (crear, editar, eliminar), abonos con fecha, actividades con costo y estado de pago (ahora también con CRUD completo), historial de balances.
- **Base de datos real y compartida**: Supabase conectado de fábrica — cualquier dispositivo se sincroniza solo, sin configuración manual. Probado de punta a punta con dos dispositivos simultáneos.
- **Guardado con fusión segura**: dos personas guardando casi al mismo tiempo ya no se pisan los cambios.
- **Reimportación sin duplicar**: subir el mismo Reporte Mensual dos veces actualiza en vez de duplicar, y no rompe los abonos ya registrados.
- **Robustez ante datos imperfectos**: si un código de estudiante no coincide con ninguno del sistema, el registro se importa igual (con el nombre/familia del archivo) en vez de perderse, marcado claramente como "No vinculado".
- **Vinculación automática por código**: familias y estudiantes con el mismo código se conectan solos, incluso reparando datos cargados antes de este arreglo.
- **Balance familiar agregado**: cuando una familia tiene varios estudiantes, se ve la deuda total sumada, no solo la de uno a la vez.
- **Vista de familias en acordeón**: la lista principal ahora agrupa por familia, no por matrícula individual — más fiel a cómo opera el negocio.
- **Seguridad razonable para lo que es**: login obligatorio, bloqueo por intentos fallidos, cierre por inactividad, auditoría completa, "vaciar todo"/"reiniciar usuarios" protegidos y con confirmación por texto.
- **Respaldo/restauración real**: exportar e importar todos los datos en un clic, sin duplicar ni perder relaciones.

## Debilidades

1. **Historial de Seguimiento sigue siendo pasivo** (a propósito, pendiente por decisión tuya) — no tiene acción propia, solo mira lo que ya pasó en otro lado.
2. **No hay generación automática del mes siguiente.** Cada periodo hay que importarlo o crearlo a mano — el sistema no "hace rodar" la mora solo de un mes a otro.
3. **No hay CRUD completo para Familias y Estudiantes a nivel de registro** — se pueden crear y editar, pero no hay botón para *eliminar* una familia o un estudiante completo desde la lista principal (sí se puede eliminar una cuenta, un abono o una actividad, pero no el registro maestro del estudiante/familia).
4. **No hay recordatorios proactivos** más allá del aviso pasivo del Dashboard ("sin seguimiento reciente") — no hay notificaciones automáticas por correo/WhatsApp.
5. **La seguridad es de flujo de trabajo, no infranqueable** — cualquiera con el archivo y herramientas de desarrollador podría, en teoría, saltarse el login. Aceptable para un equipo de confianza; no para exponer datos muy sensibles públicamente sin el paso a Supabase Auth + RLS (documentado como "Fase 2" pendiente).
6. **Calidad de datos depende de la fuente original** — si el archivo maestro de estudiantes tiene códigos de familia que no existen en el archivo de familias (esto pasó en tus propios archivos: 268 códigos huérfanos), esos estudiantes quedan sin vincular hasta corregirlo.

~~7. Contable tenía permiso de eliminar cuentas y actividades, igual que Administrador.~~ **Resuelto**: ahora solo Administrador puede eliminar registros (cuentas críticas, actividades). Contable conserva permiso de editar, pero no de borrar — reforzado tanto ocultando el botón como dentro de la función que ejecuta la acción.

## Oportunidades

- Agregar el CRUD faltante de Familias/Estudiantes (eliminar registros maestros) es un cambio acotado y de bajo riesgo — se puede hacer en la próxima ronda.
- Automatizar el "rodado" mensual de mora ahorraría el paso manual de reimportar cada mes.
- Migrar a Supabase Auth + RLS (Fase 2) daría seguridad real por fila, no solo por interfaz.
- Notificaciones automáticas (WhatsApp/correo) para seguimientos vencidos aumentarían la tasa de cobro.

## Amenazas

- Si se sigue creciendo en funcionalidad sin una capa de pruebas automatizada permanente (hasta ahora se ha probado manualmente en cada ronda), el riesgo de regresión aumenta con el tiempo.
- Datos maestros incompletos (familias sin definir, códigos huérfanos) pueden generar una falsa sensación de "está funcionando" cuando en realidad hay deuda sin vincular a ninguna familia real.
- Dependencia de que el archivo de origen (tu sistema anterior / PDF / Excel) mantenga códigos consistentes — cualquier cambio de formato ahí rompe la coincidencia de códigos aquí.
