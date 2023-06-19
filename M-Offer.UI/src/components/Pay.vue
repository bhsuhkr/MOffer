<template>
  <div class="pay-container">
    <h3 class="pay-title">Pay</h3>
    <div class="input-fields">
      <div class="item-row">
        <label for="member-id">헌금아이디</label>
        <input type="text" id="member-id" />
        <button id="member-id-search">Search</button>
      </div>
      <div class="item-row">
        <label for="member-eng-name">영문이름</label>
        <input type="text" id="member-eng-name" />
        <button id="member-eng-name-search">Search</button>
      </div>
      <div class="item-row">
        <label for="member-kor-name">한글이름</label>
        <input type="text" id="member-kor-name" />
        <button id="member-kor-name-search">Search</button>
      </div>
      <div class="item-row">
        <label for="member-tel">전화번호</label>
        <input type="text" id="member-tel" />
        <button id="member-tel-search">Search</button>
      </div>
      <div class="item-row">
        <label for="member-email">이메일</label>
        <input type="text" id="memeber-email" />
        <button id="memeber-email-search">Search</button>
      </div>
      <div class="item-row">
        <label for="item-menu">메뉴</label>
        <select name="cars" id="item-menu">
          <option value="Main">Main Meal</option>
          <option value="Coffee">Coffee</option>
          <option value="Donut">Donut</option>
        </select>
      </div>
      <div class="item-row">
        <label for="item-quantity">수량</label>
        <input type="number" id="item-quantity" />
      </div>
      <button class="confirm-btn">Confirm</button>
    </div>
    <div class="message-container">
      결재가 완료되었습니다.<br />
      아이템: Main Meal<br />
      Unit Price: $2.00<br />
      QTy: 4<br />

      총 금액: $8.00<br />
      Balance: $102.00<br />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Pay",
  data() {
    return {
      memberId: false,
      memberEngName: "",
      memberKorName: "",
      memberTel: "",
      memberEmail: "",
    };
  },
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
