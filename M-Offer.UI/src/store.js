import { defineStore } from 'pinia';
import axios from "axios";
import router from './router';
import { format, utcToZonedTime } from 'date-fns-tz';

function UserAuth() {
  return {
    isAuthenticated: false,
    username: "",
    showValidationMessage: false,
    browserName: "",
    ipAddress: "",
    loginDatetime: 0,
    isValid: function () {
      console.log("config valid min -- " + process.env.VUE_APP_SESSION_VALID_MIN);
      let currentdatetime = new Date();
      if (currentdatetime.getTime() - parseInt(process.env.VUE_APP_SESSION_VALID_MIN) * 60 * 1000 < this.loginDatetime) {
        this.isAuthenticated = true;
        this.loginDatetime = currentdatetime.getTime();
      } else {
        this.isAuthenticated = false;
        this.loginDatetime = 0;
      }
      return this.isAuthenticated;
    },
    convert: function (stringValue) {
      let temp = JSON.parse(stringValue);
      if (temp != null) {
        this.isAuthenticated = temp.isAuthenticated;
        this.username = temp.username;
        this.showValidationMessage = temp.showValidationMessage;
        this.browserName = temp.browserName;
        this.ipAddress = temp.ipAddress;
        this.loginDatetime = temp.loginDatetime;
      }
    }
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => {
    // first get locally stored user auth
    let userStringFromLocal = localStorage.getItem("userAuthState");
    console.log("user auth from local storage  -- " + userStringFromLocal);

    // convert string to UserAuth object
    let userFromLocal = new UserAuth();
    userFromLocal.convert(userStringFromLocal);

    // check if the locally stored user auth is valid
    if (userFromLocal != null && userFromLocal.isValid()) {
      console.log("user valid session exists -- " + JSON.stringify(userFromLocal));
      console.log("user valid session date exists -- " + userFromLocal.loginDatetime);
      // save user auth to local storage
      localStorage.setItem("userAuthState", JSON.stringify(userFromLocal));
      //this.isAuthenticated = true;
    } else {
      console.log("user is not logged in!");
      // nullify local storage
      localStorage.setItem("userAuthState", null);

    }
    return userFromLocal;
  },
  actions: {
    async login(cred) {
      const userData = {
        username: cred.username,
        password: cred.password
      };

      await axios.post(process.env.VUE_APP_API_URL + '/api/auth/signin', userData)
        .then(() => {
          this.isAuthenticated = true;
          this.username = cred.username;
          this.showValidationMessage = false;
          this.fetchIpAddress();
          this.detechBrowser();

          // save user auth to local storage
          let userAuth = new UserAuth();
          userAuth.isAuthenticated = this.isAuthenticated;
          userAuth.username = this.username;
          userAuth.showValidationMessage = this.showValidationMessage;
          userAuth.loginDatetime = new Date().getTime();
          userAuth.ipAddress = JSON.stringify(this.ipAddress);
          userAuth.browserName = this.browserName;
          localStorage.setItem("userAuthState", JSON.stringify(userAuth));
          //localStorage.setItem("userAuthDateTime", JSON.stringify(new Date().getTime()));

          console.log("logged in successfully -- " + JSON.stringify(userAuth));
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
      this.username = "";
      // nullify local storage
      localStorage.setItem("userAuthState", null);
      return new UserAuth();
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
    memberTransactions: [],
    items: [],
    memberId: "",
    balance: 0,
    isValidPhoneNumber: true,
    didPay: false,
    isGetTodayTransactionsCalled: false // call getTodayTransactions() only once
  }),
  actions: {
    // Add the latest transaction in an array after pay, deposit, or refund
    async getTransaction(memberId) {
      await axios.get(process.env.VUE_APP_API_URL + '/api/transaction', { params: { memberId } })
        .then(response => {
          const transactions = response.data.recordset.recordset;
          const formattedTransactions = transactions.map((transaction) => {
            const zonedTime = utcToZonedTime(transaction.TransTime, 'UTC');
            return {
              ...transaction,
              TransTime: format(zonedTime, 'yyyy-MM-dd HH:mm:ss a', { timeZone: 'UTC' })
            };
          });

          this.transactions.unshift(...formattedTransactions);
        })
        .catch(error => {
          console.error("Failed to load transaction", error);
        });
    },
    // Fetch today's transactions
    async getTodayTransactions() {
      if (!this.isGetTodayTransactionsCalled) {
        await axios.get(process.env.VUE_APP_API_URL + '/api/transactions')
          .then(response => {
            const transactions = response.data.recordset.recordset;
            const formattedTransactions = transactions.map((transaction) => {
              const zonedTime = utcToZonedTime(transaction.TransTime, 'UTC');
              return {
                ...transaction,
                TransTime: format(zonedTime, 'yyyy-MM-dd HH:mm:ss a', { timeZone: 'UTC' })
              };
            });

            this.transactions.push(...formattedTransactions);
            this.isGetTodayTransactionsCalled = true;
          })
          .catch(error => {
            console.error("Failed to load transactions", error);
          });
      }
    },
    // Get transactions for inquiry
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
    // Clear transactions in inquiry page
    clearMemberTransactrions() {
      this.memberTransactions = [];
      this.balance = 0;
    },
    // Validate barcode
    async validateBarcode(barcodeInfo, validateEmail = true, isInquiry = false) {
      const phoneNumber = barcodeInfo.substring(0, 10);
      const firstFourEmailChar = barcodeInfo.substring(10, barcodeInfo.length);

      if (phoneNumber && firstFourEmailChar && validateEmail || phoneNumber && !validateEmail) {
        await axios.get(process.env.VUE_APP_API_URL + '/api/member/id', { params: { phoneNumber: phoneNumber } })
          .then(response => {
            this.memberId = response.data.memberId;

            if (this.memberId !== "NONE") {
              this.isValidPhoneNumber = true;
              if (validateEmail) {
                this.validateEmail(firstFourEmailChar, isInquiry);
              }
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
    async validateEmail(firstFourEmailChar, isInquiry = false) {
      await axios.get(process.env.VUE_APP_API_URL + '/api/email', { params: { memberId: this.memberId } })
        .then(response => {
          if (firstFourEmailChar.toLowerCase() === response.data.first_four_char_email.toLowerCase()) {
            this.isValidPhoneNumber = true;
            if(isInquiry) {
              this.getMemberTransactions();
            }
          } else {
            this.isValidPhoneNumber = false;
          }
        })
        .catch(error => {
          console.error("Failed to validate phone number", error);
          this.isValidPhoneNumber = false;
        });
    },
    // Get Balance 
    async getBalance(barcodeInfo, isInquiry = false) {
      await this.validateBarcode(barcodeInfo, true, isInquiry);
      if (this.isValidPhoneNumber) {
        await axios.get(process.env.VUE_APP_API_URL + '/api/balance', { params: { memberId: this.memberId } })
          .then(response => {
            this.balance = response.data.balance;
            this.didPay = false;
          })
          .catch(error => {
            console.error("Failed to fetch memberId ", error);
          });
      }
    },
    // Make a payment ($2 Meal)
    async pay(barcodeInfo) {
      await this.validateBarcode(barcodeInfo);
      if (this.isValidPhoneNumber) {
        await axios.post(process.env.VUE_APP_API_URL + '/api/member/pay', { memberId: this.memberId, username: useAuthStore().username, ipAddress: useAuthStore().ipAddress, browserName: useAuthStore().browserName })
          .then(() => {
            console.log("Paid for member ", this.memberId);
            this.getTransaction(this.memberId);
            this.didPay = true;
          })
          .catch(error => {
            console.error("Failed to make a payment", error);
            this.didPay = false;
          });
      }
    },
    async getAllItemsAndPrices() {
      await axios.get(process.env.VUE_APP_API_URL + '/api/item-prices')
        .then(response => {
          if (response && response.data) {
            this.items = response.data.items;
          }
        })
        .catch(error => {
          console.error("Failed to fetch items", error);
        });
    },
    // Make a payment (Cafe)
    async payCafe(barcodeInfo, item, paymentMethod) {
      try {
        if (paymentMethod === "SCAN") {
          await this.validateBarcode(barcodeInfo);
          if (this.isValidPhoneNumber) {
            await this.makePayment(this.memberId, "DEBIT", item, "SCAN");
          }
        } else if (paymentMethod === "CC" || paymentMethod === "CASH") {
          // add commit, rollback for two transactions
          await this.makePayment("11111111", "CREDIT", item, paymentMethod);
          await this.makePayment("11111111", "DEBIT", item, paymentMethod);
        }
      } catch (error) {
        console.error("Failed to make a payment:", paymentMethod, error);
      }
    },
    async makePayment(memberId, transType, item, paymentMethod) {
      await axios.post(process.env.VUE_APP_API_URL + '/api/member/pay-cafe', {
          memberId,
          transType,
          item,
          paymentMethod,
          username: useAuthStore().username,
          ipAddress: useAuthStore().ipAddress,
          browserName: useAuthStore().browserName
        })
        .catch(error => {
          console.error("Failed to make a payment", error);
        });
    },
    // Add funds
    async deposit(barcodeInfo, amount, transType) {
      await this.validateBarcode(barcodeInfo, false);
      if (this.isValidPhoneNumber && amount <= 500) {
        await axios.post(process.env.VUE_APP_API_URL + '/api/member/deposit', { memberId: this.memberId, amount: amount, transType: transType, username: useAuthStore().username, ipAddress: useAuthStore().ipAddress, browserName: useAuthStore().browserName })
          .then(() => {
            console.log("Deposit for member ", this.memberId);
            this.getTransaction(this.memberId);
          })
          .catch(error => {
            console.error("Failed to deposit", error);
          });
      }
    },
    // Refund the latest transaction (main meal $2)
    async refund() {
      if (this.isValidPhoneNumber) {
        await axios.post(process.env.VUE_APP_API_URL + '/api/member/refund', { memberId: this.memberId, username: useAuthStore().username, ipAddress: useAuthStore().ipAddress, browserName: useAuthStore().browserName })
          .then(() => {
            console.log("Refund for member ", this.memberId);
            this.getTransaction(this.memberId);
            this.memberId = "";
          })
          .catch(error => {
            console.error("Failed to refund", error);
          });
      }
    }
  },
});

export const useSummaryStore = defineStore('dailySummary', {
  state: () => ({
    summaryData: [],
  }),
  actions: {
  // Add the latest transaction in an array after pay, deposit, or refund
  async getSummary(dateValue) {
    await axios.get(process.env.VUE_APP_API_URL + '/api/report/tx/dailytotal', { params: { "date": dateValue } })
      .then(response => {
        const summaryRecordSet = response.data.recordset.recordset;
        const formattedSummary = summaryRecordSet.map((summaryRecord) => {
          const zonedTime = utcToZonedTime(summaryRecord.SummaryDate, 'UTC');
          // Format the price above to USD using the locale, style, and currency.
          const USDollar = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          });
          summaryRecord.SummaryDate = format(zonedTime, 'MM-dd-yyyy', { timeZone: 'UTC' });
          summaryRecord.DailyTotalDebitAmount = USDollar.format(summaryRecord.DailyTotalDebitAmount);
          summaryRecord.DailyTotalCreditAmount = USDollar.format(summaryRecord.DailyTotalCreditAmount);
          summaryRecord.DailyTotalRefundAmount = USDollar.format(summaryRecord.DailyTotalRefundAmount);
          summaryRecord.DailyBalance = USDollar.format(summaryRecord.DailyBalance);
          summaryRecord.GrandTotalTransBalance = USDollar.format(summaryRecord.GrandTotalTransBalance);
          summaryRecord.GrandTotalMemberBalance = USDollar.format(summaryRecord.GrandTotalMemberBalance);
          return summaryRecord;
        });

        this.summaryData.unshift(...formattedSummary);
      })
      .catch(error => {
        console.error("Failed to load daily summary", error);
      })
    },
    clearSummary() {
      this.summaryData = [];
      this.dateValue = "";
    },    
  },
});

export const useRegisterStore = defineStore('register', {
  state: () => ({
    isRegisterd: false,
  }),
  actions: {
  async register(phoneNumber, engName, korName, email) {
    await axios.post(process.env.VUE_APP_API_URL + '/api/member/register', { phoneNumber, engName, korName, email })
      .then(response => {
          console.log("Successfully registered", response);
          this.isRegisterd = true;
      })
      .catch(error => {
        console.error("Failed to register", error);
        this.isRegisterd = false;
      })
    },
  },
});