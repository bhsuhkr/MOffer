<template>
  <div class="popup">
    <div class="popup-content">
      <h4>입금이 완료되었습니다.</h4>
      <p>헌금 아이디: {{ contId }}</p>
      <p>금액: ${{ amount }}</p>
      <p>지불 방법: {{ transType }}</p>
      <button @click="closePopup">확인</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    contId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    transType: {
      type: String,
      required: true,
    },
  },
  methods: {
    closePopup() {
      this.$emit("close-popup");
    },
  },
};
</script>

<style>
.popup {
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

.popup-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
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
</style>
