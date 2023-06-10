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
      v-on:click.prevent="login()"
    >
      Login
    </button>
  </form>
  <h4>{{ this.username }}</h4>
</template>

<script>
// import { useStore } from 'pinia';

export default {
  name: "Login",
  data() {
    return {
      loading: false,
      username: "",
      password: "",
    };
  },
  methods: {
    login() {
      console.log("login clicked");

      this.loading = true;

      this.$store.dispatch("auth/login", user).then(
        () => {
          this.$router.push("/users");
        },
        (error) => {
          this.loading = false;
          console.error("Login failed");
        }
      );
      //make sure username OR password are not empty
      // if (this.input.username != "" || this.input.username != "") {
      //   this.output = "Authentication complete"
      //   //stores true to the set_authentication and username to the set_username
      //   this.$store.commit(`auth/${SET_AUTHENTICATION}`, true);
      //   this.$store.commit(`auth/${SET_USERNAME}`, this.input.username);
      //   this.output = "Authentication complete."
      //   this.$router.push('/home')
      // } else {
      //   this.$store.commit(`auth/${SET_AUTHENTICATION}`, false);
      //   this.output = "Username and password can not be empty"
      // }
    },
  },
};
</script>
