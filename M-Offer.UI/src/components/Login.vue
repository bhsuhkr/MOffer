<template>
  <div name="login-form">
    <div class="mb-3">
      <label for="username">Username: </label>
      <input type="text" id="username" v-model="username" />
    </div>
    <div class="mb-3">
      <label for="password">Password: </label>
      <input type="password" id="password" v-model="password" />
    </div>
    <button
      class="btn btn-outline-dark"
      @click="login(this.username, this.password)"
    >
      Login
    </button>
  </div>
</template>

<script>
import { useAuthStore } from "../store";

export default {
  name: "Login",
  data() {
    return {
      loading: false,
      username: "",
      password: "",
    };
  },
  setup() {
    const authStore = useAuthStore();

    const login = async (username, password) => {
      await authStore.login({ username, password });
    };
    return {
      login,
    };
  },
};
</script>
