<script setup>
import { ref, reactive, onMounted } from "vue";
import Swal from "sweetalert2";

import { getEmpleados } from "../api/apiEmpleados";
import {
  getTareas,
  addTarea,
  updateTarea,
  deleteTarea
} from "../api/apiTareas";

// ESTADOS
const tareas = ref([]);
const empleados = ref([]);

// FORMULARIO
const form = reactive({
  id: null,
  titulo: "",
  descripcion: "",
  estado: "",
  prioridad: "media",
  empleadoId: "",
  _empleadoValido: null
});

// =========================
// CARGAR DATOS INICIALES
// =========================
onMounted(() => cargarDatos());

async function cargarDatos() {
  Swal.showLoading();
  try {
    empleados.value = await getEmpleados();
    tareas.value = await getTareas();
  } catch (e) {
    Swal.fire("Error", e.message, "error");
  } finally {
    Swal.close();
  }
}

// =========================
// VALIDAR EMPLEADO POR ID
// =========================
function buscarEmpleado() {
  if (!form.empleadoId) {
    Swal.fire("Error", "Debes introducir un ID", "error");
    return;
  }

  const emp = empleados.value.find(e => e.id === form.empleadoId);

  if (emp) {
    form._empleadoValido = true;
  } else {
    form._empleadoValido = false;
    Swal.fire("Empleado no encontrado", "Ese ID no existe", "error");
    form.empleadoId = "";
  }
}

// =========================
// AÑADIR O EDITAR TAREA
// =========================
async function addOrUpdate() {
  if (!form.titulo) {
    Swal.fire("Error", "El título es obligatorio", "error");
    return;
  }
  if (!form.estado) {
    Swal.fire("Error", "El estado es obligatorio", "error");
    return;
  }
  if (!form.empleadoId) {
    Swal.fire("Error", "El empleado es obligatorio", "error");
    return;
  }

  const tareaData = {
    titulo: form.titulo,
    descripcion: form.descripcion,
    estado: form.estado,
    prioridad: form.prioridad,
    empleadoId: form.empleadoId
  };

  Swal.showLoading();

  try {
    if (form.id === null) {
      // NUEVA TAREA
      await addTarea({ ...tareaData, id: crypto.randomUUID() });
    } else {
      // EDITAR TAREA
      await updateTarea(form.id, tareaData);
    }

    await cargarDatos();
    resetForm();
  } catch (e) {
    Swal.fire("Error", e.message, "error");
  } finally {
    Swal.close();
  }
}

// =========================
// CARGAR TAREA EN FORMULARIO
// =========================
function selTarea(t) {
  form.id = t.id;
  form.titulo = t.titulo;
  form.descripcion = t.descripcion;
  form.estado = t.estado;
  form.prioridad = t.prioridad;
  form.empleadoId = t.empleadoId;
  form._empleadoValido = true;
}

// =========================
// ELIMINAR TAREA
// =========================
async function delTarea(id) {
  Swal.showLoading();
  try {
    await deleteTarea(id);
    await cargarDatos();
  } catch (e) {
    Swal.fire("Error", e.message, "error");
  } finally {
    Swal.close();
  }
}

// =========================
// RESET FORM
// =========================
function resetForm() {
  form.id = null;
  form.titulo = "";
  form.descripcion = "";
  form.estado = "";
  form.prioridad = "media";
  form.empleadoId = "";
  form._empleadoValido = null;
}
</script>


<template>
  <div class="tareas">

    <h2>Gestión de tareas</h2>

    <!-- ================= FORMULARIO ================= -->
    <form class="form" @submit.prevent="addTarea">

      <h3>{{ form.id ? "Editar tarea" : "Nueva tarea" }}</h3>

      <div class="campo">
        <label>Título *</label>
        <input v-model="form.titulo" type="text" class="input-titulo" />
      </div>

      <div class="campo">
        <label>Descripción</label>
        <textarea v-model="form.descripcion" class="input-desc"></textarea>
      </div>

      <div class="campo">
        <label>Estado *</label>
        <select v-model="form.estado" class="input-estado">
          <option value="">Seleccione...</option>
          <option value="pendiente">Pendiente</option>
          <option value="en_proceso">En proceso</option>
          <option value="finalizada">Finalizada</option>
        </select>
      </div>

      <div class="campo">
        <label>Prioridad</label>
        <select v-model="form.prioridad" class="input-prioridad">
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>
      </div>

      <div class="campo campo-empleado">
        <label>ID Empleado *</label>

        <div class="empleado-busqueda">
          <input
            v-model="form.empleadoId"
            type="text"
            class="input-empleado"
            :class="{
              valido: form._empleadoValido === true,
              invalido: form._empleadoValido === false
            }"
          />
          <button type="button" class="btn-mini" @click="buscarEmpleado">🔎</button>
        </div>
      </div>

      <div class="botonera">
        <button type="submit" class="btn-primario">
          {{ form.id ? "Guardar" : "Añadir" }}
        </button>
        <button type="button" class="btn-secundario" @click="resetForm">Limpiar</button>
      </div>

    </form>

    <!-- ================= LISTADO ================= -->
    <h3>Listado de tareas</h3>

    <div class="lista">
      <div
        class="tarea"
        v-for="t in tareas"
        :key="t.id"
        :class="t.estado"
      >
        <p class="titulo">{{ t.titulo }}</p>
        <p class="desc">{{ t.descripcion }}</p>
        <p class="estado">Estado: {{ t.estado }}</p>
        <p class="prioridad">Prioridad: {{ t.prioridad }}</p>

        <p class="empleado">
          Empleado:
          {{
            empleados.find(e => e.id === t.empleadoId)?.nombre || "Desconocido"
          }}
        </p>

        <div class="acciones">
          <button class="btn-mini" @click="selTarea(t)">Editar</button>
          <button class="btn-mini eliminar" @click="delTarea(t.id)">Eliminar</button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.tareas {
  max-width: 1000px;
  margin: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* FORMULARIO */
.form {
  display: grid;
  gap: 0.6rem;
  background: #f2f2f2;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  width: fit-content;
  min-width: 350px;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.input-titulo {
  width: 260px;
}

.input-desc {
  width: 300px;
  height: 70px;
}

.input-estado {
  width: 180px;
}

.input-prioridad {
  width: 150px;
}

.campo-empleado {
  margin-top: 0.5rem;
}

.empleado-busqueda {
  display: flex;
  gap: 0.4rem;
  align-items: center;
}

.input-empleado {
  width: 100px;
}

.valido {
  background: #fff3b0;
}

.invalido {
  background: #ffb3b3;
}

.botonera {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.btn-primario,
.btn-secundario {
  padding: 0.35rem 0.8rem;
  font-size: 0.9rem;
  cursor: pointer;
  border-radius: 6px;
  border: none;
}

.btn-primario {
  background: #3498db;
  color: white;
}

.btn-secundario {
  background: #ccc;
}

/* LISTADO */
.lista {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 1rem;
}

.tarea {
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

/* COLORES POR ESTADO */
.pendiente {
  border-left: 6px solid #e74c3c;
}

.en_proceso {
  border-left: 6px solid #f1c40f;
}

.finalizada {
  border-left: 6px solid #2ecc71;
}

.titulo {
  font-weight: bold;
  font-size: 1.1rem;
}

.acciones {
  margin-top: 0.5rem;
  display: flex;
  gap: 0.4rem;
}

.btn-mini {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  cursor: pointer;
  border-radius: 5px;
  border: none;
  background: #eee;
}

.eliminar {
  background: #c0392b;
  color: white;
}
</style>