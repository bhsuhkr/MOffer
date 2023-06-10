<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="navbar-container">
      <a class="navbar-brand" href="/">M Offer</a>
      <ul class="navbar-ul">
        <li class="navbar-item">
          <router-link class="nav-link" to="/">Pay</router-link>
        </li>
        <li class="navbar-item">
          <router-link class="nav-link" to="/Users">Deposit</router-link>
        </li>
        <li class="navbar-item">
          <router-link class="nav-link" to="/Admin"
            >Member Management</router-link
          >
        </li>
        <li class="navbar-item">
          <router-link class="nav-link" to="/Admin"
            >User Management</router-link
          >
        </li>
        <li class="navbar-item">
          <router-link class="nav-link" to="/Admin"
            >Barcode Inquiry</router-link
          >
        </li>
        <li class="navbar-item">
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
  name: "Navbar",
};
</script>

<style scoped>
.navbar-container {
  margin-left: 40px;
  margin-right: 40px;
  display: flex;
}
.navbar-ul {
  display: flex;
  list-style: none;
  margin-bottom: 0px;
  color: #000000ab;
}
.navbar-item {
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 8px;
}
.navbar-item:hover {
  color: #000000dc;
}
</style>
