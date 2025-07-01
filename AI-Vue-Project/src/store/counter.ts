import { defineStore } from "pinia";
interface State {
  count: number;
}
export const useCounterStore = defineStore("counter", {
  state:():State=>({
    count:0
  }),
  getters:{
    doubleCount(state): number {
      return state.count * 2;
    }
  },
  actions: {
    increment(): void {
      this.count++;
    }
  }
})