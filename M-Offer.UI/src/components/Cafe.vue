<template>
  <div class="cafe-container">
    <div class="cafe-header">
      <h3>Cafe</h3>

      <div class="input-row">
        <input
          class="barcode-input"
          ref="barcodeField"
          type="text"
          @keydown.enter="handleEnterKey"
          v-on:blur="handleBlur"
          placeholder="여기를 먼저 누른 후 바코드를 스캔하세요."
        />
        <button class="submit-btn" @click="handleEnterKey">Submit</button>
      </div>

      <h4>Total: ${{ total }}</h4>
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
          <tr v-for="(field, index) in items" :key="index" @click="deleteRow(index)">
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
import { defineComponent, ref, onMounted } from "vue";

export default defineComponent({
  name: "Cafe",
  setup() {
    const titles = ["Product", "Price ($)"];
    let items = ref([]);
    let total = ref(0);

    const deleteRow = (index) => {
      const deletedPrice = parseFloat(items.value[index].price.replace("$", ""));
      items.value.splice(index, 1);
      total.value -= deletedPrice;
    };

    let barcodeField = ref("");
    onMounted(() => {
      barcodeField.value.focus();
    });

    return {
      titles,
      items,
      total,
      deleteRow,
      barcodeField,
    };
  },
  methods: {
    async handleEnterKey() {
      const barcode = this.$refs["barcodeField"].value;
      if (barcode) {
        const itemAndPrice = this.barcodeField.value.split("$");
        this.total += parseFloat(itemAndPrice[1]);
        this.items.push({ product: itemAndPrice[0], price: "$" + itemAndPrice[1] });
      }
      this.$refs["barcodeField"].value = "";
      this.$refs.barcodeField.focus();
    },
    async handleBlur() {
      let inputField = this.$refs["barcodeField"];
      if (inputField != null) {
        inputField.focus();
      }
    },
  },
});
</script>

<style scoped>
.cafe-container {
  margin: 20px 40px;
  width: 100%;
}
.input-row {
  display: flex;
}
.barcode-input {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
}
.submit-btn {
  border-radius: 3px;
  height: 30px;
  margin-top: 10px;
  margin-left: 10px;
  padding: 0 20px;
  max-width: 100px;
}
</style>
