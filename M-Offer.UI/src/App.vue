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

/**
 * we initially add a browser session history record with current URL
 * when browser back or forward button is clicked, it will force a forward/go.(1) which was just added
 */
history.pushState(null, null, location.href);
window.onpopstate = function () {
  history.go(1);
};
</script>

<style scoped>
.app-container {
  display: flex;
  margin: -8px;
}
</style>
