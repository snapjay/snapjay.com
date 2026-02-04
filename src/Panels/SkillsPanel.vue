<template>
    <img src="/assets/hero/tools.webp" draggable="false" alt="Rose" class="hero" aria-hidden="true" width="500"
        height="274" />
    <div class="pad">
        <div class="wrapper">
            <h1 class="glitch">Skills</h1>
        </div>

        <p>
            I bring deep experience across the full stack, with a strong foundation in front-end development using
            JavaScript, HTML, and CSS. Alongside hands-on engineering work, I have served as Director of Product
            Strategy, giving me a clear view of how design, engineering, and business decisions intersect across the
            entire product lifecycle.
        </p>

    </div>
    <div class="invert">
        <h2>Vue.js &amp; Angular</h2>
        <p>
            I have evolved alongside modern front-end tooling, from early jQuery-based workflows to today's
            component-driven frameworks. I enjoy working with tools that promote maintainable, scalable code, and
            I have spent recent years building production applications with Vue.js, Angular, and React.
        </p>
    </div>

    <div class="pad">
        <h2>Node.js &amp; Supabase</h2>
        <p>
            While front-end is my specialty, I am comfortable working across the backend to deliver complete
            solutions. I build APIs, authentication flows, and data layers using Node.js and Supabase, enabling
            efficient full-stack development without unnecessary complexity.
        </p>
    </div>

    <div class="invert">
        <h2>User Experience</h2>
        <p>
            I strongly advocate for rapid prototyping, usability testing, and proof of concept to validate ideas
            early. My goal is to reduce risk by proving value before development ramps up, ensuring products are
            intuitive, accessible, and worth the investment before production dollars are spent.
        </p>
    </div>
    <img src="/assets/hero/rose.webp" draggable="false" alt="Yellow Rose - symbolizes friendship, joy, caring and milestones." class="hero" aria-hidden="true"
        width="500" height="751" />

</template>
<style scoped>
.hero {
    margin-bottom: 1rem;
}

.pad:hover h1.glitch {
    position: relative;
}

.pad:hover h1.glitch::before,
.pad:hover h1.glitch::after {
    content: "Skills";
    position: absolute;
    width: 100%;
    height: 100%;
    background: black;
    overflow: hidden;
    top: 0;
}

.pad:hover h1.glitch::before {
    left: 2px;
    text-shadow: -2px 0 #d81414;
    animation-name: glitch-animation-1;
    animation-duration: 2s;
    animation-timing-function: linear;
    animation-delay: 0s;
    animation-iteration-count: infinite;
    animation-direction: reverse-alternate;
}

.pad:hover h1.glitch::after {
    left: -2px;
    text-shadow: -2px 0 #1212d6;
    animation-name: glitch-animation-2;
    animation-duration: 2s;
    animation-timing-function: linear;
    animation-delay: 0s;
    animation-iteration-count: infinite;
    animation-direction: reverse-alternate;
}

@keyframes glitch-animation-1 {
    0% {
        clip: rect(53px, 350px, 98px, 0px);
    }

    5% {
        clip: rect(76px, 350px, 102px, 0px);
    }

    10% {
        clip: rect(0px, 350px, 68px, 0px);
    }

    15% {
        clip: rect(4px, 350px, 123px, 0px);
    }

    20% {
        clip: rect(21px, 350px, 45px, 0px);
    }

    25% {
        clip: rect(91px, 350px, 111px, 0px);
    }

    30% {
        clip: rect(9px, 350px, 101px, 0px);
    }

    35% {
        clip: rect(82px, 350px, 139px, 0px);
    }

    40% {
        clip: rect(66px, 350px, 90px, 0px);
    }

    45% {
        clip: rect(110px, 350px, 128px, 0px);
    }

    50% {
        clip: rect(25px, 350px, 75px, 0px);
    }

    55% {
        clip: rect(89px, 350px, 112px, 0px);
    }

    60% {
        clip: rect(7px, 350px, 114px, 0px);
    }

    65% {
        clip: rect(48px, 350px, 83px, 0px);
    }

    70% {
        clip: rect(100px, 350px, 132px, 0px);
    }

    75% {
        clip: rect(52px, 350px, 95px, 0px);
    }

    80% {
        clip: rect(73px, 350px, 119px, 0px);
    }

    85% {
        clip: rect(8px, 350px, 140px, 0px);
    }

    90% {
        clip: rect(34px, 350px, 74px, 0px);
    }

    95% {
        clip: rect(79px, 350px, 103px, 0px);
    }

    100% {
        clip: rect(61px, 350px, 98px, 0px);
    }
}

@keyframes glitch-animation-2 {
    0% {
        clip: rect(0px, 350px, 111px, 0px);
    }

    5% {
        clip: rect(90px, 350px, 128px, 0px);
    }

    10% {
        clip: rect(5px, 350px, 84px, 0px);
    }

    15% {
        clip: rect(39px, 350px, 92px, 0px);
    }

    20% {
        clip: rect(78px, 350px, 105px, 0px);
    }

    25% {
        clip: rect(53px, 350px, 77px, 0px);
    }

    30% {
        clip: rect(97px, 350px, 129px, 0px);
    }

    35% {
        clip: rect(65px, 350px, 102px, 0px);
    }

    40% {
        clip: rect(0px, 350px, 116px, 0px);
    }

    45% {
        clip: rect(72px, 350px, 98px, 0px);
    }

    50% {
        clip: rect(110px, 350px, 140px, 0px);
    }

    55% {
        clip: rect(84px, 350px, 117px, 0px);
    }

    60% {
        clip: rect(47px, 350px, 91px, 0px);
    }

    65% {
        clip: rect(104px, 350px, 135px, 0px);
    }

    70% {
        clip: rect(63px, 350px, 89px, 0px);
    }

    75% {
        clip: rect(0px, 350px, 101px, 0px);
    }

    80% {
        clip: rect(79px, 350px, 108px, 0px);
    }

    85% {
        clip: rect(68px, 350px, 100px, 0px);
    }

    90% {
        clip: rect(82px, 350px, 123px, 0px);
    }

    95% {
        clip: rect(54px, 350px, 87px, 0px);
    }

    100% {
        clip: rect(99px, 350px, 139px, 0px);
    }
}
</style>