<template>
  <Login></Login>
  <!-- <NavBar></NavBar>
  <router-view /> -->
</template>

<script>
// import NavBar from "./components/NavBar.vue";
import Login from "./components/Login.vue";

import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
  components: {
    // NavBar,
    Login,
  },
});
</script>

<style scoped></style>
