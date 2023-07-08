<template>
  <div class="deposit-container">
    <h3>Deposit</h3>
    <form @submit.prevent="submitForm" class="deposit-form">
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
    <div class="confirmation-msg">
      <h4>confirmation Message</h4>
      <p>헌금 아이디: {{ this.contId }}</p>
      <p>금액: {{ this.amount }}</p>
      <p>지불 방법: {{ this.transType }}</p>
    </div>
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
.deposit-form{
  margin-top: 20px;
}
input[type="text"],
input[type="number"],
select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
button {
  width: 100%;
  padding: 10px 20px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 15px;
}
</style>
