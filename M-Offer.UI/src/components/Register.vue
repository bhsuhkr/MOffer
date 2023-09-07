<template>
  <div class="register-container">
    <h3>Register</h3>
    <form @submit.prevent="submitForm" class="register-form">
      <div>
        <label for="phoneNumber">전화번호:</label>
        <input
          @input="onPhoneNumberInput"
          placeholder="(123)-123-1234"
          maxlength="14"
          type="tel"
          id="phoneNumber"
          ref="phoneNumberField"
          v-model="phoneNumber"
          required
        />
      </div>
      <div>
        <label for="korName">한글 이름:</label>
        <input
          type="text"
          id="korName"
          ref="korNameField"
          v-model="korName"
          required
        />
      </div>
      <div>
        <label for="engName">영문 이름:</label>
        <input
          type="text"
          id="engName"
          ref="engNameField"
          v-model="engName"
          required
        />
      </div>
      <div>
        <label for="email">이메일:</label>
        <input
          type="email"
          id="email"
          ref="emailField"
          v-model="email"
          required
        />
      </div>

      <button type="submit" :disabled="showConfirmationMsg">Register</button>
      <p class="validation-msg">{{ validationMessage }}</p>
    </form>
    
    <RegisterPopup
      ref="register-popup"
      v-if="showConfirmationMsg"
      :phoneNumber="phoneNumber"
      :korName="korName"
      :email="email"
      @close-register-popup="handlePopupClosed"
    />
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useRegisterStore } from "@/store";
import RegisterPopup from "./RegisterPopup.vue";

export default defineComponent({
  name: "Register",
  components: {
    RegisterPopup,
  },
  setup() {
    let showConfirmationMsg = ref(false);
    let phoneNumber = ref("");
    let engName = ref("");
    let korName = ref("");
    let email = ref("");
    let validationMessage = ref("");

    const rules = {
      phoneNumber: { required },
      engName: { required },
      korName: { required },
      email: { required },
    };

    let v$ = useVuelidate(rules, { phoneNumber, engName, korName, email });
    const formInvalid = computed(() => v$.value.$invalid);

    const registerStore = useRegisterStore();

    const register = async (phoneNumber, engName, korName, email) => {
      await registerStore.register(phoneNumber, engName, korName, email);
    };

    const isRegisterd = computed({
      get: () => registerStore.isRegisterd,
      set: (newValue) => (registerStore.isRegisterd = newValue),
    });

    const phoneNumberField = ref("");
    onMounted(() => {
      phoneNumberField.value.focus();
    });

    return {
      showConfirmationMsg,
      engName,
      korName,
      email,
      validationMessage,
      formInvalid,
      phoneNumberField,
      phoneNumber,
      register,
      isRegisterd,
    };
  },
  methods: {
    async submitForm() {
      if (this.formInvalid) {
        this.showConfirmationMsg = false;
        this.validationMessage = "모든 정보를 입력해주세요.";
      } else {
        this.validationMessage = "";
        const rowNumber = this.phoneNumber.replace(/\D/g, "");
        await this.register(rowNumber, this.engName, this.korName, this.email);
        if (this.isRegisterd) {
          this.showConfirmationMsg = true;
          document.addEventListener("keydown", this.handleKeyPress);
          this.validationMessage = "";
        } else {
          this.validationMessage = "이미 사용중인 전화번호입니다.";
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
    handleKeyPress(event) {
      if (event.key === "Enter" || event.key === "Escape") {
        this.handlePopupClosed();
      }
    },
    handlePopupClosed() {
      this.phoneNumber = "";
      this.engName = "";
      this.korName = "";
      this.email = "";
      this.$refs.phoneNumberField.focus();
      document.removeEventListener("keydown", this.handleKeyPress);
      this.showConfirmationMsg = false;
    },
  },
});
</script>

<style scoped>
.register-container {
  margin: 20px 40px;
  width: 100%;
}
.register-form {
  margin-top: 20px;
  max-width: 400px;
}
input[type="tel"],
input[type="email"],
input[type="text"],
select {
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
}
.validation-msg {
  color: red;
  margin-top: 15px;
}
</style>
