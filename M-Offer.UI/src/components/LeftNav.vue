<template>
  <nav class="leftnav" v-if="isAuth">
    <div class="leftnav-container">
      <ul class="leftnav-ul">
        <li class="leftnav-item">
          <router-link class="nav-link" to="/pay">Pay</router-link>
        </li>
        <li class="leftnav-item">
          <router-link class="nav-link" to="/deposit">Deposit</router-link>
        </li>
        <!-- <li class="leftnav-item">
          <router-link class="nav-link" to="/member-management"
            >Member Management</router-link
          >
        </li>
        <li class="leftnav-item">
          <router-link class="nav-link" to="/user-management"
            >User Management</router-link
          >
        </li> -->
        <li class="leftnav-item">
          <router-link class="nav-link" to="/" @click="logout"
            >Log out</router-link
          >
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { useAuthStore } from "@/store";
import { ref, watch } from "vue";

export default {
  name: "leftnav",
  setup() {
    const authStore = useAuthStore();
    let isAuth = ref(false);

    // this kicks in when the value changes
    watch(
      () => authStore.isAuthenticated,
      (newValue) => {
        isAuth.value = newValue;
      }
    );

    // this kicks in on the first time load or browser refresh 
    // we will check the previous login from local storage
    if (authStore.isAuthenticated)
      isAuth.value = authStore.isAuthenticated;

    return {
      isAuth,
      logout: authStore.logout,
    };
  },
};
</script>

<style scoped>
body {
  margin: 0;
}
.leftnav {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

.leftnav-container {
  background-color: #f9f9f9;
  height: 100vh;
}

.leftnav-ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.leftnav-item {
  margin: 30px;
  font-size: 20px;
  font-weight: 500;
}

.nav-link {
  text-decoration: none;
  color: #000;
}
</style>
