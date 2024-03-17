<template>
  <div class="cafe-popup">
    <div class="cafe-popup-content">
      <h3 id="cafePopupTotal" class="cafe-popup-total">Total: ${{ total.toFixed(2) }}</h3>

      <div v-if="barcodeType === 'ORDER_NUMBER'">
        <h4 class="cafe-popup-header">주문 번호를 스캔해주세요.</h4>
        <button @click="closePopup">취소</button>
      </div>

      <div v-else-if="barcodeType === 'USER' && paymentType === 'BARCODE'">
        <h4 class="cafe-popup-header">
          {{ !isPaid ? "계산에 사용할 바코드를 스캔해 주세요." : "결제완료 되었습니다." }}
        </h4>
        <button @click="closePopup">{{ isPaid ? "확인" : "취소" }}</button>
      </div>

      <div v-else-if="barcodeType === 'DISABLED' && (paymentType === 'CASH' || paymentType === 'CC')">
        <h4 class="cafe-popup-header">{{ !isPaid ? "결제가 완료되었습니까?" : "시스템에 기록되었습니다." }}</h4>
        <div class="cafe-popup-button-container" v-if="!isPaid">
          <button id="makePayment" @click="makePayment">확인</button>
          <button id="closePopup" @click="closePopup">취소</button>
        </div>
        <button id="paidConfirmation" @click="closePopup" v-else>확인</button>
      </div>

      <!-- <div v-if="paymentType === 'BARCODE'">
        <h4 class="cafe-popup-header">
          {{ !isPaid ? "지불에 사용할 바코드를 스캔해 주세요." : "결제완료 되었습니다." }}
        </h4>
        <button @click="closePopup">{{ isPaid ? "확인" : "취소" }}</button>
      </div> -->

      <!-- <div v-else>
        <h4 class="cafe-popup-header">{{ !isPaid ? "결제가 완료되었습니까?" : "시스템에 기록되었습니다." }}</h4>
        <div class="cafe-popup-button-container" v-if="!isPaid">
          <button id="makePayment" @click="makePayment">확인</button>
          <button id="closePopup" @click="closePopup">취소</button>
        </div>
        <button id="paidConfirmation" @click="closePopup" v-else>확인</button>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      required: true,
    },
    isPaid: {
      type: Boolean,
      required: true,
    },
    paymentType: {
      type: String,
      required: true,
    },
    barcodeType: {
      type: String,
      required: true,
    },
  },
  methods: {
    closePopup() {
      this.$emit("close-cafe-popup");
    },
    makePayment() {
      this.$emit("make-payment");
    },
  },
};
</script>

<style>
.cafe-popup {
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

.cafe-popup-header {
  margin-bottom: 20px;
}

.cafe-popup-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
}

.cafe-popup-total {
  margin-bottom: 15px;
}

.cafe-popup-button-container {
  display: flex;
  gap: 10px;
}

button {
  width: 100%;
  padding: 10px 20px;
  background-color: red;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 15px;
}
</style>
