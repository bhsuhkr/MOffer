<template>
  <div class="deposit-container">
    <h3>Deposit</h3>
    <form @submit.prevent="submitForm">
      <div>
        <label for="name">헌금 아이디:</label>
        <input
          type="text"
          id="name"
          ref="contIdField"
          v-model="contId"
          required
        />
      </div>
      <div>
        <label for="amount">금액 ($):</label>
        <input
          type="number"
          id="amount"
          ref="amountField"
          v-model="amount"
          required
        />
      </div>
      <div>
        <label for="type">지불 방법:</label>
        <select id="type" v-model="transType" required>
          <option value="CASH">Cash</option>
          <option value="CHECK">Check</option>
        </select>
      </div>
      <button type="submit">Deposit</button>
    </form>
    <div>confirmation Message</div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useTransactionStore } from "@/store";

export default defineComponent({
  name: "Deposit",
  setup() {
    let contId = ref("");
    let amount = ref(0);
    let transType = ref("CASH");
    const transactionStore = useTransactionStore();

    transactionStore.getTodayTransactions();
    const deposit = async (contId, amount, transType) => {
      await transactionStore.deposit(contId, amount, transType);
    };

    return {
      contId,
      amount,
      transType,
      deposit,
    };
  },
  methods: {
    submitForm() {
      this.deposit(this.contId, this.amount, this.transType);
      this.$refs["contIdField"].value = "";
      this.$refs["amountField"].value = "";
    },
  },
});
</script>

<style scoped>
.deposit-container {
  margin: 20px 40px;
  width: 100%;
}
</style>
