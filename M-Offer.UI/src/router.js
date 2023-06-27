import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from "@/store";
import Login from './components/Login.vue';
import Pay from './components/Pay.vue';
import Deposit from './components/Deposit.vue';
// TODO: Phase 2
// import MemberManagement from './components/MemberManagement.vue';
// import UserManagement from './components/UserManagement.vue';
import BalanceInquiry from './components/BalanceInquiry.vue';

const routes = [
  {
    path: '/',
    component: Login,
  },
  {
    path: '/pay',
    component: Pay,
    meta: { requiresAuth: true }
  },
  {
    path: '/deposit',
    component: Deposit,
    meta: { requiresAuth: true }
  },
  // TODO: Phase 2
  // {
  //   path: '/member-management',
  //   component: MemberManagement,
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: '/user-management',
  //   component: UserManagement,
  //   meta: { requiresAuth: true }
  // },
  {
    path: '/balance-inquiry',
    component: BalanceInquiry,
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !authStore.isAuthenticated) {
    next('/');
  }
  else  {
    next();
  }
})

export default router;