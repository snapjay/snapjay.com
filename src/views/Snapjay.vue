<template lang="pug">
  .main
      .container
          .row
            .col-md
              h1.text-center Hey, #[br] It's Dan!
              h2.text-center An experienced front end web developer.
            .col-md-4
              .photo
                .tape(style='top: 37px;left: -16px;')
                .tape(style='bottom: -2px;right: 48px;')
                img(src='/static/img/snapjay.jpg', alt='')
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
  export default {
    name: 'Snapjay'
  }
</script>
<style lang="scss" scoped>
  .main {
    background-image: url("/static/img/paper.jpg");
  }
  .photo {
    position: relative;
    transition-property: all;
    -webkit-transition-property: all;
    transition-duration: 1.3s;
    -webkit-transition-duration: 1.3s;
  }
  .photo{
    -webkit-transform: rotate(4.5deg);
    -ms-transform: rotate(4.5deg);
    transform: rotate(4.5deg);
  }
  .photo:hover{
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  .photo img {
    width: 80%;
    margin-top: 40px;
  }
  .photo .tape{
    position: absolute;
    background-color: rgba(249, 240, 204, 0.70);
    width: 104px;
    height: 17px;
    -webkit-transform: rotate(-25.5deg);
    -ms-transform: rotate(-25.5deg);
    transform: rotate(-25.5deg);
    z-index: 10;
  }
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
