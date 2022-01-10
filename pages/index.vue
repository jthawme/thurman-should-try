<template>
  <div class="main">
    <transition name="fade" mode="out-in">
      <span v-if="idea" :key="idea.id">{{ idea.text }}</span>
    </transition>
  </div>
</template>

<script>
import { Representations } from "~/api/common/constants";
import { listenCb, throttle } from "~/assets/js/utils";
export default {
  data() {
    return {
      idea: null,
    };
  },
  mounted() {
    this.getRandom();

    if (process.client) {
      listenCb(
        document,
        "mousemove",
        throttle(this.onMouseMove.bind(this), 50)
      );

      listenCb(document, "click", this.onClick.bind(this));
    }
  },
  methods: {
    async getRandom() {
      const data = await fetch(
        `https://jjdj7b4ffb.execute-api.us-east-1.amazonaws.com/dev/random`
      ).then((resp) => resp.json());

      this.idea = this.prepare(data.idea);
    },
    prepare(idea) {
      return {
        id: idea.id,
        text: `${idea.text} ${Representations[idea.type]}`,
      };
    },
    onMouseMove(e) {
      const el = document.createElement("div");
      el.classList.add("hint");
      el.style.left = `${e.pageX}px`;
      el.style.top = `${e.pageY}px`;
      el.innerText = "Click";

      this.$el.appendChild(el);

      setTimeout(() => {
        el.remove();
      }, 500);
    },
    onClick() {
      this.getRandom();
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  padding: var(--page-padding);

  font-size: 10vw;
}
</style>

<style lang="scss">
.hint {
  position: absolute;

  display: block;

  transform: translate3d(-50%, -50%, 0);
  font-size: 24px;

  pointer-events: none;

  color: color;
  mix-blend-mode: difference;
}
</style>
