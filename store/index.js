import { Breakpoint } from "~/assets/js/mixins/breakpoints";

export const state = () => {
  return {
    breakpoint: {
      [Breakpoint.Desktop]: true,
      [Breakpoint.LargeMobile]: true,
      [Breakpoint.Tablet]: true,
      [Breakpoint.Mobile]: true,
    },
  };
};

export const mutations = {
  setBreakpoint(state, val) {
    state.breakpoint[val.key] = val.value;
  },
};
