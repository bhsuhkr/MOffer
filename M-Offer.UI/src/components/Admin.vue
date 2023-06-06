<template>
  <div class="admin-container">
    QR Code Generator
    <div>
      <input type="text" v-model="text" placeholder="Enter ID" />
      <button @click="generateQRCode">Generate QR Code</button>
      <div v-if="qrCodeData">
        <img :src="qrCodeData" alt="QR Code" />
      </div>
    </div>
  </div>
</template>
<script>
import QRCode from "qrcode";

export default {
  name: "Admin",
  data() {
    return {
      text: "",
      qrCodeData: "",
    };
  },
  methods: {
    generateQRCode() {
      QRCode.toDataURL(this.text)
        .then((url) => {
          this.qrCodeData = url;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>

<style scoped>
.admin-container {
  padding: 40px;
}
</style>
