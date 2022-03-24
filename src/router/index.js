import Vue from "vue";
import VueRouter from "vue-router";
import UserList from "../views/UserList.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "UserList",
    component: UserList,
  },
  {
    path: "/update/:id",
    name: "UserUpdate",
    component: () =>
      import("../views/UserUpdate.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
