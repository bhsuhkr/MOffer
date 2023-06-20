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
          this.setUser(cred.username);
          // TODO: generate a user token
          this.setToken("test");
          localStorage.setItem("userToken", this.token);
          router.push('/pay');
        })
        .catch(error => {
          console.error("Axios Login failed", error);
        });
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('userToken');
    },
  },
});

export const useMemberStore = defineStore('auth', {
  actions: {
    async pay(userInfo) {
      const userData = {
        memberId: userInfo.memberId,
        memberEngName: userInfo.memberEngName,
        memberKorName: userInfo.memberKorName,
        memberTel: userInfo.memberTel,
        memberEmail: userInfo.memberEmail,
      };
      await axios.post('http://localhost:3000/api/member/pay', userData)
        .then(response => {
          console.log("Paid successfully", response);
        })
        .catch(error => {
          console.error("Axios Pay failed", error);
        });
    },
  },
});