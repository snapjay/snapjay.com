<template lang="pug">
    .container
        .row
            .col-md
                h1 Skills
                .row
                    .col-md
                        p My career has primarily focused on font-end development JavaScript, HTML and CSS.  Currently Director of Product strategy I have also worked as a product owner, so understand the importance of the interface for the end user.
                    .col-md
                        p I use rapid prototyping and usability testing to prove out a product before build. I like code to be efficient and elegant. This means that I can develop complex functionality while maintaining a quality user experience.

                .row
                    .col-md
                        h2 Technology
                        ul
                            li Vue.js (and Vuex, Vue Router)
                            li TypeScript
                            li AngularJS
                            li #[abbr(title='Single-page application') SPA]
                            li #[abbr(title='Sassy CSS') SCSS]
                            li Bootstrap
                            li Webpack
                            li Unit / #[abbr(title='End to end') E2E] Testing
                    .col-md
                        h2 Concepts
                        ul
                            li Responsive Design
                            li Performance optimization
                            li Rapid prototyping and wireframing
                            li Usability Testing
                            li #[abbr(title='Web Content Accessibility Guidelines') WCAG] Accessibility Compliance
                            li
                                abbr(title='Search Engine Optimization') SEO
                    .col-md
                        h2 Peripheral
                        ul
                            li PHP
                            li Node.js
                            li Illustrator
                            li Photoshop
</template>

<script>
  export default {
    name: 'Skills'
  }
</script>
<style lang="scss" scoped>
    @import "../assets/styles/variables";
</style>
