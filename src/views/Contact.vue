<template lang="pug">
    .container
        .row
            .col-md
                h1 Lets Be Friends!
                h2 Dan Shreim
                p I am currently based in Erie, Colorado.
                p Thank-you for taking the time to view my site; #[br] If you'd like to see my code; please checkout my #[a(href='http://github.com/snapjay', target='_blank') Github]. #[br] If you'd like to hire me or want to learn more, please make contact:
                .row.mt-3
                    .col-md
                        .text-center
                            a(href='mailto:dan@snapjay.com', target='_blank')
                                svg.icon.mail(version="1.1", xmlns="http://www.w3.org/2000/svg", xmlns:xlink="http://www.w3.org/1999/xlink", viewBox="0 0 100 100", aria-label="Email")
                                    path(d="M50,1C22.938,1,1,22.938,1,50s21.938,49,49,49s49-21.938,49-49S77.062,1,50,1z M25.5,25.5h49 c0.874,0,1.723,0.188,2.502,0.542L50,57.544L22.998,26.041C23.777,25.687,24.626,25.499,25.5,25.5L25.5,25.5z M19.375,68.375v-36.75 c0-0.128,0.005-0.256,0.014-0.383l17.96,20.953L19.587,69.958C19.448,69.447,19.376,68.916,19.375,68.375L19.375,68.375z M74.5,74.5 h-49c-0.541,0-1.072-0.073-1.583-0.212l17.429-17.429L50,66.956l8.653-10.096l17.429,17.429C75.572,74.427,75.041,74.5,74.5,74.5 L74.5,74.5z M80.625,68.375c0,0.541-0.073,1.072-0.211,1.583L62.652,52.195l17.96-20.953c0.008,0.127,0.014,0.255,0.014,0.383 L80.625,68.375L80.625,68.375z")
                    .col-md
                        .text-center
                            a(href='https://www.linkedin.com/profile/view?id=18683312', target='_blank')
                                svg.icon.linkedin(version="1.1", xmlns="http://www.w3.org/2000/svg", xmlns:xlink="http://www.w3.org/1999/xlink", viewBox="0 0 100 100", xml:space="preserve", aria-label="Linked In")
                                    path(d="M87.877,5.608H11.174c-3.673,0-6.65,2.886-6.65,6.448v77.101c0,3.562,2.978,6.451,6.65,6.451h76.703c3.673,0,6.646-2.89,6.646-6.451V12.056C94.523,8.495,91.55,5.608,87.877,5.608z M31.809,80.944H18.211V40.31h13.598V80.944zM25.011,34.759H24.92c-4.56,0-7.516-3.119-7.516-7.023c0-3.983,3.043-7.017,7.693-7.017c4.651,0,7.512,3.033,7.602,7.017C32.699,31.641,29.749,34.759,25.011,34.759z M80.827,80.944H67.233v-21.74c0-5.464-1.97-9.191-6.886-9.191c-3.761,0-5.993,2.515-6.973,4.942c-0.364,0.868-0.453,2.08-0.453,3.292v22.696H39.329c0,0,0.178-36.823,0-40.634h13.593v5.761c1.805-2.768,5.029-6.717,12.249-6.717c8.947,0,15.656,5.804,15.656,18.291V80.944z M52.834,46.199c0.024-0.038,0.056-0.084,0.088-0.128v0.128H52.834z")
                    .col-md
                        .text-center
                            a(href='http://github.com/snapjay', target='_blank')
                                svg.icon.github(version="1.1", xmlns="http://www.w3.org/2000/svg", xmlns:xlink="http://www.w3.org/1999/xlink", viewBox="0 0 100 100", aria-label="GitHub")
                                    path(d="M50,1C22.938,1,1,22.938,1,50s21.938,49,49,49s49-21.938,49-49S77.062,1,50,1z M79.099,79.099 c-3.782,3.782-8.184,6.75-13.083,8.823c-1.245,0.526-2.509,0.989-3.79,1.387v-7.344c0-3.86-1.324-6.699-3.972-8.517 c1.659-0.16,3.182-0.383,4.57-0.67c1.388-0.287,2.855-0.702,4.402-1.245c1.547-0.543,2.935-1.189,4.163-1.938 c1.228-0.75,2.409-1.723,3.541-2.919s2.082-2.552,2.847-4.067s1.372-3.334,1.818-5.455c0.446-2.121,0.67-4.458,0.67-7.01 c0-4.945-1.611-9.155-4.833-12.633c1.467-3.828,1.308-7.991-0.478-12.489l-1.197-0.143c-0.829-0.096-2.321,0.255-4.474,1.053 c-2.153,0.798-4.57,2.105-7.249,3.924c-3.797-1.053-7.736-1.579-11.82-1.579c-4.115,0-8.039,0.526-11.772,1.579 c-1.69-1.149-3.294-2.097-4.809-2.847c-1.515-0.75-2.727-1.26-3.637-1.532c-0.909-0.271-1.754-0.439-2.536-0.503 c-0.782-0.064-1.284-0.079-1.507-0.048c-0.223,0.031-0.383,0.064-0.478,0.096c-1.787,4.53-1.946,8.694-0.478,12.489 c-3.222,3.477-4.833,7.688-4.833,12.633c0,2.552,0.223,4.889,0.67,7.01c0.447,2.121,1.053,3.94,1.818,5.455 c0.765,1.515,1.715,2.871,2.847,4.067s2.313,2.169,3.541,2.919c1.228,0.751,2.616,1.396,4.163,1.938 c1.547,0.543,3.014,0.957,4.402,1.245c1.388,0.287,2.911,0.511,4.57,0.67c-2.616,1.787-3.924,4.626-3.924,8.517v7.487 c-1.445-0.43-2.869-0.938-4.268-1.53c-4.899-2.073-9.301-5.041-13.083-8.823c-3.782-3.782-6.75-8.184-8.823-13.083 C9.934,60.948,8.847,55.56,8.847,50s1.087-10.948,3.231-16.016c2.073-4.899,5.041-9.301,8.823-13.083s8.184-6.75,13.083-8.823 C39.052,9.934,44.44,8.847,50,8.847s10.948,1.087,16.016,3.231c4.9,2.073,9.301,5.041,13.083,8.823 c3.782,3.782,6.75,8.184,8.823,13.083c2.143,5.069,3.23,10.457,3.23,16.016s-1.087,10.948-3.231,16.016 C85.848,70.915,82.88,75.317,79.099,79.099L79.099,79.099z")
                    .col-md
                        .text-center
                            a(href='http://twitter.com/snapjay', target='_blank')
                                svg.icon.twitter(version="1.1", xmlns="http://www.w3.org/2000/svg", xmlns:xlink="http://www.w3.org/1999/xlink", viewBox="0 0 100 100", aria-label="Twitter")
                                    path(d="M99.001,19.428c-3.606,1.608-7.48,2.695-11.547,3.184c4.15-2.503,7.338-6.466,8.841-11.189 c-3.885,2.318-8.187,4-12.768,4.908c-3.667-3.931-8.893-6.387-14.676-6.387c-11.104,0-20.107,9.054-20.107,20.223 c0,1.585,0.177,3.128,0.52,4.609c-16.71-0.845-31.525-8.895-41.442-21.131C6.092,16.633,5.1,20.107,5.1,23.813 c0,7.017,3.55,13.208,8.945,16.834c-3.296-0.104-6.397-1.014-9.106-2.529c-0.002,0.085-0.002,0.17-0.002,0.255 c0,9.799,6.931,17.972,16.129,19.831c-1.688,0.463-3.463,0.71-5.297,0.71c-1.296,0-2.555-0.127-3.783-0.363 c2.559,8.034,9.984,13.882,18.782,14.045c-6.881,5.424-15.551,8.657-24.971,8.657c-1.623,0-3.223-0.096-4.796-0.282 c8.898,5.738,19.467,9.087,30.82,9.087c36.982,0,57.206-30.817,57.206-57.543c0-0.877-0.02-1.748-0.059-2.617 C92.896,27.045,96.305,23.482,99.001,19.428z")

</template>

<script>
  export default {
    name: 'Contact'
  }
</script>

<style lang="scss" scoped>
    @import "../assets/styles/variables";

    .icon {
        transition-property: width fill opacity;
        -webkit-transition-property: width fill opacity;
        transition-duration: 1.3s;
        -webkit-transition-duration: 1.3s;
        opacity: 0.3;
        width: 50%;
        fill: #fff;
    }

    .icon:hover {
        opacity: 1;
        width: 60%;
    }

    .icon.mail:hover {
        fill: $contact;
    }

    .icon.github:hover {
        fill: #333;
    }

    .icon.twitter:hover {
        fill: #00aced;
    }

    .icon.facebook:hover {
        fill: #3b5998;
    }

    .icon.linkedin:hover {
        fill: #0177B5;
    }
</style>
