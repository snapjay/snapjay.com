<template lang="pug">
  .main
      .container
          .row
            .col-md
              h1.text-center Hey, #[br] It's Dan!
              h2.text-center An experienced front end web developer.
            .col-md-4
                router-link(:to='{name: "contact"}')
                  snap-photo(src='/static/img/snapjay.jpg')
          .row
            .col-md
              p I have been building websites for over 15 years. With a background in all aspects, I specialise in front end VueJS development.
              p I believe in attention to detail, prototyping and user testing. I maintain integrity; not blindly write code that can not be rationalised.
            .col-md
              p I understand the balance between maintaining customer experience and business objectives.
              p I am expert in JavaScript and building interfaces that provide optimum user experience without compromising the business rules.
            .col-md
              p I have worked in conjunction with award-winning agencies on projects for Intel, TD Canada Trust, eBay UK, BBC Worldwide, Telus Mobility and more.
</template>

<script>
  import SnapPhoto from '@/components/SnapPhoto'
  export default {
    name: 'Snapjay',
    components: {
      'snap-photo': SnapPhoto
    }
  }
</script>
<style lang="scss" scoped>

  h1 {
    margin-top: 30px;
    margin-bottom: 20px;
    font-size: 120px;
  }
  h2 {
    color: #b49419;
    font-size: 35px;
    font-weight: 100;
    margin-top: 0;
    margin-bottom: 15px;
    text-align: center;
  }

</style>
