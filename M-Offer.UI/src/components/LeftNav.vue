<template>
  <nav class="leftnav">
    <div class="leftnav-container">
      <ul class="leftnav-ul">
        <li class="leftnav-item">
          <router-link class="nav-link" to="/admin">Pay</router-link>
        </li>
        <li class="leftnav-item">
          <router-link class="nav-link" to="/users">Deposit</router-link>
        </li>
        <li class="leftnav-item">
          <router-link class="nav-link" to="/admin"
            >Member Management</router-link
          >
        </li>
        <li class="leftnav-item">
          <router-link class="nav-link" to="/admin"
            >User Management</router-link
          >
        </li>
        <li class="leftnav-item">
          <router-link class="nav-link" to="/admin"
            >Barcode Inquiry</router-link
          >
        </li>
        <li class="leftnav-item">
          <router-link class="nav-link" to="/admin"
            >Balance Inquiry</router-link
          >
        </li>
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

export default {
  name: "leftnav",
  setup() {
    const authStore = useAuthStore();
    const logout = authStore.logout;
    return {
      logout,
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

@media (max-width: 991px) {
  .leftnav {
    flex-direction: row;
  }

  .leftnav-container {
    display: flex;
    align-items: center;
  }

  .leftnav-item {
    margin-bottom: 0;
    margin-right: 10px;
  }
}
</style>
