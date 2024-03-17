<template>
  <div class="order-container">
    <div class="order-header">
      <h3>Order List</h3>

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
          <tr v-for="(field, index) in scannedItems" :key="index" @click="deleteRow(index)" :id="'item' + index">
            <td>{{ field.product }}</td>
            <td>{{ field.price }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    
  </div>
</template>

<script>
import "bootstrap/dist/css/bootstrap.min.css";
import { defineComponent, ref, computed } from "vue";
import { useTransactionStore } from "@/store";

export default defineComponent({
  name: "Order",
  setup() {
    // State variables
    const transactionStore = useTransactionStore();
    const titles = ["Product", "Price ($)"];
    const scannedItems = ref([{product:"test", price: 1}]);

    const deleteRow = (index) => {
      scannedItems.value.splice(index, 1);
    };

    const itemList = computed({
      get: () => transactionStore.items,
      set: (newValue) => (transactionStore.items = newValue),
    });


    return {
      deleteRow,
      titles,
      scannedItems,
      itemList
    };
  },
});
</script>

<style scoped>
.order-container {
  margin: 20px 40px;
  width: 100%;
}
</style>
