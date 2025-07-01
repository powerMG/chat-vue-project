import { defineStore } from "pinia";
interface State {
  token: string | null;
  isLoggedIn: boolean;
}
export const useAuthStore = defineStore("auth", {
  state: (): State => ({
    token: sessionStorage.getItem("token"),
    isLoggedIn: !!sessionStorage.getItem("token"),
  }),
  actions: {
    login(token: string) {
      this.token = token;
      this.isLoggedIn = true;
      sessionStorage.setItem("token", token);
    },
    logout() {
      this.token = null;
      this.isLoggedIn = false;
      sessionStorage.removeItem("token");
    }
  },
});
