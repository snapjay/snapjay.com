<template lang='pug'>
    .offset
        .container
            .row
                .col-md
                    h1 Credits
                    .row
                        .col-md
                            p I have worked on a variety of projects from early stage prototypes to full production websites. I've experienced freelance, run my own websites. Worked with small start-ups environments and small agencies.
                        .col-md
                            p Following are some brands I've worked on projects for. Contact me to learn more about the ones that interest you:
                    .row
                        .col-md
                            h2 Clients
                            ul
                                li Telus Mobility
                                li TD Canada Trust
                                li UK Payments Administration
                                li Lloyds TSB
                                li BBC Worldwide
                                li First Plus (Barclay Card)
                                li eBay.co.uk
                                li Intel
                                li Pizza Pizza
                                li Top Gear
                                li Channel 4
                                li Lonley Planet
                        .col-md
                            h2 Books
                            p I have worked as the technical writer for MEAN stack books.
                            .row
                                .col-md
                                    a(href='https://amzn.to/2ybzwU8', target='_blank')
                                        img.book(src='/static/img/credits/6551OS_Building-Commerce-Application.jpg', alt='Building an E-Commerce Application with MEAN')

                                .col-md
                                    a(href='https://amzn.to/2pNHJJD', target='_blank')
                                        img.book.fluid(src='/static/img/credits/3945OS_4522_M.E.A.N.Blueprints.jpg', alt='MEAN Blueprints')
        snap-scape
</template>

<script>
  import SnapScape from '@/components/Credits/SnapScape'

  export default {
    name: 'Credits',
    components: {
      'snap-scape': SnapScape
    }
  }
</script>

<style scoped>
    .book {
        border-top: 1px solid #000;
        background-color: #000;
        width: 180px;
    }
    .offset {
        margin-bottom: 200px;
    }
</style>
