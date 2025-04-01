
# 📝 **TODO LIST: El misterio de las tareas desprotegidas** 🔒

Esta es una aplicación de TODO LIST en la que se gestionan tareas de usuarios. Sin embargo, hay algunos problemas y vulnerabilidades que necesitan ser corregidos para asegurar el funcionamiento correcto y la protección de los datos.

Tu objetivo es identificar y resolver los problemas en el código relacionados con la **autenticación**, **autorización** y la correcta asignación de permisos para gestionar las tareas.

---

## 🎯 **Objetivos**

Tu misión consiste en completar los siguientes objetivos:

1. **Protección de las tareas por usuario**: Actualmente, cualquier usuario puede ver el detalle de una tarea, incluso si no le pertenece. Deberás corregir esto para asegurarte de que **solo el propietario** de una tarea pueda verla.

2. **Restringir la edición de tareas**: Actualmente, cualquier usuario puede editar las tareas de otros. Corrige esta funcionalidad para que solo los propietarios puedan editar sus propias tareas.

3. **Autenticación con JWT**: La autenticación mediante JWT funciona, pero no se verifica adecuadamente en algunos endpoints. Asegúrate de que todas las rutas sensibles estén correctamente protegidas y requieran un **token JWT** válido.

4. **Mejorar el manejo de errores**: Debes asegurarte de que, cuando se intente acceder o editar una tarea sin los permisos necesarios, el sistema devuelva el error adecuado (p. ej., **403 Forbidden**). Explora también otros errores que puedan ocurrir por casos extremos.

5. **Mejorar logs y mensajes de error**: Añade mensajes de error y logs más descriptivos para facilitar la depuración y el mantenimiento del código.

6. **Auditoría general de seguridad**: Realiza una auditoría general del código y busca cualquier otro posible fallo de seguridad o funcional que debas corregir.

> IMPORTANTE: No tomes estos objetivos como los únicos a cumplir. Todas las mejoras que puedas aportar para asegurar la seguridad y el correcto funcionamiento de la aplicación serán bienvenidas.
---

## 🚀 **Primeros pasos**

Sigue estos pasos para levantar el proyecto y trabajar en las correcciones necesarias:

1. **Realiza un Fork del repositorio**  
   Primero, haz un fork del proyecto desde el repositorio original. Puedes hacerlo directamente desde la interfaz de GitHub haciendo clic en el botón de "Fork".

2. **Clona el repositorio en tu máquina local**  
   Clona el repositorio forkeado:
   ```bash
   git clone https://github.com/tu-usuario/todo-list-bug.git
   cd todo-list-bug
   ```

3. **Instala las dependencias**  
   Asegúrate de tener instaladas todas las dependencias necesarias ejecutando:
   ```bash
   yarn install
   ```

4. **Inicializa la base de datos**
   Una vez que hayas instalado las dependencias ejecuta el comando para inicializar la base de datos:
   ```bash
   yarn migrations:run
   ```

5. **Arranca el servidor**  
   Inicia el proyecto con:
   ```bash
   yarn start
   ```

6. **Resuelve los bugs**  
   Identifica y resuelve los problemas mencionados en los objetivos y cualquier otro que encuentres.

---

¡Listo! Ahora puedes empezar a trabajar en los errores y enviar tu contribución para asegurar que la aplicación funcione correctamente y sin vulnerabilidades.


---
# Respuesta por Fernando Valero

## Problemas de seguridad encontrados:

- No se verifica la propiedad del usuario en las operaciones sobre tareas
- Vulnerabilidad de inyección SQL en las consultas de tareas
- Faltan protecciones de autenticación en los endpoints de tareas
- No hay validación de entradas al editar tareas
- No se maneja el error de acceso no autorizado
- No hay definiciones de tipo adecuadas para los cuerpos de las solicitudes

