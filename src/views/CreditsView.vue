<script>
import { defineComponent } from "vue";
import LogoLink from "../components/LogoLink.vue";

export default defineComponent({
  data: () => ({
    clients: [
      {
        id: "1",
        img: "credits/Telus-Logo.svg",
        title: "Telus",
        desc: "Developed the user interface for Telus' internal employee loyalty and rewards program's frontend components.",
        href: "https://www.telus.com/",
      },
      {
        id: "2",
        img: "credits/EBay_logo.svg",
        title: "ebay",
        desc: 'Created a prototype for a "Community Court" concept aimed at effectively resolving conflicts between customers.',
        href: "https://www.ebay.co.uk/",
      },
      {
        id: "3",
        img: "credits/LogRhythmLogo.svg",
        title: "LogRhythm",
        desc: "Senior frontend developer role working in the advancement of the company's flagship security product by contributing to its development and infrastructure enhancement efforts.",
        href: "https://logrhythm.com/",
      },
      {
        id: "4",
        img: "credits/Lonely_Planet-Logo.svg",
        title: "Lonely Planet",
        desc: "Developed a prototype for the travel guide website, incorporating essential features and functionalities.",
        href: "https://www.lonelyplanet.com/places",
      },
      {
        id: "5",
        img: "credits/Top_Gear_29.webp",
        title: "Top Gear",
        desc: "Built concept protoype for a car selling application, intended for the purpose of conducting user testing.",
        href: "https://www.topgear.com/",
      },
      {
        id: "6",
        img: "credits/Toronto-Dominion_Bank.svg",
        title: "TD Bank",
        desc: "Participated in the development of the company's customer loyalty program, enabling customers to efficiently redeem accumulated points for various products.",
        href: "https://www.td.com/ca/en/personal-banking/",
      },
      {
        id: "7",
        img: "credits/engage_red_logo.png",
        title: "Engage People",
        desc: "Served in the capacity of Director of Product Development at Engage, spearheading innovation, internal product development, and client-focused initiatives.",
        href: "https://www.engagepeople.com/",
      },
    ],
    books: [
      {
        id: "1",
        img: "credits/6551OS_Building-Commerce-Application.jpg",
        title: "Building E-Commerce Application",
        desc: "Subsequent to the release of NGCart there emerged interest in crafting a book that featured it as a cornerstone while exploring the development of e-commerce solutions within the MEAN stack. I was invited to serve as the technical editor for this endeavor.",
        href: "https://www.amazon.com/Building-Commerce-Application-Adrian-Mejia/dp/1785286552/ref=sr_1_1?tag=snapjay-20",
      },
      {
        id: "2",
        img: "credits/3945OS_4522_M.E.A.N.Blueprints.jpg",
        title: "MEAN Blueprints",
        desc: "Following the success of the initial book, a subsequent publication was pursued, delving deeper into the intricacies of the MEAN stack framework. This follow-up book aimed to provide a more comprehensive understanding and exploration of MEAN stack technologies of which I serve as the technical editor.",
        href: "https://www.amazon.com/MEAN-Blueprints-Adrian-Mejia/dp/1783983945/ref=sr_1_2?tag=snapjay-20",
      },
    ],
    personal: [
      {
        id: "1",
        img: "credits/jukeboxLogo.svg",
        title: "Jukebox Simulator",
        desc: "I developed a web application that faithfully simulates the functionality and experience of a 1952 Seeburg Select-O-Matic jukebox. Go ahead... Drop a quarter!",
        href: "https://simulator.jukebox.tools/",
      },
      {
        id: "2",
        img: "credits/intelligift-wordmark.svg",
        title: "intelli.gift",
        desc: "Pursued a personal side project centered around AI experimentation, aiming to leverage artificial intelligence to curate the ideal gift selections.",
        href: "https://intelli.gift/",
      },
      {
        id: "3",
        img: "credits/boot.svg",
        title: "Old Boot",
        desc: "One of my passions lies in woodworking, and as an expression of that passion, I have designed and developed a website to showcase my woodworking creations.",
        href: "https://oldboot.us/",
      },
      {
        id: "4",
        img: "credits/cart.svg",
        title: "NGCart",
        desc: "I developed NGCart which became a popular component utilizing the Angular framework, which eventually culminated in a book deal centered around this achievement.",
        href: "https://ngcart.snapjay.com/",
      },
    ],
  }),
  components: {
    LogoLink,
  },
});
</script>

<template>
  <div class="page background">
    <div class="block">
      <h1>Credits</h1>
      <p>
        My project portfolio encompasses a diverse range, spanning from nascent
        stage prototypes to fully-fledged production websites. My professional
        journey has encompassed freelance endeavors and the management of
        personal websites. I have also thrived in the dynamic landscapes of
        small startup environments and collaborative ventures with compact
        agencies.
      </p>
      <p>
        Noteworthy brands that have featured in my project roster include
        follows, among others. I invite you to connect with me to delve deeper
        into the specifics of projects associated with the brands that pique
        your interest.
      </p>
      <h2>Clients</h2>
      <LogoLink :data="clients" />
      <h2>Books</h2>
      <LogoLink :data="books" />
      <h2>Peronal Projects</h2>
      <LogoLink :data="personal" :width="25" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.page {
  padding-top: 100px;
  background-color: rgb(247, 246, 231);
}
</style>