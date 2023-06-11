<template>
  <LeftNav v-if="token"></LeftNav>
  <router-view />
  <h3>{{ token }}</h3>
</template>

<script>
import LeftNav from "./components/LeftNav.vue";
import { defineComponent } from "vue";
import { ref, watch } from "vue";
import { useAuthStore } from "@/store";

export default defineComponent({
  name: "App",
  components: {
    LeftNav,
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
