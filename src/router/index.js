import Acerca from "../components/Acerca.vue"
import Empleados from "../components/Empleados.vue"
import Estadisticas from "../components/Estadisticas.vue"
import Inicio from "../components/Inicio.vue"
import Tareas from "../components/Tareas.vue"
import { createRouter, createWebHistory } from "vue-router"

const routes = [
    {
        path: "/",
        name: "Inicio",
        component: Inicio
    },
    {
        path: "/empleados",
        name: "Empleados",
        component: Empleados
    },
    {
        path: "/tareas",
        name: "Tareas",
        component: Tareas
    },
    {
        path: "/estadisticas",
        name: "Estadisticas",
        component: Estadisticas
    },
    {
        path: "/about",
        name: "Acerca",
        component: Acerca
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router