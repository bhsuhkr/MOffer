<template>
  <div class="dailysummary-container">
    <div class="dailysummary-header">
      <h3 class="dailysummary-title">Daily Summary</h3>
      <button @click="clearHistory()" class="clear-btn">기록 지우기</button>
    </div>
    <div class="transaction-container">
      <div class="input-row">
        <input
          class="cont-input"
          ref="dailyDate"
          type="text"
          @keydown.enter="handleEnterKey"
          placeholder="여기에 날짜를 기입해주세요 (Optional)"
        />
        <button id="submit" class="submit-btn" @click="handleEnterKey">Submit</button>
      </div>
      <p id="validation-msg" class="validation-msg">{{ validationMessage }}</p>

      <table class="table table-bordered table-text">
        <thead>
          <tr>
            <th v-for="field in titles" :key="field">
              {{ field }}
              <i class="bi bi-sort-alpha-down" aria-label="Sort Icon"></i>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in dailySummary"
            :key="item"
            :class="getRowColor(index)"
          >
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
import { useSummaryStore } from "@/store";

export default defineComponent({
  name: "DailySummary",
  setup() {
    let validationMessage = ref("");
    const titles = ["Summary Date", "Daily Total Debit", "Daily Total Credit", 
      "Daily Total Refund", "Daily Balance", "Daily Active Members", "Daily New Members", 
      "Grand Total Tx Balance", "Grand Total Member Balance", "Grand Total Active Members"];
    const fields = ["SummaryDate", "DailyTotalDebitAmount", "DailyTotalCreditAmount", 
      "DailyTotalRefundAmount", "DailyBalance", "DailyActiveMembers", "DailyNewMembers",
      "GrandTotalTransBalance", "GrandTotalMemberBalance", "GrandTotalActiveMembers"];
    const summaryStore = useSummaryStore();
    const getSummary = async (dailyDate) => {
      //summaryStore.summaryData = [];
      await summaryStore.getSummary(dailyDate);
    };
    const clearSummary = async () => {
      await summaryStore.clearSummary();
    };
    const dailySummary = computed({
      get: () => summaryStore.summaryData,
      set: (newValue) => (summaryStore.summaryData = newValue),
    });
    
    const dailyDate = ref("");
    onMounted(() => {
      dailyDate.value.focus();
    });

    return {
      validationMessage,
      dailyDate,
      dailySummary,
      getSummary,
      clearSummary,
      fields,
      titles,
    };
  },
  methods: {
    async handleEnterKey() {
      const dailyDateValue = this.$refs["dailyDate"].value;
      console.log("date: " + dailyDateValue);
      await this.getSummary(dailyDateValue);
      this.validationMessage = "";
      this.$refs.dailyDate.focus();
    },
    getRowColor(index) {
      return {
        "even-row": index % 2 == 0,
        "odd-row": index % 2 == 1,
      };
    },
    clearHistory() {
      this.clearSummary();
      this.$refs.dailyDate.value = "";
      this.$refs.dailyDate.focus();
    },
    formatPrice(value) {
        let val = (value/1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },    
  },
});
</script>

<style scoped>
.dailysummary-container {
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
.dailysummary-header {
  display: flex;
  justify-content: space-between;
}
.input-row {
  display: flex;
}
.submit-btn {
  border-radius: 3px;
  height: 30px;
  margin-top: 10px;
  margin-left: 10px;
  padding: 0 20px;
  max-width: 100px;
}
.validation-msg {
  color: red;
}
.validation-msg-success {
  color: #4caf50;
}
.odd-row {
  --bs-table-accent-bg: white;
  --bs-table-color: black;
}
.even-row {
  --bs-table-accent-bg: #616461;
  --bs-table-color: white;
}
.table-text {
  font-size: 25px;
}
.clear-btn {
  background-color: red;
  margin-top: 0px;
  margin-bottom: 10px;
  width: 200px;
  border-radius: 4px;
  padding: 10px 20px;
  color: #fff;
  border: none;
}
</style>
