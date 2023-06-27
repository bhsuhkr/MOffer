<template>
  <div class="balance-inquiry-container">
    <h3>Balance Inquiry</h3>
    <p>남은 금액:</p>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "BalanceInquiry",
});
</script>

<style scoped>
.balance-inquiry-container {
  margin: 20px 40px;
  width: 100%;
}
</style>
