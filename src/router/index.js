import { createRouter, createWebHistory } from "vue-router"
import HomeView from "../views/HomeView.vue"
import ShowCircle from "../views/ShowCircle.vue"
import RegisterCircleView from "@/views/RegisterCircleView.vue"

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/registerCircle",
    name: "registerCircle",
    component: RegisterCircleView,
  },
  {
    path: "/showCircle",
    name: "showCircle",
    component: ShowCircle,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
