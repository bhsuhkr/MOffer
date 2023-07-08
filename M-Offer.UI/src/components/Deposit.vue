<template>
  <div class="deposit-container">
    <h3>Deposit</h3>
    <form @submit.prevent="submitForm" class="deposit-form">
      <div>
        <label for="contId">헌금 아이디:</label>
        <input
          type="text"
          id="contId"
          ref="contIdField"
          v-model.trim="contId"
          required
        />
      </div>
      <div>
        <label for="amount">금액 ($):</label>
        <input
          type="number"
          id="amount"
          ref="amountField"
          v-model.number.trim="amount"
          required
        />
      </div>
      <div>
        <label for="transType">지불 방법:</label>
        <select
          id="transType"
          v-model="transType"
          ref="transTypeField"
          required
        >
          <option value="CASH">Cash</option>
          <option value="CHECK">Check</option>
        </select>
      </div>
      <button type="submit">Deposit</button>
    </form>
    <div class="confirmation-msg">
      <h4>확인 메시지</h4>
      <p>헌금 아이디: {{ contId }}</p>
      <p>금액: {{ amount }}</p>
      <p>지불 방법: {{ transType }}</p>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, numeric } from "@vuelidate/validators";
import { useTransactionStore } from "@/store";

export default defineComponent({
  name: "Deposit",
  setup() {
    let contId = ref("");
    let amount = ref(0);
    let transType = ref("CASH");
    const rules = {
      contId: { required },
      amount: { required, numeric },
      transType: { required },
    };

    let v$ = useVuelidate(rules, { contId, amount, transType });
    const invalid = computed(() => v$.value.$invalid);

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
      invalid,
    };
  },
  methods: {
    submitForm() {
      if (this.invalid) {
        console.log("Validation failed");
        return;
      } else {
        this.deposit(this.contId, this.amount, this.transType);

        this.$refs["contIdField"].value = "";
        this.$refs["amountField"].value = 0;
        this.$refs["transTypeField"].value = "CASH";
      }
    },
  },
});
</script>

<style scoped>
.deposit-container {
  margin: 20px 40px;
  width: 100%;
}
.deposit-form {
  margin-top: 20px;
  max-width: 400px;
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
