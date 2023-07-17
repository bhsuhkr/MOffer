<template>
  <div class="pay-container">
    <div class="pay-header">
      <h3 class="pay-title">Pay</h3>
      <button @click="getRefund()" class="refund-btn">환불하기</button>
    </div>
    <div class="transaction-container">
      <input
        class="cont-input"
        ref="contIdField"
        type="text"
        @keydown.enter="handleEnterKey"
        placeholder="여기를 먼저 누른 후 바코드를 스캔하세요."
      />
      <p class="balance-validation" v-if="!isValidContId">
        잘못된 아이디입니다. 다시 시도해 주세요.
      </p>

      <table class="table table-bordered table-striped">
        <thead>
          <tr>
            <th v-for="field in fields" :key="field">
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
  </div>
</template>

<script>
import "bootstrap/dist/css/bootstrap.min.css";
import { defineComponent, computed, onMounted, ref } from "vue";
import { useTransactionStore } from "@/store";

export default defineComponent({
  name: "Pay",
  setup() {
    const fields = [
      "KoreanName",
      "ContId",
      "TransType",
      "TransTime",
      "RunningBalance",
    ];
    const transactionStore = useTransactionStore();
    const getBalance = async (contId) => {
      await transactionStore.getBalance(contId);
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
    const isValidContId = computed({
      get: () => transactionStore.isValidContId,
      set: (newValue) => (transactionStore.isValidContId = newValue),
    });

    transactionStore.getTodayTransactions();
    const pay = async (contId) => {
      await transactionStore.pay(contId, "pay");
    };

    const contIdField = ref("");
    onMounted(() => {
      contIdField.value.focus();
    });

    return {
      getBalance,
      memberId,
      balance,
      transactionData: transactionStore.transactions,
      fields,
      pay,
      refund,
      isValidContId,
      contIdField,
    };
  },
  methods: {
    async handleEnterKey(event) {
      await this.getBalance(event.target.value);
      if (this.balance <= -10) {
        window.alert("잔액이 부족합니다. $" + this.balance);
      } else {
        this.pay(event.target.value);
      }
      this.$refs["contIdField"].value = "";
    },
    getRefund() {
      if (this.memberId) {
        this.refund();
        window.alert("정상적으로 환불 되었습니다.");
      } else {
        window.alert("이미 환불 되었습니다.");
      }
      this.$refs.contIdField.focus();
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
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
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
</style>
