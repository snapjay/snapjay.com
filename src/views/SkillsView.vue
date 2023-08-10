<script>
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LogoLink from "../components/LogoLink.vue";

export default {
  name: "SkillsView",
  data: () => ({
    skills: [
      {
        id: "1",
        img: "skills/Vue.js_Logo_2.svg",
        title: "Vue.JS",
        href: "https://vuejs.org/",
      },
      {
        id: "2",
        img: "skills/reactjs-icon.svg",
        title: "React.JS",
        href: "https://react.dev/",
      },
      {
        id: "3",
        img: "skills/mongodb-icon.svg",
        title: "Mongo.JS",
        href: "https://www.mongodb.com/",
      },
      {
        id: "4",
        img: "skills/Node.js_logo.svg",
        title: "Node.JS",
        href: "https://nodejs.org/",
      },
    ],
  }),
  mounted() {
    this.setupScrollSnapping();
  },
  components: {
    LogoLink,
  },
  methods: {
    setupScrollSnapping() {
      gsap.registerPlugin(ScrollTrigger);
      gsap.to(this.$refs.sun, {
        scrollTrigger: {
          trigger: this.$refs.page,
          // start: "top top",
          scrub: true,
        },
        y: 700,
        x: 150,
        width: 180,
        height: 180,
        backgroundColor: "#dd932b",
        ease: "none",
      });
      gsap.from(this.$refs.hills, {
        scrollTrigger: {
          trigger: this.$refs.page,
          // start: "top top",
          scrub: true,
        },
        filter: "brightness(3)",
        ease: "none",
      });
      gsap.to(this.$refs.page, {
        scrollTrigger: {
          trigger: this.$refs.page,
          start: "top top",
          scrub: true,
        },

        backgroundImage:
          "linear-gradient(to bottom, #133e66 0%, #b5702b 73%, #9e1827 100%)",
        ease: "none",
      });
    },
  },
};
</script>
<template>
  <div ref="page" class="page">
    <div class="block">
      <h1>Skills</h1>
      <div class="grid">
        <p>
          My career has primarily focused on font-end development JavaScript,
          HTML and CSS. Currently Director of Product strategy I have also
          worked as a product owner, so understand the importance of the
          interface for the end user.
        </p>
        <p>
          I use rapid prototyping and usability testing to prove out a product
          before build. I like code to be efficient and elegant. This means that
          I can develop complex functionality while maintaining a quality user
          experience.
          <!-- https://www.google.com/search?rlz=1C1CHBF_enUS1020US1020&sxsrf=AB5stBimqtJ3cCQkiPe9ucN9oIy0KVtKyg:1691603642460&q=svg+hills&tbm=isch&source=lnms&sa=X&ved=2ahUKEwiWptbRktCAAxVSDjQIHQhVCygQ0pQJegQIDBAB&biw=1920&bih=931&dpr=1#imgrc=Onj2iWUXfTLV1M&imgdii=mXTXlVwJdhhl8M -->
        </p>
      </div>

      <ul class="mt-70">
        <LogoLink :data="skills" :width="25" />
      </ul>
    </div>
    <div>
      <div ref="sun" class="sun"></div>
      <div ref="hills" class="hills"></div>
    </div>
  </div>
</template>
<style scoped>
.page {
  background-image: linear-gradient(
    to bottom,
    #425e78 0%,
    #ded5cc 73%,
    #e4ca98 100%
  );
  /* background-image: linear-gradient(to bottom, #133e66 0%, #b5702b 73%, #9e1827 100%); */
}
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
}
.hills {
  position: absolute;
  width: 100%;
  height: 165px;
  background-image: url(/assets/img/skills/hills.svg);
  bottom: 0px;
}

.sun {
  position: absolute;
  width: 135px;
  height: 135px;
  bottom: 400px;
  z-index: -1;
  left: 50%;
  background-color: #ffb852;
  border-radius: 50%;
  -webkit-box-shadow: 0px 0px 11px 1px rgba(255, 184, 82, 0.77);
  -moz-box-shadow: 0px 0px 11px 1px rgba(255, 184, 82, 0.77);
  box-shadow: 0px 0px 11px 1px rgba(255, 184, 82, 0.77);
}
</style>