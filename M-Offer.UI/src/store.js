import { defineStore } from 'pinia';
import axios from "axios";
import router from './router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
  }),
  actions: {
    setUser(user) {
      this.user = user;
    },
    setToken(token) {
      this.token = token;
    },
    async login(cred) {
      const userData = {
        username: cred.username,
        password: cred.password
      };
      
      await axios.post('http://localhost:3000/api/auth/signin', userData)
        .then(response => {
          console.log("login successfully", response);
          // Handle the response from the backend
          this.setUser(cred.username);
          this.setToken("test");
          router.push('/admin');

        })
        .catch(error => {
          console.error("Axios Login failed", error);
          // Handle any errors
        });
    },
    // logout() {
    //   localStorage.removeItem('user');
    // },
    // register(user) {
    //   return axios.post('http://localhost:3000/api/auth/signup', {
    //     username: user.username,
    //     email: user.email,
    //     password: user.password
    //   });
    // }
  },
});