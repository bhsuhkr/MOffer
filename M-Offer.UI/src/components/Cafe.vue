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
        />
      </div>

      <h4>{{ scannedItems.length }} Items | Total: ${{ total.toFixed(2) }}</h4>
      <button class="pay-btn" @click="pay('BARCODE')">Pay with Barcode</button>
      <button class="pay-btn" @click="pay('CASH')">Paid by Cash</button>
      <button class="pay-btn" @click="pay('CC')">Paid by Credit Card</button>

      <p class="validation-msg">{{ validationMessage }}</p>

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
          <tr v-for="(field, index) in scannedItems" :key="index" @click="deleteRow(index)">
            <td>{{ field.product }}</td>
            <td>{{ field.price }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <CafePopup
      ref="cafe-popup"
      v-if="showPopup"
      :total="total"
      :isPaid="isPaid"
      :paymentType="paymentType"
      @close-cafe-popup="handlePopupClosed"
      @make-payment="makeCashOrCCPayment"
    />
  </div>
</template>

<script>
import "bootstrap/dist/css/bootstrap.min.css";
import { defineComponent, ref, onMounted, computed } from "vue";
import { useTransactionStore } from "@/store";
import CafePopup from "./CafePopup.vue";

export default defineComponent({
  name: "Cafe",
  components: {
    CafePopup,
  },
  setup() {
    // State variables
    const transactionStore = useTransactionStore();
    const titles = ["Product", "Price ($)"];
    let scannedItems = ref([]);
    let total = ref(0);
    let barcodeField = ref("");
    let validationMessage = ref("");
    let showPopup = ref(false);
    let scanUserBarcode = ref(false);
    let isPaid = ref(false);
    let paymentType = ref("BARCODE");

    const deleteRow = (index) => {
      const deletedPrice = parseFloat(scannedItems.value[index].price);
      scannedItems.value.splice(index, 1);
      total.value -= deletedPrice;
    };

    const isValidPhoneNumber = computed({
      get: () => transactionStore.isValidPhoneNumber,
      set: (newValue) => (transactionStore.isValidPhoneNumber = newValue),
    });

    const getBalance = async (personalBarcode) => {
      await transactionStore.getBalance(personalBarcode);
    };

    const getAllItemsAndPrices = async () => {
      await transactionStore.getAllItemsAndPrices();
    };

    const payCafe = async (barcodeInfo, item, paymentMethod) => {
      await transactionStore.payCafe(barcodeInfo, item, paymentMethod);
    };

    const itemList = computed({
      get: () => transactionStore.items,
      set: (newValue) => (transactionStore.items = newValue),
    });

    onMounted(() => {
      barcodeField.value.focus();
      getAllItemsAndPrices();
    });

    return {
      titles,
      scannedItems,
      total,
      barcodeField,
      validationMessage,
      showPopup,
      paymentType,
      scanUserBarcode,
      isPaid,
      isValidPhoneNumber,
      itemList,
      getBalance,
      deleteRow,
      payCafe,
    };
  },
  methods: {
    async handleEnterKey() {
      const barcode = this.$refs["barcodeField"].value;

      if (barcode) {
        // scan a barcode for products
        if (!this.scanUserBarcode) {
          // check if the product barcode is valid
          if (this.itemList.some((item) => item.itemNumber === barcode)) {
            // Extract item details
            const description = this.itemList.find((item) => item.itemNumber === barcode).itemDesc;
            const price = this.itemList.find((item) => item.itemNumber === barcode).price;
            const itemNumber = this.itemList.find((item) => item.itemNumber === barcode).itemNumber;

            // Add scanned item to the list
            this.scannedItems.push({ product: description, price, itemNumber });
            this.total += price;
            this.validationMessage = "";
          } else {
            this.validationMessage = "잘못된 바코드입니다. 다시 시도해 주세요.";
            this.showPopup = false;
          }
          // scan a personal barcode for pay
        } else {
          const personalBarcode = this.$refs["barcodeField"].value;
          if (personalBarcode) {
            await this.getBalance(personalBarcode);
            if (!this.isValidPhoneNumber) {
              this.validationMessage = "잘못된 바코드입니다. 다시 시도해 주세요.";
            } else if (this.balance <= -10) {
              this.validationMessage = "잔액이 부족합니다. $" + this.balance;
            } else {
              // TODO: add commit/rollback function
              for (const scannedItem of this.scannedItems) {
                await this.payCafe(personalBarcode, scannedItem.itemNumber, "SCAN");
              }

              this.validationMessage = "";
              this.isPaid = true;
            }
          }
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
    async pay(paymentType) {
      if (this.total && this.scannedItems.length) {
        this.validationMessage = "";
        this.showPopup = true;

        switch (paymentType) {
          case "BARCODE":
            this.scanUserBarcode = true;
            this.paymentType = "BARCODE";
            break;
          case "CASH":
            this.scanUserBarcode = false;
            this.paymentType = "CASH";
            break;
          case "CC":
            this.scanUserBarcode = false;
            this.paymentType = "CC";
            break;
        }
      } else {
        this.validationMessage = "지불할 아이템이 없습니다.";
      }
    },
    handlePopupClosed() {
      // paid and reset fields
      if (this.isPaid) {
        this.total = 0;
        this.scannedItems = [];
        this.showPopup = false;
        this.scanUserBarcode = false;
        this.isPaid = false;
        // not paid, close popup and switch input field to scan product barcode
      } else {
        this.showPopup = false;
        this.scanUserBarcode = false;
      }
    },
    async makeCashOrCCPayment() {
      // make cash or credit card tranactions
      for (const scannedItem of this.scannedItems) {
        await this.payCafe(0, scannedItem.itemNumber, this.paymentType);
      }

      this.validationMessage = "";
      this.isPaid = true;
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
  margin-bottom: 10px;
  height: 1px;
}
.barcode-input {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
  border: none;
  outline: none;
  caret-color: transparent;
  color: #fff;
}
.validation-msg {
  color: red;
}
.pay-btn {
  margin-bottom: 10px;
}
.table-text {
  font-size: 25px;
  font-weight: 500;
}
</style>
