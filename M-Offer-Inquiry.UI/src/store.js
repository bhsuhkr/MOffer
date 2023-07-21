import { defineStore } from 'pinia';
import axios from "axios";

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    memberTransactions: [],
    memberId: "",
    balance: 0,
    isValidContId: true,
  }),
  actions: {
    async getMemberTransactions() {
      await axios.get('http://172.16.1.154:3000/api/member/transactions', { params: { memberId: this.memberId} })
        .then(response => {
          this.memberTransactions = [];
          this.memberTransactions.push(...response.data.recordset.recordset);
        })
        .catch(error => {
          console.error("Member Transactions load failed", error);
        });
    },
    clearMemberTransactrions() {
      this.memberTransactions = [];
      this.balance = 0;
    },
    async getMemberId(contId) {
      await axios.get('http://172.16.1.154:3000/api/member/id', { params:{ contId: contId } })
        .then( response => {
          this.memberId = response.data.memberId;
          if (this.memberId !== "NONE" ) {
            this.isValidContId = true;
            this.getMemberTransactions();
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
  },
});