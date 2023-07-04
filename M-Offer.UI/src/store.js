import { defineStore } from 'pinia';
import axios from "axios";
import router from './router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    username: ""
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
          this.username = cred.username;
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
    balance: 0,
    isValidContId: true
  }),
  actions: {
    async getTransaction(memberId) {
      await axios.get('http://localhost:3000/api/transaction', { params: { memberId } })
        .then(response => {
          this.transactions.unshift(...response.data.recordset.recordset);
        })
        .catch(error => {
          console.error("Transaction load failed", error);
        });
    },
    async getTodayTransactions() {
      await axios.get('http://localhost:3000/api/transactions')
        .then(response => {
          this.transactions.push(...response.data.recordset.recordset);
        })
        .catch(error => {
          console.error("Transactions load failed", error);
        });
    },
    async getMemberId(contId, makePayment) {
      await axios.get('http://localhost:3000/api/member/id', { params:{ contId: contId } })
        .then(response => {
          const memberId = response.data.memberId;

          if (makePayment) {
            this.pay(memberId);
          } else {
            this.getBalance(memberId);
          }
          if (memberId !== "NONE" ) {
            this.isValidContId = true;
          } else {
            this.isValidContId = false;
          }
        })
        .catch(error => {
          console.error("MemberId failed to fetch", error);
          this.isValidContId = false;
        });
    },
    async getBalance(memberId) {
      await axios.get('http://localhost:3000/api/balance', { params:{ memberId: memberId } })
        .then(response => {
          this.balance = response.data.balance;
        })
        .catch(error => {
          console.error("MemberId failed to fetch", error);
        });
    },
    async pay(memberId) {
      await axios.post('http://localhost:3000/api/member/pay', { memberId: memberId, username: useAuthStore().username })
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
