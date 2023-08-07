import { defineStore } from 'pinia';
import axios from "axios";
import { format, utcToZonedTime } from 'date-fns-tz';

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    memberTransactions: [],
    memberId: "",
    balance: 0,
    isValidPhoneNumber: true,
  }),
  actions: {
    async getMemberTransactions() {
      await axios.get('http://172.16.1.154:3000/api/member/transactions', { params: { memberId: this.memberId} })
        .then(response => {
          this.memberTransactions = [];
          const transactions = response.data.recordset.recordset;
          const formattedTransactions = transactions.map((transaction) => {
            const zonedTime = utcToZonedTime(transaction.TransTime, 'UTC');
            return {
              ...transaction,
              TransTime: format(zonedTime, 'yyyy-MM-dd HH:mm:ss a', { timeZone: 'UTC' })
            };
          });
          this.memberTransactions.push(...formattedTransactions);
        })
        .catch(error => {
          console.error("Failed to load member transactions", error);
        });
    },
    clearMemberTransactrions() {
      this.memberTransactions = [];
      this.balance = 0;
    },
    // Validate phone number
    async validatePhoneNumber(phoneNumber) {
      await axios.get('http://172.16.1.154:3000/api/member/id', { params: { phoneNumber: phoneNumber } })
        .then(response => {
          this.memberId = response.data.memberId;
          
          if (this.memberId !== "NONE" ) {
            this.isValidPhoneNumber = true;
            this.getMemberTransactions();

          } else {
            this.isValidPhoneNumber = false;
          }
        })
        .catch(error => {
          console.error("Failed to validate phone number", error);
          this.isValidPhoneNumber = false;
        });
    },
    async getBalance(phoneNumber) {
      await this.validatePhoneNumber(phoneNumber);
      if (this.isValidPhoneNumber) {
        await axios.get('http://172.16.1.154:3000/api/balance', { params: { memberId: this.memberId } })
          .then(response => {
            this.balance = response.data.balance;
          })
          .catch(error => {
            console.error("Failed to fetch memberId", error);
          });
      }
    },
  },
});
