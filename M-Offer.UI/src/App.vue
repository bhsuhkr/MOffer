<template>
  <div class="app-container">
    <LeftNav></LeftNav>
    <router-view />
  </div>
</template>

<script>
import LeftNav from "./components/LeftNav.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
  components: {
    LeftNav,
  },
});
</script>

<style scoped>
.app-container {
  display: flex;
  margin: -8px;
}
</style>
