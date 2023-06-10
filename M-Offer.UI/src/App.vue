<template>
  <Login v-if="true"></Login>
  <NavBar></NavBar>
  <router-view />
</template>

<script>
import NavBar from "./components/NavBar.vue";
import Login from "./components/Login.vue";

import { defineComponent } from "vue";
import { useAuthStore } from "./store";

export default defineComponent({
  name: "App",
  components: {
    NavBar,
    Login,
  },
  setup() {
    const authStore = useAuthStore();
    authStore.getToken();
    return {
      authStore,
    };
  },
});
</script>

<style scoped></style>
