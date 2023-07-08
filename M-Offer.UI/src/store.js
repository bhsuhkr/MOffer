import { defineStore } from 'pinia';
import axios from "axios";
import router from './router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    username: "",
    showValidationMessage: false,
    browserName: "",
    ipAddress: "",

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
          this.showValidationMessage = false;
          this.fetchIpAddress();
          this.detechBrowser();
          router.push('/pay');
        })
        .catch(error => {
          console.error("Axios Login failed", error);
          this.showValidationMessage = true;
        });
    },
    logout() {
      this.isAuthenticated = false;
      this.showValidationMessage = false;
    },
    async fetchIpAddress() {
      try {
        const response = await axios.get('https://api.ipify.org?format=json');
        this.ipAddress = response.data.ip;
      } catch (error) {
        console.error('Error fetching IP address:', error);
      }
    },
    detechBrowser() {
      const userAgent = navigator.userAgent;

      switch (true) {
        case userAgent.indexOf('Chrome') !== -1:
          this.browserName = 'Chrome';
          break;
        case userAgent.indexOf('Firefox') !== -1:
          this.browserName = 'Firefox';
          break;
        case userAgent.indexOf('Safari') !== -1:
          this.browserName = 'Safari';
          break;
        case userAgent.indexOf('Opera') !== -1 || userAgent.indexOf('OPR') !== -1:
          this.browserName = 'Opera';
          break;
        case userAgent.indexOf('Edge') !== -1:
          this.browserName = 'MS Edge';
          break;
        case userAgent.indexOf('Trident') !== -1:
          this.browserName = 'Internet Explorer';
          break;
        default:
          this.browserName = 'Unknown';
      }
    }
  },
});

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    transactions: [],
    balance: 0,
    isValidContId: true,
    isGetTodayTransactionsCalled: false // call getTodayTransactions() only once
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
      if (!this.isGetTodayTransactionsCalled) {
        await axios.get('http://localhost:3000/api/transactions')
        .then(response => {
          this.transactions.push(...response.data.recordset.recordset);
          this.isGetTodayTransactionsCalled = true;
        })
        .catch(error => {
          console.error("Transactions load failed", error);
        });
      }
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
      await axios.post('http://localhost:3000/api/member/pay', { memberId: memberId, username: useAuthStore().username,ipAddress: useAuthStore().ipAddress, browserName: useAuthStore().browserName })
        .then(() => {
          console.log("Paid for member ", memberId);
          this.getTransaction(memberId);
        })
        .catch(error => {
          console.error("Payment failed", error);
        });
    },
    async deposit(contId, amount, transType) {
      await this.getMemberId(contId);
      await axios.post('http://localhost:3000/api/member/deposit', { memberId: this.memberId, amount: amount, transType: transType, username: useAuthStore().username, ipAddress: useAuthStore().ipAddress, browserName: useAuthStore().browserName })
        .then(() => {
          console.log("Deposit for member ", this.memberId);
          this.getTransaction(this.memberId);
        })
        .catch(error => {
          console.error("Deposit failed", error);
        });
    }
  },
});
