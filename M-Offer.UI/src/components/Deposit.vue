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
      <button type="submit" :disabled="showConfirmationMsg">Deposit</button>
      <p class="validation-msg">{{ validationMessage }}</p>
    </form>

    <DepositPopup
      ref="deposit-popup"
      v-if="showConfirmationMsg"
      :contId="contId"
      :amount="amount"
      :transType="transType"
      @close-deposit-popup="handlePopupClosed"
    />
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, minValue } from "@vuelidate/validators";
import { useTransactionStore } from "@/store";
import DepositPopup from "./DepositPopup.vue";

export default defineComponent({
  name: "Deposit",
  components: {
    DepositPopup,
  },
  setup() {
    let showConfirmationMsg = ref(false);
    let contId = ref("");
    let amount = ref(0);
    let transType = ref("CASH");
    let validationMessage = ref("");

    const rules = {
      contId: { required },
      amount: { required, minValue: minValue(1) },
      transType: { required },
    };

    let v$ = useVuelidate(rules, { contId, amount, transType });
    const formInvalid = computed(() => v$.value.$invalid);

    const transactionStore = useTransactionStore();
    transactionStore.getTodayTransactions();
    const deposit = async (contId, amount, transType) => {
      await transactionStore.deposit(contId, amount, transType);
    };
    const isValidContId = computed({
      get: () => transactionStore.isValidContId,
      set: (newValue) => (transactionStore.isValidContId = newValue),
    });

    const contIdField = ref("");
    onMounted(() => {
      contIdField.value.focus();
    });

    return {
      showConfirmationMsg,
      contId,
      amount,
      transType,
      validationMessage,
      deposit,
      formInvalid,
      isValidContId,
      contIdField,
    };
  },
  methods: {
    async submitForm() {
      if (this.formInvalid) {
        this.showConfirmationMsg = false;
        this.validationMessage = "최소 $1 이상 입력해주세요.";
      } else if (window.confirm("$" + this.amount + "을 입금하시겠습니까?")) {
        await this.deposit(this.contId, this.amount, this.transType);
        if (this.isValidContId) {
          this.showConfirmationMsg = true;
          document.addEventListener("keydown", this.handleKeyPress);
          this.validationMessage = "";
        } else {
          this.showConfirmationMsg = false;
          this.validationMessage =
            "잘못된 헌금 아이디입니다. 다시 시도해주세요.";
        }
      }
      this.$refs.contIdField.focus();
    },
    handleKeyPress(event) {
      if (event.key === "Enter" || event.key === "Escape") {
        this.handlePopupClosed();
      }
    },
    handlePopupClosed() {
      this.contId = "";
      this.amount = 0;
      this.transType = "CASH";
      document.removeEventListener("keydown", this.handleKeyPress);
      this.showConfirmationMsg = false;
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
.validation-msg {
  color: red;
  margin-top: 15px;
}
</style>
