<template>
  <nav class="leftnav leftnav-expand-lg leftnav-light bg-light">
    <div class="leftnav-container">
      <a class="leftnav-brand" href="/">M Offer</a>
      <ul class="leftnav-ul">
        <li class="leftnav-item">
          <router-link class="nav-link" to="/Admin">Pay</router-link>
        </li>
        <li class="leftnav-item">
          <router-link class="nav-link" to="/Users">Deposit</router-link>
        </li>
        <li class="leftnav-item">
          <router-link class="nav-link" to="/Admin"
            >Member Management</router-link
          >
        </li>
        <li class="leftnav-item">
          <router-link class="nav-link" to="/Admin"
            >User Management</router-link
          >
        </li>
        <li class="leftnav-item">
          <router-link class="nav-link" to="/Admin"
            >Barcode Inquiry</router-link
          >
        </li>
        <li class="leftnav-item">
          <router-link class="nav-link" to="/Admin"
            >Balance Inquiry</router-link
          >
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: "leftnav",
};
</script>

<style scoped>
.leftnav {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

.leftnav-brand {
  margin: 10px 0;
}

.leftnav-ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.leftnav-item {
  margin-bottom: 10px;
}

.nav-link {
  text-decoration: none;
  color: #000;
}

/* Additional styles for responsiveness (optional) */
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