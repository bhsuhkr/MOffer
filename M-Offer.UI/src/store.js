import { defineStore } from 'pinia';
import axios from "axios";
import router from './router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
  }),
  actions: {
    async login(cred) {
      const userData = {
        username: cred.username,
        password: cred.password
      };
      
      await axios.post('http://localhost:3000/api/auth/signin', userData)
        .then(response => {
          this.isAuthenticated = true;
          console.log("login successfully", response);
          router.push('/pay');
        })
        .catch(error => {
          console.error("Axios Login failed", error);
        });
    },
    logout() {
      this.isAuthenticated = false;
    },
  },
});

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    transactions: [],
  }),
  actions: {
    async getTransaction(memberId) {
      await axios.get('http://localhost:3000/api/transaction', { params: { memberId } })
        .then(response => {
          this.transactions.push(...response.data.recordset.recordset);
        })
        .catch(error => {
          console.error("Transaction load failed", error);
        });
    },
    async getMemberId(contId) {
      await axios.get('http://localhost:3000/api/member/id', { params:{ contId: contId } })
        .then(response => {
          this.pay(response.data.memberId);
        })
        .catch(error => {
          console.error("MemberId failed to fetch", error);
        });
    },
    async pay(memberId) {
      await axios.post('http://localhost:3000/api/member/pay', { memberId: memberId })
        .then(() => {
          console.log("Paid for member ", memberId);
          this.getTransaction(memberId);
        })
        .catch(error => {
          console.error("Payment failed", error);
        });
    }
  },
});
