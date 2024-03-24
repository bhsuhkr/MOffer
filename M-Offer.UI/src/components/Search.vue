<template>
  <div class="search-container">
    <div class="search-header">
      <h3>Search Barcode</h3>
      <button @click="clearBarcode(true)" class="clear-btn">기록 지우기</button>
    </div>
    <form @submit.prevent="submitForm" class="search-form">
      <div>
        <label for="phoneNumber">전화번호:</label>
        <input
          @input="onPhoneNumberInput"
          placeholder="(123)-123-1234"
          maxlength="14"
          type="tel"
          id="phoneNumber"
          ref="phoneNumberField"
          autocomplete="off"
          v-model="phoneNumber"
          required
        />
      </div>
      <div>
        <label for="email">이메일:</label>
        <input type="email" id="email" ref="emailField" autocomplete="off" v-model="email" required />
      </div>

      <button type="submit">Search</button>
      <p class="validation-msg">{{ validationMessage }}</p>
    </form>

    <canvas id="barcode" class="barcode-canvas"></canvas>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useTransactionStore } from "@/store";
import bwipjs from "bwip-js";

export default defineComponent({
  name: "Search",
  setup() {
    let phoneNumber = ref("");
    let email = ref("");
    let validationMessage = ref("");
    const transactionStore = useTransactionStore();

    const validateBarcode = async (barcodeInfo) => {
      await transactionStore.validateBarcode(barcodeInfo, false);
    };

    const isValidPhoneNumber = computed({
      get: () => transactionStore.isValidPhoneNumber,
      set: (newValue) => (transactionStore.isValidPhoneNumber = newValue),
    });

    const rules = {
      phoneNumber: { required },
      email: { required },
    };

    let v$ = useVuelidate(rules, { phoneNumber, email });
    const formInvalid = computed(() => v$.value.$invalid);

    const phoneNumberField = ref("");
    onMounted(() => {
      phoneNumberField.value.focus();
    });

    return {
      validateBarcode,
      isValidPhoneNumber,
      email,
      validationMessage,
      formInvalid,
      phoneNumberField,
      phoneNumber,
    };
  },
  methods: {
    async submitForm() {
      if (this.formInvalid) {
        this.showConfirmationMsg = false;
        this.validationMessage = "모든 정보를 입력해주세요.";
      } else {
        this.clearBarcode(false);
        const rowNumber = this.phoneNumber.replace(/\D/g, "");
        await this.validateBarcode(rowNumber);

        if (this.isValidPhoneNumber) {
          const id = this.phoneNumber.replace(/\D/g, "") + this.email.substring(0, 4);
          bwipjs.toCanvas("barcode", {
            bcid: "pdf417",
            text: id,
            scale: 3,
            height: 10,
            textxalign: "center",
          });
        } else {
          this.validationMessage = "가입되지 않은 정보입니다.";
        }
      }
    },
    onPhoneNumberInput(event) {
      this.phoneNumber = event.target.value.replace(/\D/g, "");

      const match = this.phoneNumber.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
      if (match) {
        if (match[1] === "") {
          this.phoneNumber = "";
        } else if (match[2] === "" && match[3] === "") {
          this.phoneNumber = `(${match[1]}`;
        } else if (match[3] === "") {
          this.phoneNumber = `(${match[1]})-${match[2]}`;
        } else {
          this.phoneNumber = `(${match[1]})-${match[2]}-${match[3]}`;
        }
      }
    },
    clearBarcode(clearFields) {
      const canvas = document.getElementById("barcode");
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
      this.validationMessage = "";
      if (clearFields) {
        this.phoneNumber = "";
        this.email = "";
        this.$refs.phoneNumberField.focus();
      }
    },
  },
});
</script>

<style scoped>
.search-container {
  margin: 20px 40px;
  width: 100%;
}
.search-form {
  margin-top: 20px;
  max-width: 400px;
}
input[type="tel"],
input[type="email"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
button {
  width: 100%;
  padding: 10px 20px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 15px;
  font-weight: 500;
  font-size: 18px;
}
.validation-msg {
  color: red;
  margin-top: 15px;
}
.search-header {
  display: flex;
  justify-content: space-between;
}
.clear-btn {
  background-color: red;
  margin-top: 0px;
  margin-bottom: 10px;
  width: 200px;
}
.barcode-canvas {
  margin-top: 30px;
  max-width: 400px;
  min-width: 330px;
}
</style>
