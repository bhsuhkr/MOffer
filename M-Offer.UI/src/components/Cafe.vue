<template>
  <div class="cafe-container">
    <div class="cafe-header">
      <h3>Cafe</h3>

      <div class="input-row">
        <input
          id="barcodeInput"
          class="barcode-input"
          ref="barcodeField"
          type="text"
          @keydown.enter="handleEnterKey"
          v-on:blur="handleBlur"
        />
      </div>

      <h4>{{ scannedItems.length }} Items | Total: ${{ total.toFixed(2) }}</h4>
      <div class="button-container">
        <button id="barcodeButton" class="pay-btn" @click="pay('BARCODE')">
          Pay with Barcode <img src="../../img/barcode.svg" class="btn-icon" />
        </button>
        <button id="cashButton" class="pay-btn btn-margin" @click="pay('CASH')">
          Paid by Cash <img src="../../img/cash.svg" class="btn-icon" />
        </button>
        <!-- <button id="cardButton" class="pay-btn" @click="pay('CC')">
          Paid by Credit Card <img src="../../img/credit.svg" class="btn-icon" />
        </button> -->
      </div>

      <p id="validationMsg" class="validation-msg">{{ validationMessage }}</p>

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
          <tr v-for="(field, index) in scannedItems" :key="index" :id="'item' + index">
            <td>{{ field.item }}</td>
            <td>${{ field.price.toFixed(2) }}</td>
            <td>
              <button @click="deleteItem(index)" class="delete-btn">x</button>
            </td>
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
      :barcodeType="barcodeType"
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
import { PAYMENT_TYPES, BARCODE_TYPES } from "@/constants";

export default defineComponent({
  name: "Cafe",
  components: {
    CafePopup,
  },
  setup() {
    // State variables
    const transactionStore = useTransactionStore();
    const titles = ["Item", "Price ($)"];
    const scannedItems = ref([]);
    const total = ref(0);
    const orderNumber = ref(0);
    const barcodeField = ref("");
    const validationMessage = ref("");
    const showPopup = ref(false);
    const barcodeType = ref(BARCODE_TYPES.ITEM);
    const isPaid = ref(false);
    const paymentType = ref(PAYMENT_TYPES.BARCODE);

    const isValidPhoneNumber = computed({
      get: () => transactionStore.isValidPhoneNumber,
      set: (newValue) => (transactionStore.isValidPhoneNumber = newValue),
    });

    const getBalance = async (personalBarcode) => {
      await transactionStore.getBalance(personalBarcode);
    };

    const balance = computed({
      get: () => transactionStore.balance,
      set: (newValue) => (transactionStore.balance = newValue),
    });

    const getAllItemsAndPrices = async () => {
      await transactionStore.getAllItemsAndPrices();
    };

    const payCafe = async (barcodeInfo, item, paymentMethod, orderNumber) => {
      await transactionStore.payCafe(barcodeInfo, item, paymentMethod, orderNumber);
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
      orderNumber,
      barcodeField,
      validationMessage,
      showPopup,
      paymentType,
      barcodeType,
      isPaid,
      isValidPhoneNumber,
      itemList,
      getBalance,
      balance,
      payCafe,
    };
  },
  methods: {
    scanItemBarcode(barcode) {
      // check if the item barcode is valid
      if (this.itemList.some((item) => item.itemNumber === barcode)) {
        // Extract item details
        const description = this.itemList.find((item) => item.itemNumber === barcode).itemDesc;
        const price = this.itemList.find((item) => item.itemNumber === barcode).price;
        const itemNumber = this.itemList.find((item) => item.itemNumber === barcode).itemNumber;

        // Add scanned item to the list
        this.scannedItems.push({ item: description, price, itemNumber });
        this.total += price;
        this.validationMessage = "";
      } else {
        this.validationMessage = "잘못된 아이템 바코드입니다. 다시 시도해 주세요.";
        this.$refs["barcodeField"].value = "";
        this.showPopup = false;
      }
    },
    deleteItem(index) {
      const deletedPrice = parseFloat(this.scannedItems[index].price);
      this.scannedItems.splice(index, 1);
      this.total -= deletedPrice;
    },
    async handleEnterKey() {
      // A single input field takes item barcode, user barcode, and order number barcode.
      const barcode = this.$refs["barcodeField"].value;

      if (barcode && this.barcodeType === BARCODE_TYPES.ITEM) {
        this.scanItemBarcode(barcode);
      } else if (barcode && this.barcodeType === BARCODE_TYPES.ORDER_NUMBER) {
        // Validate order number
        if (barcode >= 1 && barcode <= 30) {
          this.orderNumber = barcode;
          switch (this.paymentType) {
            case PAYMENT_TYPES.BARCODE:
              this.barcodeType = BARCODE_TYPES.USER;
              break;
            case PAYMENT_TYPES.CASH:
            case PAYMENT_TYPES.CC:
              this.barcodeType = BARCODE_TYPES.DISABLED;
              break;
          }
        } else {
          this.validationMessage = "잘못된 주문 번호 바코드입니다. 다시 시도해 주세요.";
        }
      } else if (barcode && this.barcodeType === BARCODE_TYPES.USER) {
        await this.getBalance(barcode);

        // Check if the user barcode is valid and has the balance to pay
        if (!this.isValidPhoneNumber) {
          this.validationMessage = "잘못된 유저 바코드입니다. 다시 시도해 주세요.";
          this.$refs["barcodeField"].value = "";
        } else if (this.balance - this.total < 0) {
          this.validationMessage = "잔액이 부족합니다. 사용 가능 금액: $" + this.balance;
        } else if (this.isValidPhoneNumber && this.balance - this.total >= 0) {
          for (const scannedItem of this.scannedItems) {
            await this.payCafe(barcode, scannedItem.itemNumber, "SCAN", this.orderNumber);
          }

          this.validationMessage = "";
          this.isPaid = true;
        }
      }

      // Reset input field
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
      if (paymentType && this.total && this.scannedItems.length) {
        this.validationMessage = "";
        this.showPopup = true;
        this.barcodeType = BARCODE_TYPES.ORDER_NUMBER;
        this.paymentType = paymentType;
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
        this.isPaid = false;
        // not paid, close popup and switch input field to scan item barcode
      } else {
        this.showPopup = false;
      }
      this.barcodeType = BARCODE_TYPES.ITEM;
      this.paymentType = PAYMENT_TYPES.BARCODE;
    },
    async makeCashOrCCPayment() {
      // make cash or credit card tranactions
      for (const scannedItem of this.scannedItems) {
        await this.payCafe(0, scannedItem.itemNumber, this.paymentType, this.orderNumber);
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
.button-container {
  display: flex;
  margin-bottom: 30px;
  .pay-btn {
    min-height: 60px;
    font-weight: 500;
    font-size: 18px;
  }
  .btn-margin {
    margin-left: 20px;
    margin-right: 20px;
  }
  .btn-icon {
    width: 30px;
    padding-bottom: 3px;
    margin-left: 5px;
  }
}
.delete-btn {
  background-color: red;
}
</style>
