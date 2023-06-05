<template>
  <div class="transaction-container">
    <h3 class="title">Transactions</h3>
    <table id="tableComponent" class="table table-bordered table-striped">
      <thead>
        <tr>
          <!-- loop through each value of the fields to get the table header -->
          <th v-for="field in fields" :key="field">
            {{ field }}
            <i class="bi bi-sort-alpha-down" aria-label="Sort Icon"></i>
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- Loop through the list get the each student data -->
        <tr v-for="item in transactionData" :key="item">
          <td v-for="field in fields" :key="field">{{ item[field] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import "bootstrap/dist/css/bootstrap.min.css";

export default {
  name: "Transactions",
  props: {
    transactionData: {
      type: Array,
    },
    fields: {
      type: Array,
    },
  },
};
</script>

<style scoped>
.transaction-container {
  padding: 40px;
}
.title {
  margin-bottom: 30px;
}
</style>
