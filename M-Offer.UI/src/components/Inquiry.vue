<template>
  <div class="balance-inquiry-container">
    <div class="inquiry-header">
      <h3>Balance Inquiry</h3>
      <button @click="clearHistory()" class="clear-btn">기록 지우기</button>
    </div>
    <div class="input-row">
      <input
        id="phoneNumber"
        class="cont-input"
        ref="phoneNumberField"
        type="text"
        @keydown.enter="handleEnterKey"
        v-on:blur="handleBlur"
        placeholder="여기를 먼저 누른 후 바코드를 스캔하세요."
      />
      <button class="submit-btn" @click="handleEnterKey">Submit</button>
    </div>
    <p class="balance-text" v-if="isValidPhoneNumber">
      남은 금액: ${{ balance }}
    </p>
    <p class="balance-validation" v-if="!isValidPhoneNumber">
      잘못된 아이디입니다. 다시 시도해 주세요.
    </p>

    <h4>Transaction History</h4>
    <table class="table table-bordered table-striped table-text">
      <thead>
        <tr>
          <th v-for="field in titles" :key="field">
            {{ field }}
            <i class="bi bi-sort-alpha-down" aria-label="Sort Icon"></i>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in transactionData" :key="item">
          <td v-for="field in fields" :key="field">{{ item[field] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { defineComponent, computed, onMounted, ref } from "vue";
import { useTransactionStore } from "@/store";
import "bootstrap/dist/css/bootstrap.min.css";

export default defineComponent({
  name: "App",
  setup() {
    const titles = ["Name", "Time", "Balance ($)"];
    const fields = ["KoreanName", "TransTime", "RunningBalance"];
    const transactionStore = useTransactionStore();
    const getBalance = async (phoneNumber, isInquiry) => {
      await transactionStore.getBalance(phoneNumber, isInquiry);
    };
    const clearMemberTransactrions = async () => {
      await transactionStore.clearMemberTransactrions();
    };
    const balance = computed({
      get: () => transactionStore.balance,
      set: (newValue) => (transactionStore.balance = newValue),
    });
    const memberTransactions = computed({
      get: () => transactionStore.memberTransactions,
      set: (newValue) => (transactionStore.memberTransactions = newValue),
    });
    const isValidPhoneNumber = computed({
      get: () => transactionStore.isValidPhoneNumber,
      set: (newValue) => (transactionStore.isValidPhoneNumber = newValue),
    });

    const phoneNumberField = ref("");
    onMounted(() => {
      phoneNumberField.value.focus();
    });

    return {
      clearMemberTransactrions,
      getBalance,
      balance,
      isValidPhoneNumber,
      phoneNumberField,
      fields,
      titles,
      transactionData: memberTransactions,
    };
  },
  methods: {
    async handleEnterKey() {
      if (this.$refs["phoneNumberField"].value) {
        await this.getBalance(this.$refs["phoneNumberField"].value, true);
        this.$refs["phoneNumberField"].value = "";
      }
      this.$refs.phoneNumberField.focus();
    },
    clearHistory() {
      this.clearMemberTransactrions();
      this.$refs.phoneNumberField.focus();
    },
    async handleBlur(e) {
      e.target.placeholder;
      //console.log('blocking blur', e);
      let inputField = this.$refs["phoneNumberField"];
      if (inputField != null) {
        inputField.focus();
      }
    },
  },
});

/**
 * we initially add a browser session history record with current URL
 * when browser back or forward button is clicked, it will force a forward/go.(1) which was just added
 */
history.pushState(null, null, location.href);
window.onpopstate = function () {
  history.go(1);
};
</script>

<style scoped>
.balance-inquiry-container {
  width: 100%;
  padding: 20px;
}
.cont-input {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 20px;
}
.balance-text {
  font-weight: 600;
  font-size: 30px;
  margin-bottom: 30px;
}
.balance-validation {
  color: red;
}
.clear-btn {
  background-color: red;
  margin-top: 0px;
  margin-bottom: 10px;
  width: 200px;
  border-radius: 4px;
  padding: 10px 20px;
  color: #fff;
  border: none;
}
.inquiry-header {
  display: flex;
  justify-content: space-between;
}
.input-row {
  display: flex;
}
.submit-btn {
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  height: 30px;
  margin-top: 10px;
  margin-left: 10px;
  padding: 0 20px;
  max-width: 100px;
}
.table-text {
  font-size: 25px;
}
</style>
