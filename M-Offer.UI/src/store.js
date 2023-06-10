import { defineStore } from 'pinia';
import axios from "axios";

export const useAuthStore = defineStore('auth', {
  state: () => ({
    authUser: null
  }),
  getters: {
    user: (state) => state.authUser
  },
  actions: {
    async login(cred) {
      console.log("login called", cred);
      const userData = {
        username: cred.username,
        password: cred.password
      };
      
      await axios.post('http://localhost:3000/api/auth/signin', userData)
        .then(response => {
          console.log("login successfully", response);
          // Handle the response from the backend
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