import { defineStore } from 'pinia';

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    authUser: null
  }),
  getters: {
    user: (state) => state.authUser
  },
  actions: {
    login() {
      console.log("login called");
      axios.post('http://localhost:3000/api/login', {
        username: user.username,
        password: user.password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem('userToken', JSON.stringify(response.data));
          console.log("user token saved in local storage", JSON.stringify(response.data));
        }
      });
    },
    logout() {
      localStorage.removeItem('user');
    },
    register(user) {
      return axios.post('http://localhost:3000/api/signup', {
        username: user.username,
        email: user.email,
        password: user.password
      });
    }
  },
});