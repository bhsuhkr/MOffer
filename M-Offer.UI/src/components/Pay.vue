<template>
  <div class="pay-container">
    <h3 class="pay-title">Pay</h3>
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
      <table id="tableComponent" class="table table-bordered table-striped">
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
import { defineComponent, computed } from "vue";
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
    const isValidContId = computed({
      get: () => transactionStore.isValidContId,
      set: (newValue) => (transactionStore.isValidContId = newValue),
    });

    transactionStore.getTodayTransactions();
    const pay = async (contId) => {
      await transactionStore.pay(contId, "pay");
    };

    return {
      transactionData: transactionStore.transactions,
      fields,
      pay,
      isValidContId,
    };
  },
  methods: {
    handleEnterKey(event) {
      this.pay(event.target.value);
      this.$refs["contIdField"].value = "";
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
  margin-bottom: 20px;
}
.balance-validation {
  color: red;
}
</style>
