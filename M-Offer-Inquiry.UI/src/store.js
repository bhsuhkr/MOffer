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
      await axios.get(process.env.VUE_APP_API_URL + '/api/member/transactions', { params: { memberId: this.memberId} })
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
        // Validate barcode
    async validateBarcode(barcodeInfo) {
      const phoneNumber = barcodeInfo.substring(0, 10);
      const firstFourEmailChar = barcodeInfo.substring(10, barcodeInfo.length);

      if (phoneNumber && firstFourEmailChar) {
        await axios.get(process.env.VUE_APP_API_URL + '/api/member/id', { params:{ phoneNumber: phoneNumber } })
        .then(response => {
          this.memberId = response.data.memberId;
          
          if (this.memberId !== "NONE") {
            this.isValidPhoneNumber = true;
            this.validateEmail(firstFourEmailChar);
          } else {
            this.isValidPhoneNumber = false;
          }
        })
        .catch(error => {
          console.error("Failed to validate phone number", error);
          this.isValidPhoneNumber = false;
        });
      } else {
        this.isValidPhoneNumber = false;
      }
    },
    // Validate first four email char
    async validateEmail(firstFourEmailChar) {
      await axios.get(process.env.VUE_APP_API_URL + '/api/email', { params:{ memberId: this.memberId } })
        .then(response => {
          if (firstFourEmailChar.toLowerCase() === response.data.first_four_char_email.toLowerCase()) {
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
    async getBalance(barcodeInfo) {
      await this.validateBarcode(barcodeInfo);
      if (this.isValidPhoneNumber) {
        await axios.get(process.env.VUE_APP_API_URL + '/api/balance', { params: { memberId: this.memberId } })
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
