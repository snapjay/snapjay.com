<template lang="pug">
    .main
        .moon
            snap-moon
        img.tree(src='/static/img/play/tree.svg', style="")
        img.tree(src='/static/img/play/tree.svg', style="top:280px; transform:rotate(20deg); ")
        img.tree(src='/static/img/play/tree.svg', style="transform:rotate(180deg); right:0px;")
        img.tree(src='/static/img/play/tree.svg', style="top:280px; transform:rotate(200deg); right:0px;")
        snap-night.sky
        .container()
            .row
                .col-md
                    h1 Play
                    h2 Who am I?
                    p Born and raised in London UK, In 2009, I moved to Toronto, Canada and Colorado in 2015
                    p I balance my time behind the screen by keeping active and healthy.
            .row
                .col-md
                    img.tree(src='/static/img/play/hockey.svg')
                    h3 Ice Hockey
                    p I've been playing hockey for over 10 years.
                    p I've played in leagues, tournaments and recreational, but prefer now a relaxed pick-up.
                    p In winter I'll most likely be found playing under the stars on a pond.
                    h3 Cooking
                    p I'm passionate about cooking and good food; I rarely purchase products that have a nutrition label; I like to create everything from scratch using raw ingredients.
                    p I'll make my own butter, mayonnaise, soups, flour, chili, pies, breads etc.
                    h3 Football
                    p In 2010 I co-founded the TGFL. Canada's first LGBT flag football league.
                    p While I no longer serve on the executive, the league is still going strong with 2 divisions, 14 teams and over 180 players providing an inclusive environment for people to play football.
                    h3 Off Roading
                    p I'm excited to explore the offroad in a Jeep, dirtbike or ATV.
                    p Exploring the back trails is only a success if Jeep comes back covered in more mud than paint.
                    h3 Food and Agriculture
                    p I am very interested agriculture and mass food production industries.
                    p When sourcing my food I try to purchase from local farmers where I can be assure of animal welfare or no artificial ingredients.
                    p I grow my own non-GMO, non-hybrid, heritage strains of herbs, fruits and vegetables.
                    h3 Country
                    p I a big fan of country culture.
                    p I listen country music and somehow end up at every country concert or festival that comes to town.
                    p I enjoy summer evening under the stars, tailgates, fires and demo derby.
</template>

<script>
  import SnapNight from '@/components/SnapNight'
  import SnapMoon from '@/components/SnapMoon'

  export default {
    name: 'Play',
    components: {
      'snap-moon': SnapMoon,
      'snap-night': SnapNight
    }
  }
</script>
<style lang="scss" scoped>
    @import "../assets/styles/variables";
    .main {
        position: relative;
        overflow: hidden;
    }

    .moon {
        width:100px;
        height: 100px;
        right:190px;
        top : 50px;
        position: absolute;
    }
    .tree {
        position: absolute;
        width: 35%;
    }
    .sky {
        position: fixed;
        right: 0;
        bottom: 0;
        min-width: 100%;
        min-height: 100%;
        width: auto;
        height: auto;
        z-index: -100;
        background-size: cover;
    }
</style>
