<template>
  <div class="balance-inquiry-container">
    <h3>Balance Inquiry</h3>
    <input
      class="cont-input"
      ref="contIdField"
      type="text"
      @keydown.enter="handleEnterKey"
      placeholder="여기를 먼저 누른 후 바코드를 스캔하세요."
    />
    <p class="balance-text" v-if="isValidContId">남은 금액: ${{ balance }}</p>
    <p class="balance-validation" v-if="!isValidContId">
      잘못된 아이디입니다. 다시 시도해 주세요.
    </p>
  </div>
</template>

<script>
import { defineComponent, computed, onMounted, ref } from "vue";
import { useTransactionStore } from "@/store";

export default defineComponent({
  name: "BalanceInquiry",
  setup() {
    const transactionStore = useTransactionStore();
    const getBalance = async (contId) => {
      await transactionStore.getBalance(contId);
    };
    const balance = computed({
      get: () => transactionStore.balance,
      set: (newValue) => (transactionStore.balance = newValue),
    });
    const isValidContId = computed({
      get: () => transactionStore.isValidContId,
      set: (newValue) => (transactionStore.isValidContId = newValue),
    });

    const contIdField = ref("");
    onMounted(() => {
      contIdField.value.focus();
    });

    return {
      getBalance,
      balance,
      isValidContId,
      contIdField,
    };
  },
  methods: {
    handleEnterKey(event) {
      this.getBalance(event.target.value);
      this.$refs["contIdField"].value = "";
    },
  },
});
</script>

<style scoped>
.balance-inquiry-container {
  margin: 20px 40px;
  width: 100%;
}
.cont-input {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 20px;
}
.balance-text {
  font-weight: 600;
  font-size: 20px;
}
.balance-validation {
  color: red;
}
</style>
