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
                            p I have worked as the technical writer for #[abbr(title='MongoDB, Express.js, AngularJS, and Node.js') MEAN] stack books.
                            .row
                                .col-md
                                    a(href='https://amzn.to/2ybzwU8', target='_blank')
                                        img.book(src='/static/img/credits/6551OS_Building-Commerce-Application.jpg', alt='Building an E-Commerce Application with MEAN')

                                .col-md
                                    a(href='https://amzn.to/2pNHJJD', target='_blank')
                                        img.book.fluid(src='/static/img/credits/3945OS_4522_M.E.A.N.Blueprints.jpg', alt='MEAN Blueprints')

                            h2.mt-3 Personal Projects
                            h3 Garage Door
                            p I constructed a #[abbr(title='Internet of Things') IOT] garage opener using a Raspberry Pi.
                            p It has an API, #[a(href='https://github.com/snapjay/garage-door-web-client', target='_blank') Vue], Google Home (dialogflow), and JAVA #[a(href='https://github.com/snapjay/garage-door-android', target='_blank') Android] client.
                            p It alerts me when it's been open to long, didn't open or close properly, is opened when no one is home and automatically closes when left open at night.
                            h3 ngCart
                            p I authored the popular open source AngularJS #[a(href='http://ngcart.snapjay.com/', target='_blank') shopping cart] which was used in the above book 'Building an E-Commerce Application with MEAN'.

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
        border-top: 2px solid #000;
        background-color: #000;
        width: 180px;
    }
    .offset {
        margin-bottom: 200px;
    }
</style>
