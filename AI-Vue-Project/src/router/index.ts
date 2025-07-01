import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/store/auth";
import Home from "@/views/Home/index.vue";
import Login from "@/views/Login/index.vue";
import Layout from "@/layout/index.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Layout,
    redirect: "/home",
    meta:{
      requiresAuth: true
    },
    children: [
      {
        path: "home",
        name: "homePage",
        component: Home,
        meta:{
          requiresAuth: true
        }
      },
    ]
  },
  {
    path: "/library",
    name: "library",
    component: Layout,
    meta:{
      requiresAuth: true
    },
    children: [
      {
        path: "mylibrary",
        name: "mylibrary",
        component: ()=>import("@/views/Library/myLibrary.vue"),
        meta:{
          requiresAuth: true
        }
      },
      {
        path: "workspace",
        name: "workspace",
        component: ()=>import("@/views/Library/workspace.vue"),
        meta:{
          requiresAuth: true
        }
      },
      {
        path:"documents",
        name:"documents",
        component:()=>import("@/views/Library/documents.vue"),
        meta:{
          requiresAuth: true
        }
      },
      {
        path:"systemSetting",
        name:"systemSetting",
        component:()=>import("@/views/Library/systemSetting.vue"),
        meta:{
          requiresAuth: true
        }
      },
      {
        path:"usersManage",
        name:"usersManage",
        component:()=>import("@/views/Library/usersManage.vue"),
        meta:{
          requiresAuth: true
        }
      },
      {
        path:"openAI",
        name:"openAI",
        component:()=>import("@/views/Library/openAIManage.vue"),
        meta:{
          requiresAuth: true
        }
      }
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  if (requiresAuth && !authStore.isLoggedIn) {
    next({ name: "Login" });
  } else {
    next();
  }
});

// router.afterEach((to, from) => {
//   console.log("全局后置守卫", to, from);
// });

export default router;
