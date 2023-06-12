import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/Login.vue';
import Pay from './components/Pay.vue';
import Deposit from './components/Deposit.vue';
import MemberManagement from './components/MemberManagement.vue';
import UserManagement from './components/UserManagement.vue';
import BarcodeInquiry from './components/BarcodeInquiry.vue';
import BalanceInquiry from './components/BalanceInquiry.vue';

const routes = [
  {
    path: '/',
    component: Login,
  },
  {
    path: '/pay',
    component: Pay,
  },
  {
    path: '/deposit',
    component: Deposit,
  },
  {
    path: '/member-management',
    component: MemberManagement,
  },
  {
    path: '/user-management',
    component: UserManagement,
  },
  {
    path: '/barcode-inquiry',
    component: BarcodeInquiry,
  },
  {
    path: '/balance-inquiry',
    component: BalanceInquiry,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;