<script>
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NGrid, NGridItem } from "naive-ui";

export default {
  name: "HomeView",
  mounted() {
    this.setupScrollSnapping();
  },
  methods: {
    setupScrollSnapping() {
      gsap.registerPlugin(ScrollTrigger);
      gsap.to(this.$refs.hero, {
        scrollTrigger: {
          trigger: this.$refs.page,
          start: "top top",
          scrub: true,
        },
        duration: 2,
        y: 400,
        rotate: 5,
      });
    },
  },
  components: {
    NGrid,
    NGridItem,
  },
};
</script>

<template>
  <div ref="page" class="page">
    <div class="block">
      <div class="grid">
        <h1>snapjay</h1>
        <NGrid cols="1 900:2" x-gap="12">
          <NGridItem>
            <div class="mt-70">
              <h2>
                An Experienced <br />
                Frontend Web Developer
              </h2>
              <p>
                With over 20 years dedicated to website development, I
                specialize in front-end VueJS and ReactJS expertise. I
                prioritize meticulous attention to detail, employing prototyping
                and user testing to ensure integrity in code development.
              </p>
              <p>
                I am adept at balancing user experience with business
                objectives, adeptly crafting JavaScript interfaces that
                harmonize both aspects. My portfolio includes collaborations
                with award-winning agencies, contributing to projects for
                prominent brands like Intel, TD Canada Trust, eBay UK, BBC
                Worldwide, and Telus Mobility.
              </p>
            </div></NGridItem
          >
          <NGridItem>
            <div class="glitch hero mt-70" ref="hero">
              <img
                src="/assets/img/home/hunter.webp"
                alt="Photo of Dan"
                draggable="false"
                width="500"
                height="490"
              />
              <div class="glitch__layers">
                <div class="glitch__layer"></div>
                <div class="glitch__layer"></div>
                <div class="glitch__layer"></div>
              </div></div
          ></NGridItem>
        </NGrid>
      </div>
    </div>
    <img
      src="/assets/img/home/border.svg"
      class="border"
      draggable="false"
      alt=""
      role="presentation"
      aria-hidden="true"
    />
  </div>
</template>
<style scoped>
h1 {
  text-align: end;
  transform: rotate(180deg);
  writing-mode: vertical-lr;
  text-orientation: sideways;
  font-size: 9rem;
  opacity: 0.15;
}
h2 {
  font-family: LemonMilkBold;
  font-size: 2rem;
}
.border {
  width: 100%;
  position: absolute;
  bottom: 0;
  z-index: 10;
  /* filter: drop-shadow(2px 2px 3px rgb(10 10 10 / 0.7)); */
}
.page {
  background-color: rgb(209, 173, 125);
  background-image: url(/assets/img/home/paper.webp);

  padding-bottom: 90px;
}
.grid {
  display: grid;
  grid-template-columns: 80px 1fr;
  grid-gap: 20px;
}
.hero {
  height: 495px;
}
.glitch {
  position: relative;
  overflow: hidden;
}
.glitch img {
  position: relative;
  z-index: 1;
  display: block;
}
.glitch__layers {
  position: absolute;
  z-index: 2;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.glitch__layer {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-image: url(/assets/img/home/hunter.webp);
  background-repeat: no-repeat;
  background-position: 0 0;
}
.glitch__layer:nth-child(3) {
  transform: translateX(-3%);
  animation: glitch-anim-flash 3.1s infinite linear;
}
.glitch__layer:nth-child(2) {
  transform: translateX(-4%);
  animation: glitch-anim-flash-2 7.2s infinite linear;
}
.glitch__layer:nth-child(1) {
  transform: translateX(5%);
  animation: glitch-anim-flash 4.9s infinite linear;
}

@keyframes glitch-anim-flash {
  0% {
    opacity: 0.2;
  }
  30%,
  100% {
    opacity: 0;
  }
}
@keyframes glitch-anim-flash-2 {
  0% {
    opacity: 0.5;
  }
  10%,
  100% {
    opacity: 0;
  }
}
</style>
