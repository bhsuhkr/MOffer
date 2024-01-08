<template>
  <div class="cafe-popup">
    <div class="cafe-popup-content">
      <h4 class="cafe-popup-header" v-if="!makePayment">지불에 사용할 바코드를 스캔해 주세요.</h4>
      <h4 class="cafe-popup-header" v-else>결제완료 되었습니다.</h4>
      <p>Total: ${{ total }}.00</p>
      <button @click="closePopup" v-if="!makePayment">취소</button>
      <button @click="closePopup" v-else>확인</button>
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
    makePayment: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    closePopup() {
      this.$emit("close-cafe-popup");
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
