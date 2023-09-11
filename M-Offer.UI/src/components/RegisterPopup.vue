<template>
  <div class="register-popup">
    <div class="register-popup-content">
      <h4 class="register-popup-header">가입 완료하였습니다.</h4>
      <p class="content">이름: {{ korName }}</p>
      <p class="content">전화번호: {{ phoneNumber }}</p>
      <p class="content">이메일: {{ email }}</p>
      <p class="content">바코드:</p>
      <canvas id="barcode" class="barcode-canvas"></canvas>

      <button @click="closePopup">확인</button>
    </div>
  </div>
</template>

<script>
import bwipjs from "bwip-js";

export default {
  props: {
    phoneNumber: {
      type: String,
      required: true,
    },
    korName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  mounted() {
    const id = this.phoneNumber.replace(/\D/g, "") + this.email.substring(0, 4);
    bwipjs.toCanvas("barcode", {
      bcid: "pdf417",
      text: id,
      scale: 3,
      height: 10,
      textxalign: "center",
    });
  },
  methods: {
    closePopup() {
      this.$emit("close-register-popup");
    },
  },
};
</script>

<style>
.register-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.register-popup-header {
  margin-bottom: 20px;
}

.register-popup-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
}

.content {
  margin-bottom: 6px;
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
.barcode-canvas {
  margin-bottom: 10px;
  width: 100%;
}
</style>
