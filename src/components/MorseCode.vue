<template>
	<!-- Yep; I knew you'd look here to figure out what it says!  Try a little harder! -->
	<div class="marquee" label="So you want to know what it says? - Hint: Try looking at the source code!">
		<ul class="marquee__content ">
			<li v-for="(symbol, index) in morseArray" :key="index" :class="`symbol ${getClass(symbol)}`" />
		</ul>
		<ul class="marquee__content ">
			<li v-for="(symbol, index) in morseArray" :key="index" :class="`symbol ${getClass(symbol)}`" />
		</ul>
	</div>
</template>

<script>
export default {
	name: "MorseCode",
	props: {
		text: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			morseCodeMap: {
				'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
				'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
				'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
				'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
				'Y': '-.--', 'Z': '--..',
				'0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
				'5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
				' ': '/'
			}
		};
	},
	computed: {
		morseArray() {
			return this.text.toUpperCase().split('').flatMap(char =>
				(this.morseCodeMap[char] + '!' || '').split('')
			);
		}
	},
	methods: {
		getClass(symbol) {
			switch (symbol) {
				case '.':
					return 'short';
				case '-':
					return 'long';
				case '/':
					return 'space'
				case '!':
					return 'end';
			}
		}
	}
};
</script>

<style scoped>
.symbol {
	background-color: rgba(32, 29, 24, 0.699);
	height: 15px;
	width: 15px;
	margin: 2px;
	border-radius: 10px;
}

.symbol.long {
	width: 30px;
}

.symbol.end {
	width: 10px;
	background-color: transparent;
}

.symbol.space {
	background-color: transparent;
}

.marquee {
	--gap: .15rem;
	position: relative;
	display: flex;
	overflow: hidden;
	gap: var(--gap);
}

.marquee__content {
	flex-shrink: 0;
	display: flex;
	justify-content: space-around;
	gap: var(--gap);
	min-width: 100%;
}

@keyframes scroll {
	from {
		transform: translateX(0);
	}

	to {
		transform: translateX(calc(-100% - var(--gap)));
	}
}

@media (prefers-reduced-motion: reduce) {
	.marquee__content {
		animation-play-state: paused !important;
	}
}


.marquee__content {
	animation: scroll 10s linear infinite;
}

@keyframes scroll-abs {
	from {
		transform: translateX(calc(100% + var(--gap)));
	}

	to {
		transform: translateX(0);
	}
}
</style>