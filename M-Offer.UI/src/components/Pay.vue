<template>
  <div class="pay-container">
    <div class="pay-header">
      <h3>Pay</h3>
      <button @click="getRefund()" class="refund-btn">환불하기</button>
    </div>

    <div class="transaction-container">
      <div class="input-row">
        <input
          id="phoneNumber"
          class="cont-input"
          ref="phoneNumberField"
          type="text"
          @keydown.enter="handleEnterKey"
          v-on:blur="handleBlur"
          autocomplete="off"
        />
      </div>

      <p id="validation-msg" class="validation-msg">{{ validationMessage }}</p>

      <table class="table table-bordered table-text">
        <thead>
          <tr>
            <th v-for="field in titles" :key="field">
              {{ field }}
              <i class="bi bi-sort-alpha-down" aria-label="Sort Icon"></i>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in transactionData" :key="item" :class="getRowColor(item.TransType)">
            <td v-for="field in fields" :key="field">{{ item[field] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import "bootstrap/dist/css/bootstrap.min.css";
import { defineComponent, computed, onMounted, ref } from "vue";
import { useTransactionStore } from "@/store";

export default defineComponent({
  name: "Pay",
  setup() {
    let validationMessage = ref("");
    const titles = ["Name", "Time", "Balance ($)"];
    const fields = ["KoreanName", "TransTime", "RunningBalance"];
    const transactionStore = useTransactionStore();
    const getBalance = async (phoneNumber) => {
      await transactionStore.getBalance(phoneNumber);
    };
    const refund = async () => {
      await transactionStore.refund();
    };
    const balance = computed({
      get: () => transactionStore.balance,
      set: (newValue) => (transactionStore.balance = newValue),
    });
    const memberId = computed({
      get: () => transactionStore.memberId,
      set: (newValue) => (transactionStore.memberId = newValue),
    });
    const isValidPhoneNumber = computed({
      get: () => transactionStore.isValidPhoneNumber,
      set: (newValue) => (transactionStore.isValidPhoneNumber = newValue),
    });
    const didPay = computed({
      get: () => transactionStore.didPay,
      set: (newValue) => (transactionStore.didPay = newValue),
    });

    transactionStore.getTodayTransactions();

    const pay = async (phoneNumber) => {
      await transactionStore.pay(phoneNumber);
    };

    const phoneNumberField = ref("");
    onMounted(() => {
      phoneNumberField.value.focus();
    });

    return {
      validationMessage,
      getBalance,
      memberId,
      balance,
      transactionData: transactionStore.transactions,
      fields,
      didPay,
      titles,
      pay,
      refund,
      isValidPhoneNumber,
      phoneNumberField,
    };
  },
  methods: {
    async handleEnterKey() {
      const phoneNumber = this.$refs["phoneNumberField"].value;
      if (phoneNumber) {
        await this.getBalance(phoneNumber);
        if (!this.isValidPhoneNumber) {
          this.isSuccessValidation(false);
          this.validationMessage = "잘못된 바코드입니다. 다시 시도해 주세요.";
        } else if (this.balance <= -10) {
          this.isSuccessValidation(false);
          this.validationMessage = "잔액이 부족합니다. $" + this.balance;
        } else {
          this.pay(phoneNumber);
          this.validationMessage = "";
        }
        this.$refs["phoneNumberField"].value = "";
      }
      this.$refs.phoneNumberField.focus();
    },
    async handleBlur() {
      let inputField = this.$refs["phoneNumberField"];
      if (inputField != null) {
        inputField.focus();
      }
    },
    getRefund() {
      if (this.memberId && this.isValidPhoneNumber && this.didPay) {
        this.refund();
        this.isSuccessValidation(true);
        this.validationMessage = "정상적으로 환불 되었습니다.";
      } else if (this.memberId != "NONE" && this.didPay) {
        this.isSuccessValidation(false);
        this.validationMessage = "이미 환불 되었습니다.";
      } else if (!this.memberId && this.isValidPhoneNumber && !this.didPay) {
        this.isSuccessValidation(false);
        this.validationMessage = "먼저 스캔을 해주세요.";
      }
      this.$refs.phoneNumberField.focus();
    },
    getRowColor(transType) {
      return {
        "green-row": transType === "DEBIT",
        "red-row": transType !== "DEBIT",
      };
    },
    isSuccessValidation(change) {
      if (change) {
        document.getElementById("validation-msg").classList.add("validation-msg-success");
      } else {
        document.getElementById("validation-msg").classList.remove("validation-msg-success");
      }
    },
  },
});
</script>

<style scoped>
.pay-container {
  margin: 20px 40px;
  width: 100%;
}
.cont-input {
  border: none;
  outline: none;
  caret-color: transparent;
  color: #fff;
}
.balance-validation {
  color: red;
}
.table {
  margin-top: 10px;
}
.refund-btn {
  background-color: red;
  margin-top: 0px;
  margin-bottom: 10px;
  width: 200px;
}
.pay-header {
  display: flex;
  justify-content: space-between;
}
.input-row {
  display: flex;
  margin-bottom: 10px;
  height: 1px;
}
.submit-btn {
  border-radius: 3px;
  height: 30px;
  margin-top: 10px;
  margin-left: 10px;
  padding: 0 20px;
  max-width: 100px;
}
.validation-msg {
  color: red;
}
.validation-msg-success {
  color: #4caf50;
}
.red-row {
  --bs-table-accent-bg: #ce5c5c;
  --bs-table-color: white;
}
.green-row {
  --bs-table-accent-bg: #69be70;
  --bs-table-color: white;
}
.table-text {
  font-size: 25px;
}
</style>
