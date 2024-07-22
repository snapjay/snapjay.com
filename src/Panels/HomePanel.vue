<template>
  <div class="block">
    <div class="container">
      <div class="background">
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="Gradient1" cx="50%" cy="50%" fx="0.441602%" fy="50%" r=".5">
              <animate attributeName="fx" dur="34s" values="0%;3%;0%" repeatCount="indefinite"></animate>
              <stop offset="0%" stop-color="rgba(128, 0, 128, 1)"></stop>
              <stop offset="100%" stop-color="rgba(128, 0, 128, 0)"></stop>
            </radialGradient>
            <radialGradient id="Gradient2" cx="50%" cy="50%" fx="2.68147%" fy="50%" r=".5">
              <animate attributeName="fx" dur="23.5s" values="0%;3%;0%" repeatCount="indefinite"></animate>
              <stop offset="0%" stop-color="rgba(128, 128, 0, 1)"></stop>
              <stop offset="100%" stop-color="rgba(128, 128, 0, 0)"></stop>
            </radialGradient>
            <radialGradient id="Gradient3" cx="50%" cy="50%" fx="0.836536%" fy="50%" r=".5">
              <animate attributeName="fx" dur="21.5s" values="0%;3%;0%" repeatCount="indefinite"></animate>
              <stop offset="0%" stop-color="rgba(0, 128, 128, 1)"></stop>
              <stop offset="100%" stop-color="rgba(0, 128, 128, 0)"></stop>
            </radialGradient>
            <radialGradient id="Gradient4" cx="50%" cy="50%" fx="4.56417%" fy="50%" r=".5">
              <animate attributeName="fx" dur="23s" values="0%;5%;0%" repeatCount="indefinite"></animate>
              <stop offset="0%" stop-color="rgba(0, 128, 0, 1)"></stop>
              <stop offset="100%" stop-color="rgba(0, 128, 0, 0)"></stop>
            </radialGradient>
            <radialGradient id="Gradient5" cx="50%" cy="50%" fx="2.65405%" fy="50%" r=".5">
              <animate attributeName="fx" dur="24.5s" values="0%;5%;0%" repeatCount="indefinite"></animate>
              <stop offset="0%" stop-color="rgba(0,0,128, 1)"></stop>
              <stop offset="100%" stop-color="rgba(0,0,128, 0)"></stop>
            </radialGradient>
            <radialGradient id="Gradient6" cx="50%" cy="50%" fx="0.981338%" fy="50%" r=".5">
              <animate attributeName="fx" dur="25.5s" values="0%;5%;0%" repeatCount="indefinite"></animate>
              <stop offset="0%" stop-color="rgba(128,0,0, 1)"></stop>
              <stop offset="100%" stop-color="rgba(128,0,0, 0)"></stop>
            </radialGradient>
          </defs>
          <rect x="13.744%" y="1.18473%" width="100%" height="100%" fill="url(#Gradient1)"
            transform="rotate(334.41 50 50)">
            <animate attributeName="x" dur="20s" values="25%;0%;25%" repeatCount="indefinite"></animate>
            <animate attributeName="y" dur="21s" values="0%;25%;0%" repeatCount="indefinite"></animate>
            <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="7s"
              repeatCount="indefinite"></animateTransform>
          </rect>
          <rect x="-2.17916%" y="35.4267%" width="100%" height="100%" fill="url(#Gradient2)"
            transform="rotate(255.072 50 50)">
            <animate attributeName="x" dur="23s" values="-25%;0%;-25%" repeatCount="indefinite"></animate>
            <animate attributeName="y" dur="24s" values="0%;50%;0%" repeatCount="indefinite"></animate>
            <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="12s"
              repeatCount="indefinite"></animateTransform>
          </rect>
          <rect x="9.00483%" y="14.5733%" width="100%" height="100%" fill="url(#Gradient3)"
            transform="rotate(139.903 50 50)">
            <animate attributeName="x" dur="25s" values="0%;25%;0%" repeatCount="indefinite"></animate>
            <animate attributeName="y" dur="12s" values="0%;25%;0%" repeatCount="indefinite"></animate>
            <animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur="9s"
              repeatCount="indefinite"></animateTransform>
          </rect>
        </svg>
      </div>
      <div class="content">
        <div class="pad">
          <h1>Seasoned Front End Engineer</h1>
          <h2>Hey; it's Dan!</h2>
          <p> I am a front-end engineer specializing in VueJS and ReactJS.</p>
          <p> I balance user experience with business objectives, adeptly crafting interfaces that
            harmonize both. My portfolio includes collaborations with multi award-winning agencies, contributing to
            projects
            for prominent brands such as Intel, TD Canada Trust, eBay UK, BBC Worldwide, and Telus Mobility.</p>
        </div>
      </div>
    </div>
    <div>
      <div class="invert">
        <h2>Experienced</h2>
        <p>With over 20 years dedicated to website development, my career has span across multiple sectors;
          technologies and
          counties; giving me a wide range of skill, knowable and experience to create a fast, efficient and user
          friendly
          experience.</p>
      </div>
      <div class="pad">
        <h2>It Just Works</h2>
        <p>I prioritize user experience and attention to detail, employing prototyping and user testing and proof of
          concept
          to ensure the end product will be successful before it's built. I am a strong advocate for accessibility
          and performance, ensuring that the end product is usable, fast. Looks good and works well.
        </p>
      </div>
      <hr />
      <q>
        "Your website is the first conversation with your customer. <br /> Make it count."
        <div class="credit">- snapjay</div>
      </q>
    </div>


  </div>
</template>
<style scoped>
svg {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.container {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  /* or a background image */
  z-index: 0;
}

.content {
  position: relative;
  z-index: 1;
  /* Add your content styles here */
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.out-top {
  animation: rotate 20s linear infinite;
  transform-origin: 13px 25px;
}

.in-top {
  animation: rotate 10s linear infinite;
  transform-origin: 13px 25px;
}

.out-bottom {
  animation: rotate 25s linear infinite;
  transform-origin: 84px 93px;
}

.in-bottom {
  animation: rotate 15s linear infinite;
  transform-origin: 84px 93px;
}
</style>