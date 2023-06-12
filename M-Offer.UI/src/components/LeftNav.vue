<template>
  <nav class="leftnav" v-if="token !== null">
    <div class="leftnav-container">
      <ul class="leftnav-ul">
        <li class="leftnav-item">
          <router-link class="nav-link" to="/pay">Pay</router-link>
        </li>
        <li class="leftnav-item">
          <router-link class="nav-link" to="/deposit">Deposit</router-link>
        </li>
        <li class="leftnav-item">
          <router-link class="nav-link" to="/member-management"
            >Member Management</router-link
          >
        </li>
        <li class="leftnav-item">
          <router-link class="nav-link" to="/user-management"
            >User Management</router-link
          >
        </li>
        <li class="leftnav-item">
          <router-link class="nav-link" to="/barcode-inquiry"
            >Barcode Inquiry</router-link
          >
        </li>
        <li class="leftnav-item">
          <router-link class="nav-link" to="/balance-inquiry"
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
import { ref, onMounted, watch } from "vue";

export default {
  name: "leftnav",
  setup() {
    const authStore = useAuthStore();
    const token = ref(null);

    const logout = authStore.logout;
    const localToken = localStorage.getItem("userToken");

    if (localToken) {
      authStore.setToken(localToken);
    }

    onMounted(() => {
      token.value = authStore.token;
    });

    watch(
      () => authStore.token,
      (newToken) => {
        token.value = newToken;
        console.log("watch", authStore.token);
      }
    );

    return {
      logout,
      token,
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
