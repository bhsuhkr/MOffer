<template>
  <div class="cafe-container">
    <div class="cafe-header">
      <h3>Cafe</h3>
      
    </div>
    
  </div>
</template>

<script>
import "bootstrap/dist/css/bootstrap.min.css";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Cafe",
  setup() {
    let items = [];

    return {
      items
    }
    
  },
});
</script>

<style scoped>
.cafe-container {
  margin: 20px 40px;
  width: 100%;
}
</style>
