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
            <td>{{ field.item }}</td>
            <td>{{ field.orderNumber }}</td>
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
    const titles = ["Item", "Order Number"];
    const scannedItems = ref([]);

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
      itemList,
    };
  },
  mounted() {
    // Establish WebSocket connection when the component is mounted
    this.websocket = new WebSocket("ws://localhost:3001"); // Replace with your server URL

    // Event listener for WebSocket connection opened
    this.websocket.onopen = () => {
      console.log("WebSocket connection established");
    };

    // Event listener for WebSocket messages received
    this.websocket.onmessage = (event) => {
      const order = JSON.parse(event.data);
      console.log("Order received from server:", order);
      this.scannedItems.push(order);
    };

    // Event listener for WebSocket connection closed
    this.websocket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // Event listener for WebSocket connection errors
    this.websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
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
