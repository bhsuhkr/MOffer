<template>
  <div class="login-container">
    <h2>M Offer Login</h2>
    <div class="form">
      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" id="username" v-model="username" />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" />
      </div>
      <p class="validation" v-if="showValidationMessage">아이디와 비밀번호가 일치하지 않습니다.</p>
      <button id="loginButton" @click="login(this.username, this.password)">Login</button>
      <div class="form-group">
        <br /><br />
        <label>Quick Links</label>
        <br /><a href="/pay">Pay App</a> <br /><a href="/inquiry">Balance App</a>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "../store";
import router from "../router";
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "Login",
  setup() {
    const authStore = useAuthStore();
    const login = async (username, password) => {
      await authStore.login({ username, password });
    };
    const showValidationMessage = computed({
      get: () => authStore.showValidationMessage,
      set: (newValue) => (authStore.showValidationMessage = newValue),
    });

    if (authStore.isAuthenticated) {
      router.push("/pay");
    }

    return {
      login,
      showValidationMessage,
    };
  },
});
</script>

<style scoped>
.login-container {
  max-width: 400px;
  min-width: 330px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.form {
  width: 100%;
  max-width: 300px;
}

.form-group {
  margin-bottom: 10px;
}

label {
  font-weight: bold;
}

input[type="text"],
input[type="password"] {
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

button:hover {
  background-color: #45a049;
}

button:active {
  background-color: #3c903b;
}
.validation {
  color: red;
}
</style>
