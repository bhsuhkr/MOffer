<template>
  <div class="user-container">
    <h3 class="title">User Information</h3>
    <div class="search-bar">
      <input type="text" v-model="searchQuery" placeholder="ID Search" />
      <button @click="search">Search</button>
    </div>

    <p>Name: 뉴송교인</p>
    <p>ID: NewSong1234</p>
    <p>Balance: $100</p>
  </div>
</template>
<script>
export default {
  name: "Users",
  data() {
    return {
      searchQuery: "",
    };
  },
  methods: {
    search() {
      // Perform search operation with the searchQuery value
      console.log("Search query:", this.searchQuery);
      if (this.searchQuery === "12345") {
        console.log("match!");
      }
    },
  },
};
</script>

<style scoped>
.user-container {
  padding: 40px;
}
.title {
  margin-bottom: 30px;
}
.search-bar {
  margin-bottom: 30px;
}
</style>
