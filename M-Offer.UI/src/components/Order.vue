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
          <tr v-for="(order, index) in scannedItems" :key="index" :id="'order' + index">
            <td>
              <P v-for="(item, orderIndex) in order.item" :key="orderIndex" :id="'item' + orderIndex">
                {{ item.name }}({{ item.count }})
              </P>
            </td>
            <td>{{ order.orderNumber }}</td>
            <td>
              <button @click="completeOrder(index)" class="complete-btn">주문 완료</button>
            </td>
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

    const itemList = computed({
      get: () => transactionStore.items,
      set: (newValue) => (transactionStore.items = newValue),
    });

    const getAllItemsAndPrices = async () => {
      await transactionStore.getAllItemsAndPrices();
    };

    return {
      titles,
      scannedItems,
      itemList,
      getAllItemsAndPrices,
    };
  },
  mounted() {
    this.getAllItemsAndPrices();

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

      const description = this.itemList.find((item) => item.itemNumber === order.item[0].name).itemDesc;
      const existingOrderIndex = this.scannedItems.findIndex((item) => item.orderNumber === order.orderNumber);

      if (existingOrderIndex !== -1) {
        const existingItemIndex = this.scannedItems[existingOrderIndex].item.findIndex(
          (item) => item.name === order.item[0].name
        );

        if (existingItemIndex !== -1) {
          this.scannedItems[existingOrderIndex].item[existingItemIndex].count++;
        } else {
          this.scannedItems[existingOrderIndex].item.push({ name: description, count: 1 });
        }
      } else {
        this.scannedItems.push({
          orderNumber: order.orderNumber,
          item: [{ name: description, count: 1 }],
        });
      }

      localStorage.setItem("scannedOrders", JSON.stringify(this.scannedItems));
    };

    window.addEventListener("load", () => {
      const storedOrders = localStorage.getItem("scannedOrders");
      if (storedOrders) {
        this.scannedItems = JSON.parse(storedOrders);
      }
    });

    // Event listener for WebSocket connection closed
    this.websocket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // Event listener for WebSocket connection errors
    this.websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  },
  methods: {
    completeOrder(index) {
      this.scannedItems.splice(index, 1);
      localStorage.setItem("scannedOrders", JSON.stringify(this.scannedItems));
    },
  },
});
</script>

<style scoped>
.order-container {
  margin: 20px 40px;
  width: 100%;
}

.table-text {
  font-size: 25px;
  font-weight: 500;
}
</style>
