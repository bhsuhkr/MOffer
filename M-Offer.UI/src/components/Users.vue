<template>
  <div class="user-container">
    <h3 class="title">User Information</h3>
    <div class="search-bar">
      <input type="text" v-model="searchQuery" placeholder="Search ID" />
      <button @click="search">Search</button>
    </div>
    
    <div class="user-info">
      <p><strong>Name:</strong> 뉴송교인</p>
      <p><strong>ID:</strong> NewSong1234</p>
      <p><strong>Balance:</strong> $100</p>
    </div>
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
  font-size: 24px;
}
.search-bar {
  margin-bottom: 30px;
}

.search-bar input[type="text"] {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  flex-grow: 1;
}
.search-bar button {
  margin-left: 10px;
  padding: 8px 12px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}
.user-info {
  background-color: #f2f2f2;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}
.user-info p {
  margin-bottom: 10px;
  font-size: 16px;
}
.user-info strong {
  font-weight: bold;
}
</style>