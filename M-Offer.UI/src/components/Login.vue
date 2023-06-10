<!-- MyComponent.vue -->
<template>
  <form name="login-form">
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
      type="submit"
      @click="login(this.username, this.password)"
    >
      Login
    </button>
  </form>
</template>

<script>
// import { useStore } from 'pinia';
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

    const login = (username, password) => {
      authStore.login({ username, password });
    };
    return {
      login,
    };
  },
};
</script>
