<script>
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
};
</script>

<template>
  <div ref="page" class="page">
    <div class="block">
      <div class="grid">
        <h1>snapjay</h1>
        <div>
          <h2>
            An Experienced <br />
            Frontend Web Developer
          </h2>
          <p>
            With over 15 years dedicated to website development, I specialize in
            front-end VueJS expertise. I prioritize meticulous attention to
            detail, employing prototyping and user testing to ensure integrity
            in code development.
          </p>
          <p>
            I am adept at balancing user experience with business objectives,
            adeptly crafting JavaScript interfaces that harmonize both aspects.
            My portfolio includes collaborations with award-winning agencies,
            contributing to projects for prominent brands like Intel, TD Canada
            Trust, eBay UK, BBC Worldwide, and Telus Mobility.
          </p>
        </div>
        <div>
          <div class="glitch hero" ref="hero">
            <img
              src="/assets/img/hunter.jpg"
              alt="Photo of Hunter"
              draggable="false"
            />
            <div class="glitch__layers">
              <div class="glitch__layer"></div>
              <div class="glitch__layer"></div>
              <div class="glitch__layer"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
.page {
  background-color: rgb(209, 173, 125);
  background-image: url(../assets/img/paper.jpg);
  margin-top: -40px;
}
.grid {
  display: grid;
  grid-template-columns: 80px 1fr 495px;
  grid-gap: 20px;
}
.hero {
  height: 495px;
}
/* https://freefrontend.com/css-glitch-effects/ */
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
  background-image: url(/assets/img/hunter.jpg);
  background-repeat: no-repeat;
  background-position: 0 0;
}
.glitch__layer:nth-child(1) {
  transform: translateX(-5%);
  animation: glitch-anim-1 4s infinite linear alternate;
}
.glitch__layer:nth-child(2) {
  transform: translateX(3%) translateY(3%);
  animation: glitch-anim-2 4.3s -0.8s infinite linear alternate;
}
.glitch__layer:nth-child(3) {
  transform: translateX(5%);
  animation: glitch-anim-flash 5s infinite linear;
}
@keyframes glitch-anim-1 {
  0% {
    clip-path: polygon(0 0%, 100% 0%, 100% 5%, 0 5%);
  }
  10% {
    clip-path: polygon(0 15%, 100% 15%, 100% 15%, 0 15%);
  }
  20% {
    clip-path: polygon(0 10%, 100% 10%, 100% 20%, 0 20%);
  }
  30% {
    clip-path: polygon(0 1%, 100% 1%, 100% 2%, 0 2%);
  }
  40% {
    clip-path: polygon(0 35%, 100% 35%, 100% 35%, 0 35%);
  }
  50% {
    clip-path: polygon(0 45%, 100% 45%, 100% 46%, 0 46%);
  }
  60% {
    clip-path: polygon(0 50%, 100% 50%, 100% 70%, 0 70%);
  }
  70% {
    clip-path: polygon(0 70%, 100% 70%, 100% 70%, 0 70%);
  }
  80% {
    clip-path: polygon(0 80%, 100% 80%, 100% 80%, 0 80%);
  }
  90% {
    clip-path: polygon(0 50%, 100% 50%, 100% 55%, 0 55%);
  }
  100% {
    clip-path: polygon(0 60%, 100% 60%, 100% 70%, 0 70%);
  }
}
@keyframes glitch-anim-2 {
  0% {
    clip-path: polygon(0 15%, 100% 15%, 100% 30%, 0 30%);
  }
  15% {
    clip-path: polygon(0 3%, 100% 3%, 100% 3%, 0 3%);
  }
  25% {
    clip-path: polygon(0 8%, 100% 8%, 100% 20%, 0 20%);
  }
  30% {
    clip-path: polygon(0 20%, 100% 20%, 100% 20%, 0 20%);
  }
  45% {
    clip-path: polygon(0 45%, 100% 45%, 100% 45%, 0 45%);
  }
  50% {
    clip-path: polygon(0 50%, 100% 50%, 100% 57%, 0 57%);
  }
  65% {
    clip-path: polygon(0 60%, 100% 60%, 100% 60%, 0 60%);
  }
  75% {
    clip-path: polygon(0 80%, 100% 80%, 100% 80%, 0 80%);
  }
  80% {
    clip-path: polygon(0 40%, 100% 40%, 100% 60%, 0 60%);
  }
  95% {
    clip-path: polygon(0 45%, 100% 45%, 100% 60%, 0 60%);
  }
  100% {
    clip-path: polygon(0 11%, 100% 11%, 100% 15%, 0 15%);
  }
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
</style>
