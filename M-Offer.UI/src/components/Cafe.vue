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
      <p class="validation-msg">{{ validationMessage }}</p>

      <h4>{{ items.length }} Itmes | Total: ${{ total }}.00</h4>
      <button class="pay-btn" @click="pay">Pay</button>
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

    <CafePopup ref="cafe-popup" v-if="showPopup" :total="total" @close-cafe-popup="handlePopupClosed" />
  </div>
</template>

<script>
import "bootstrap/dist/css/bootstrap.min.css";
import { defineComponent, ref, onMounted } from "vue";
import CafePopup from "./CafePopup.vue";

export default defineComponent({
  name: "Cafe",
  components: {
    CafePopup,
  },
  setup() {
    const titles = ["Product", "Price ($)"];
    let items = ref([]);
    let total = ref(0);
    let barcodeField = ref("");
    let validationMessage = ref("");
    let showPopup = ref(false);

    const deleteRow = (index) => {
      const deletedPrice = parseFloat(items.value[index].price.replace("$", ""));
      items.value.splice(index, 1);
      total.value -= deletedPrice;
    };

    onMounted(() => {
      barcodeField.value.focus();
    });

    return {
      titles,
      items,
      total,
      barcodeField,
      validationMessage,
      showPopup,
      deleteRow,
    };
  },
  methods: {
    async handleEnterKey() {
      const barcode = this.$refs["barcodeField"].value;
      if (barcode) {
        const itemAndPrice = this.barcodeField.value.split("$");
        if (itemAndPrice[0] && itemAndPrice[1]) {
          this.total += parseFloat(itemAndPrice[1]);
          this.items.unshift({ product: itemAndPrice[0], price: "$" + itemAndPrice[1] });
          this.validationMessage = "";
        } else {
          this.validationMessage = "잘못된 바코드입니다. 다시 시도해 주세요.";
          this.showPopup = false;
        }
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
    async pay() {
      if (this.total) {
        this.validationMessage = "";
        this.showPopup = true;
      } else {
        this.validationMessage = "지불할 아이템이 없습니다.";
      }
    },
    handlePopupClosed() {
      this.total = 0;
      this.items = [];
      this.showPopup = false;
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
.validation-msg {
  color: red;
}
.pay-btn {
  margin-bottom: 10px;
}
</style>
