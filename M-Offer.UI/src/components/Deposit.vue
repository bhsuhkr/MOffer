<template>
  <div class="deposit-container">
    <h3>Deposit</h3>
    <form @submit.prevent="submitForm" class="deposit-form">
      <div>
        <label for="phoneNumber">전화번호:</label>
        <input
          @input="onPhoneNumberInput"
          placeholder="(123)-123-1234"
          maxlength="14"
          type="tel"
          id="phoneNumber"
          ref="phoneNumberField"
          v-model="phoneNumber"
          @keyup.enter="handleEnterKey"
          required
        />
      </div>
      <div>
        <label for="amount">금액 ($):</label>
        <input type="number" id="amount" ref="amountField" v-model.number.trim="amount" required />
      </div>
      <div>
        <label for="transType">지불 방법:</label>
        <select id="transType" v-model="transType" ref="transTypeField" required>
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
      :phoneNumber="phoneNumber"
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
    let phoneNumber = ref("");
    let amount = ref(0);
    let transType = ref("CASH");
    let validationMessage = ref("");

    const rules = {
      phoneNumber: { required },
      amount: { required, minValue: minValue(1) },
      transType: { required },
    };

    let v$ = useVuelidate(rules, { phoneNumber, amount, transType });
    const formInvalid = computed(() => v$.value.$invalid);

    const transactionStore = useTransactionStore();
    transactionStore.getTodayTransactions();
    const deposit = async (phoneNumber, amount, transType) => {
      await transactionStore.deposit(phoneNumber, amount, transType);
    };
    const isValidPhoneNumber = computed({
      get: () => transactionStore.isValidPhoneNumber,
      set: (newValue) => (transactionStore.isValidPhoneNumber = newValue),
    });

    const amountField = ref("");
    const phoneNumberField = ref("");
    onMounted(() => {
      phoneNumberField.value.focus();
    });

    return {
      showConfirmationMsg,
      amount,
      transType,
      validationMessage,
      deposit,
      formInvalid,
      isValidPhoneNumber,
      amountField,
      phoneNumberField,
      phoneNumber,
    };
  },
  methods: {
    async submitForm() {
      if (this.formInvalid) {
        this.showConfirmationMsg = false;
        this.validationMessage = "최소 $1 이상 입력해주세요.";
      } else if (window.confirm("$" + this.amount + "을 입금하시겠습니까?")) {
        const rowNumber = this.phoneNumber.replace(/\D/g, "");
        await this.deposit(rowNumber, this.amount, this.transType);
        if (this.isValidPhoneNumber) {
          this.showConfirmationMsg = true;
          document.addEventListener("keydown", this.handleKeyPress);
          this.validationMessage = "";
        } else {
          this.showConfirmationMsg = false;
          this.validationMessage = "없는 전화번호입니다. 다시 시도해주세요.";
        }
      }
      this.$refs.phoneNumberField.focus();
    },
    handleKeyPress(event) {
      if (event.key === "Enter" || event.key === "Escape") {
        this.handlePopupClosed();
      }
    },
    handlePopupClosed() {
      this.phoneNumber = "";
      this.amount = 0;
      this.transType = "CASH";
      document.removeEventListener("keydown", this.handleKeyPress);
      this.showConfirmationMsg = false;
    },
    onPhoneNumberInput(event) {
      this.phoneNumber = event.target.value.replace(/\D/g, "");

      const match = this.phoneNumber.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
      if (match) {
        if (match[1] === "") {
          this.phoneNumber = "";
        } else if (match[2] === "" && match[3] === "") {
          this.phoneNumber = `(${match[1]}`;
        } else if (match[3] === "") {
          this.phoneNumber = `(${match[1]})-${match[2]}`;
        } else {
          this.phoneNumber = `(${match[1]})-${match[2]}-${match[3]}`;
        }
      }
    },
    handleEnterKey() {
      this.$refs.amountField.focus();
      this.amount = '';
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
input[type="tel"],
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
