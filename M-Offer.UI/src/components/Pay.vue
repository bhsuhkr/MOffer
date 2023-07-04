<template>
  <div class="pay-container">
    <h3 class="pay-title">Pay</h3>
    <div class="transaction-container">
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
    <input ref="contIdField" type="text" @keydown.enter="handleEnterKey" />
  </div>
</template>

<script>
import "bootstrap/dist/css/bootstrap.min.css";
import { defineComponent } from "vue";
import { useTransactionStore } from "@/store";

export default defineComponent({
  name: "Pay",
  setup() {
    const fields = ["TransType", "TransTime", "RunningBalance"];
    const transactionStore = useTransactionStore();

    const pay = async (memberId) => {
      await transactionStore.pay(memberId);
    };
    const getMemberId = async (contId) => {
      await transactionStore.getMemberId(contId);
    };

    return {
      transactionData: transactionStore.transactions,
      fields,
      pay,
      getMemberId,
    };
  },
  methods: {
    handleEnterKey(event) {
      this.getMemberId(event.target.value);
      console.log("submitted", event.target.value);
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
</style>
