<template lang="pug">
    .container
        .row.justify-content-md-center
            .col-md-4
                h1 Play
                h2 Who am I?
                p Born and raised in London UK, In 2009, I moved to Toronto, Canada and Colorado, USA in 2015
                p I balance my time behind the screen by keeping active and healthy.
        .row.justify-content-md-center
            .col-md-4.viewport
                router-link(:to='{name: "play", params: {active: "county"} }')
                    img(src='/static/img/play/boot.svg', alt='Boot')
                router-link(:to='{name: "play", params: {active: "cooking"} }')
                    img(src='/static/img/play/cooking.svg', alt='Cooking')
                router-link(:to='{name: "play", params: {active: "food"} }')
                    img(src='/static/img/play/food.svg', alt='Food')
                router-link(:to='{name: "play", params: {active: "football"} }')
                    img(src='/static/img/play/football.svg', alt='Football')
                router-link(:to='{name: "play", params: {active: "offroad"} }')
                    img(src='/static/img/play/jeep.svg', alt='Off Roading')
                router-link(:to='{name: "play", params: {active: "hockey"} }')
                    img(src='/static/img/play/hockey.svg', alt='Hockey')

                div(v-if='active === "hockey"', role='presentation')
                    h3 Ice Hockey
                    p I've been playing hockey for over 10 years.
                    p I've played in leagues, tournaments and recreational, but prefer now a relaxed pick-up.
                    p In winter I'll most likely be found playing under the stars on a pond.

                div(v-if='active === "cooking"', role='presentation')
                    h3 Cooking
                    p I'm passionate about cooking and good food; I rarely purchase products that have a nutrition label; I like to create everything from scratch using raw ingredients.
                    p I'll make my own butter, mayonnaise, soups, flour, chili, pies, breads etc.

                div(v-if='active === "football"', role='presentation')
                    h3 Football
                    p In 2010 I co-founded the TGFL. Canada's first LGBT flag football league.
                    p While I no longer serve on the executive, the league is still going strong with 2 divisions, 14 teams and over 180 players providing an inclusive environment for people to play football.

                div(v-if='active === "offroad"', role='presentation')
                    h3 Off Roading
                    p I'm excited to explore the offroad in a Jeep, dirtbike or ATV.
                    p Exploring the back trails is only a success if Jeep comes back covered in more mud than paint.

                div(v-if='active === "food"', role='presentation')
                    h3 Food and Agriculture
                    p I am very interested agriculture and mass food production industries.
                    p When sourcing my food I try to purchase from local farmers where I can be assure of animal welfare or no artificial ingredients.
                    p I grow my own non-GMO, non-hybrid, heritage strains of herbs, fruits and vegetables.

                div(v-if='active === "county"', role='presentation')
                    h3 Country
                    p I a big fan of country culture.
                    p I listen country music and somehow end up at every country concert or festival that comes to town.
                    p I enjoy summer evening under the stars, tailgates, fires and demo derby.

</template>

<script>
  export default {
    name: 'Play',
    props: {
      active: {
        type: String,
        default: 'whoami'
      }
    }
  }
</script>
