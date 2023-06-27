<template>
  <div class="pay-container">
    <h3 class="pay-title">Pay</h3>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Pay",
});
</script>

<style scoped>
.item-row {
  margin-bottom: 20px;
}
.pay-container {
  margin: 10px 40px;
  width: 100%;
}
.message-container {
  border: solid 1px green;
  margin-top: 20px;
  padding: 30px;
  width: 30%;
}
.confirm-btn {
  width: 20%;
  background-color: #4caf50;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.input-fields {
  font-size: 15px;
}
#member-id {
  margin-left: 10px;
}
#member-eng-name,
#member-kor-name,
#member-tel {
  margin-left: 25px;
}
#memeber-email {
  margin-left: 40px;
}
#member-id-search,
#member-eng-name-search,
#member-kor-name-search,
#member-tel-search,
#memeber-email-search {
  margin-left: 10px;
}
#item-menu,
#item-quantity {
  margin-left: 55px;
}
</style>
