
<script>
import { defineComponent } from "vue";
import LogoLink from "../components/LogoLink.vue";

export default defineComponent({
  data: () => ({
    connect: [
      {
        id: "1",
        img: "/connect/email.svg",
        title: "Email",
        href: "mailto:dan@snapjay.com",
      },
      {
        id: "2",
        img: "/connect/linkedin.svg",
        title: "LinkedIn",
        href: "https://www.linkedin.com/profile/view?id=18683312",
      },
      {
        id: "3",
        img: "/connect/github.svg",
        title: "Github",
        href: "http://github.com/snapjay",
      },
      {
        id: "4",
        img: "/connect/x.svg",
        title: "X",
        href: "https://x.com/snapjay",
      },
    ],
  }),
  components: {
    LogoLink,
  },
});
</script>

<template>
  <div class="page">
    <div class="block">
      <h1>Hey I'm Dan; <br />and we should be friends!</h1>
      <p>
        I am currently located in Erie, Colorado. I appreciate your interest in
        visiting my website.
      </p>
      <p>
        If you're interested in reviewing my code, please feel free to explore
        my <a href="https://github.com/snapjay">GitHub</a> repository.
      </p>
      <p>
        Should you wish to discuss potential employment opportunities or learn
        more about my work, please do not hesitate to reach out via the contact
        information provided. Thank you!
      </p>
      <ul class="mt-70">
        <LogoLink :data="connect" :width="25" />
      </ul>
    </div>
  </div>
</template>

<style scoped>

.page {
  color: #fff;
  background: linear-gradient(90deg, #f56302, #f7c602);
  padding-top: 0;
}

li {
  align-content: center;
  display: inline-block;
  width: 25%;
}
a {
  display: inline-block;
  color: #fff;
}
img {
  align-self: center;
  width: 200px;
  transition: transform 0.7s ease-in-out;
}
img:hover {
  transform: scale(1.1);
}
</style>
