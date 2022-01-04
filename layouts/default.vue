<template>
  <div>
    <nuxt />
  </div>
</template>


<script>
import smoothscroll from "smoothscroll-polyfill";
import { registerBootlegVH } from "../assets/js/utils";
import { BreakPointSet } from "../assets/js/mixins/breakpoints";

export default {
  components: {},
  mixins: [BreakPointSet],
  mounted() {
    smoothscroll.polyfill();

    registerBootlegVH();
  },
};
</script>

<style lang="scss">
@import "../assets/scss/parts/fonts";

:root {
  --color-white: #fff;
  --color-black: #000;

  --color-text: var(--color-white);
  --color-bg: var(--color-black);

  --font-size-x-small: 10px;
  --font-size-small: 14px;
  --font-size-normal: 16px;
  --font-size-medium: 21px;
  --font-size-large: 24px;
  --font-size-x-large: 36px;
  --font-size-xx-large: 46px;
  --font-size-xxx-large: 56px;

  --font-family-body: sans-serif;
  --font-family-headline: sans-serif;

  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  --font-weight-extra-bold: 900;

  --icon-small: 1em;

  --page-padding-x: 20px;
  --page-padding-y: 16px;
  --page-padding: var(--page-padding-y) var(--page-padding-x);

  @for $i from 1 through 20 {
    --size-unit-#{$i}: #{$i * 5px};
  }

  @include tablet {
    --page-padding-x: 70px;
    --page-padding-y: 32px;
    --page-padding: var(--page-padding-y) var(--page-padding-x);
  }
}

*,
*:before,
*:after {
  box-sizing: border-box;
}

html {
  font-family: var(--font-family-body);
  font-size: var(--font-size-normal);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);

  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;

  background-color: var(--color-bg);

  line-height: 1.25;
}

input,
button {
  font-family: inherit;
  font-weight: inherit;
}

html,
body {
  width: 100%;
  min-height: 100%;
}

.visually-hidden {
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}

.fade {
  opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.fade-fast {
  opacity: 1;
}

.fade-fast-enter-active,
.fade-fast-leave-active {
  transition: opacity 0.5s;
}
.fade-fast-enter, .fade-fast-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

img {
  max-width: 100%;
}
</style>
