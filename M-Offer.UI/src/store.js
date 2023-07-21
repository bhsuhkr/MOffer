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
      
      await axios.post('http://172.16.1.154:3000/api/auth/signin', userData)
        .then(() => {
          this.isAuthenticated = true;
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

      if (userAgent.indexOf('Chrome') !== -1) {
        this.browserName = 'Chrome';
      } else if (userAgent.indexOf('Firefox') !== -1) {
        this.browserName = 'Firefox';
      } else if (userAgent.indexOf('Safari') !== -1) {
        this.browserName = 'Safari';
      } else if (userAgent.indexOf('Opera') !== -1 || userAgent.indexOf('OPR') !== -1) {
        this.browserName = 'Opera';
      } else if (userAgent.indexOf('Edge') !== -1) {
        this.browserName = 'MS Edge';
      } else if (userAgent.indexOf('Trident') !== -1) {
        this.browserName = 'Internet Explorer';
      } else {
        this.browserName = 'Unknown';
      }
    }
  },
});

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    transactions: [],
    memberId: "",
    balance: 0,
    isValidContId: true,
    isGetTodayTransactionsCalled: false // call getTodayTransactions() only once
  }),
  actions: {
    async getTransaction(memberId) {
      await axios.get('http://172.16.1.154:3000/api/transaction', { params: { memberId } })
        .then(response => {
          this.transactions.unshift(...response.data.recordset.recordset);
        })
        .catch(error => {
          console.error("Transaction load failed", error);
        });
    },
    async getTodayTransactions() {
      if (!this.isGetTodayTransactionsCalled) {
        await axios.get('http://172.16.1.154:3000/api/transactions')
        .then(response => {
          this.transactions.push(...response.data.recordset.recordset);
          this.isGetTodayTransactionsCalled = true;
        })
        .catch(error => {
          console.error("Transactions load failed", error);
        });
      }
    },
    async getMemberId(contId) {
      await axios.get('http://172.16.1.154:3000/api/member/id', { params:{ contId: contId } })
        .then(response => {
          this.memberId = response.data.memberId;
          
          if (this.memberId !== "NONE" ) {
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
    async getBalance(contId) {
      await this.getMemberId(contId);
      if (this.isValidContId) {
        await axios.get('http://172.16.1.154:3000/api/balance', { params: { memberId: this.memberId } })
          .then(response => {
            this.balance = response.data.balance;
          })
          .catch(error => {
            console.error("MemberId failed to fetch", error);
          });
      }
    },
    async pay(contId) {
      await this.getMemberId(contId);
      if (this.isValidContId) {
        await axios.post('http://172.16.1.154:3000/api/member/pay', { memberId: this.memberId, username: useAuthStore().username, ipAddress: useAuthStore().ipAddress, browserName: useAuthStore().browserName })
          .then(() => {
            console.log("Paid for member ", this.memberId);
            this.getTransaction(this.memberId);
          })
          .catch(error => {
            console.error("Payment failed", error);
          });
      }
    },
    async deposit(contId, amount, transType) {
      await this.getMemberId(contId);
      if (this.isValidContId) {
        await axios.post('http://172.16.1.154:3000/api/member/deposit', { memberId: this.memberId, amount: amount, transType: transType, username: useAuthStore().username, ipAddress: useAuthStore().ipAddress, browserName: useAuthStore().browserName })
        .then(() => {
          console.log("Deposit for member ", this.memberId);
          this.getTransaction(this.memberId);
        })
        .catch(error => {
          console.error("Deposit failed", error);
        });
      }
    },
    async refund() {
      if (this.isValidContId) {
        await axios.post('http://172.16.1.154:3000/api/member/refund', { memberId: this.memberId, username: useAuthStore().username, ipAddress: useAuthStore().ipAddress, browserName: useAuthStore().browserName })
        .then(() => {
          console.log("Refund for member ", this.memberId);
          this.getTransaction(this.memberId);
          this.memberId = ""
        })
        .catch(error => {
          console.error("Refund failed", error);
        });
      }
    }
  },
});
