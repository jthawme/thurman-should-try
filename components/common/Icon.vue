<template>
  <span class="icon">
    <component :is="iconComponent" />
  </span>
</template>

<script>
import play from "~/assets/img/icons/play.svg?inline";

const icons = {
  play,
};

export const iconKeys = Object.keys(icons);

export default {
  props: {
    name: {
      // type: String as PropType<keyof typeof icons>,
      type: String,
      required: true,
    },
  },
  computed: {
    iconComponent() {
      return icons[this.name];
    },
  },
};
</script>

<style lang="scss" scoped>
.icon {
  display: inline-block;

  width: var(--icon-size, 1em);
  height: var(--icon-size, 1em);

  color: var(--icon-color, inherit);

  line-height: 0;

  svg {
    width: 100%;
    height: 100%;
  }
}
</style>
