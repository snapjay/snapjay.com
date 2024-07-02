<template>
	<h1>Contact</h1>
	<h2>Lets be friends!</h2>
	<ul>
		<li v-for="channel in connect" :key="channel.id">
			<a :href="channel.href" :alt="channel.title" target="_blank" rel="noopener noreferrer">
				<img :src="`/assets/img/${channel.img}`" :alt="channel.title" />
			</a>
		</li>
	</ul>
</template>
<script setup>
const connect = [
	{
		id: 1,
		img: "/connect/email.svg",
		title: "Email",
		href: "mailto:dan@snapjay.com",
	},
	{
		id: 2,
		img: "/connect/linkedin.svg",
		title: "LinkedIn",
		href: "https://www.linkedin.com/profile/view?id=18683312",
	},
	{
		id: 3,
		img: "/connect/github.svg",
		title: "Github",
		href: "http://github.com/snapjay",
	},
	{
		id: 4,
		img: "/connect/x.svg",
		title: "X",
		href: "https://x.com/snapjay",
	},
];

</script>
<style scoped>
img {
	width: 250px;
	height: auto;
	margin: 1.5rem auto;
	display: block;
}
</style>
