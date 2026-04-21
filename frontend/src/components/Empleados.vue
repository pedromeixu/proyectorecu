<script setup>
  import { ref, reactive, onMounted } from "vue";
  import {
    getEmpleados,
    addEmpleado,
    deleteEmpleado,
    updateEmpleado
  } from "../api/apiEmpleados";

  // Lista reactiva
  const empleados = ref([]);

  // Formulario Reactivo
  const form = reactive({
    id: null,
    nombre: "",
    email: "",
    movil: "",
    puesto: "rrhh"
  });

  const error = ref("");
  const cargando = ref(false);

  // Cargar empleados al iniciar
  onMounted(async () => {
    await cargarEmpleados()
  });

  async function cargarEmpleados() {
    cargando.value = true;
    try {
      empleados.value = await getEmpleados();
    } catch(e) {
      error.value = "Error cargando empleados";
    } finally {
      cargando.value = false;
    }
  }

  // Seleccionar empleado para editar
  function selEmpleado(emp) {
    form.id = emp.id
    form.nombre = emp.nombre
    form.email = emp.email
    form.movil = emp.movil
    form.puesto = emp.puesto
  }

  // Resetear formulario
  function resetForm() {
    form.id = null
    form.nombre = ""
    form.email = ""
    form.movil = ""
    form.puesto = "rrhh"
    error.value = ""
  }

  // Añadir o actualizar empleado
  async function addOrUpdate() {
    error.value = "";

    if (!form.nombre || !form.email) {
      error.value = "Nombre y email son obligatorios";
      return;
    }

    const empleadoData = {
      nombre: form.nombre,
      email:form.email,
      movil: form.movil,
      puesto: form.puesto
    };

    try {
      if (form.id === null) {
        await addEmpleado(empleadoData);
      } else {
        await updateEmpleado(form.id, empleadoData);
      }

      await cargarEmpleados();
      resetForm();
    } catch(e) {
      error.value = "Error guardando empleado";
    }
  }

  // Eliminar empleado
  async function delEmpleado(id) {
    try {
      await deleteEmpleado(id);
      await cargarEmpleados();
    } catch(e) {
      error.value = "Error eliminando empleado";
    }
  }
</script>

<template>
  <div class="empleados">

    <h2>Gestión de empleados</h2>

    <form class="form" @submit.prevent="addOrUpdate">
      <h3>{{ form.id ? "Editar empleado" : "Nuevo empleado" }}</h3>

      <div class="campo">
        <label>Nombre *</label>
        <input v-model="form.nombre" type="text" class="input-nombre" />
      </div>

      <div class="campo">
        <label>Email *</label>
        <input v-model="form.email" type="email" class="input-email" />
      </div>

      <div class="campo">
        <label>Móvil</label>
        <input v-model="form.movil" type="text" class="input-movil" />
      </div>

      <div class="campo">
        <label>Puesto</label>
        <select v-model="form.puesto" class="input-puesto">
          <option value="rrhh">RRHH</option>
          <option value="contabilidad">Contabilidad</option>
          <option value="almacen">Almacén</option>
          <option value="ventas">Ventas</option>
        </select>
      </div>

      <p class="error" v-if="error">{{ error }}</p>

      <div class="botonera">
        <button type="submit" class="btn-primario">
          {{ form.id ? "Guardar" : "Añadir" }}
        </button>

        <button type="button" class="btn-secundario" @click="resetForm">
          Limpiar
        </button>
      </div>
    </form>

    <h3>Listado</h3>

    <p v-if="cargando">Cargando...</p>

    <div class="lista" v-else>
      <div class="empleado" v-for="emp in empleados" :key="emp.id">
        <p class="nombre">{{ emp.nombre }}</p>
        <p class="email">{{ emp.email }}</p>
        <p class="movil">{{ emp.movil }}</p>
        <p class="puesto">Puesto: {{ emp.puesto }}</p>

        <div class="acciones">
          <button class="btn-mini" @click="selEmpleado(emp)">Editar</button>
          <button class="btn-mini eliminar" @click="delEmpleado(emp.id)">Eliminar</button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
  .empleados {
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
    padding: 0.8rem 1rem;     /* antes era más grande */
    border-radius: 8px;
    border: 1px solid #ddd;

    /* Hace que el fondo gris se adapte al contenido */
    width: fit-content;
    min-width: 320px;         /* evita que quede demasiado estrecho */
  }

  .campo {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .input-nombre {
    width: 250px;
  }

  .input-email {
    width: 280px;
  }

  .input-movil {
    width: 150px;
  }

  .input-puesto {
    width: 180px;
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

  .empleado {
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: white;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .nombre {
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

  .error {
    color: red;
    font-size: 0.9rem;
  }
</style>