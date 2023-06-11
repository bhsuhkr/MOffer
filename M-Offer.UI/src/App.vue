<template>
  <NavBar v-if="token"></NavBar>
  <router-view />
  <h3>{{ token }}</h3>
</template>

<script>
import NavBar from "./components/NavBar.vue";
import { defineComponent } from "vue";
import { ref, watch } from "vue";
import { useAuthStore } from "@/store";

export default defineComponent({
  name: "App",
  components: {
    NavBar,
  },
  setup() {
    const authStore = useAuthStore();
    const token = ref(authStore.token);

    watch(
      () => authStore.token,
      (newToken) => {
        token.value = newToken;
      }
    );

    return {
      token,
    };
  },
});
</script>

<style scoped></style>
