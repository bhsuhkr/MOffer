import { createRouter, createWebHistory } from 'vue-router';
import Admin from './components/Admin.vue' ;
import Users from './components/Users.vue';
import Transactions from './components/Transactions.vue';

const routes = [
  {
    path: '/',
    name: 'Transactions',
    component: Transactions,
  },
  {
    path: '/users',
    name: 'Users',
    component: Users,
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;