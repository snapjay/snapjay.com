<script setup>
import { onMounted, ref } from 'vue'
import Panel from './PanelLayout.vue'
import HomePanel from '../Panels/HomePanel.vue'
import SkillsPanel from '../Panels/SkillsPanel.vue'
import CreditsPanel from '../Panels/CreditsPanel.vue'
import BooksPanel from '../Panels/BooksPanel.vue'
import PersonalPanel from '../Panels/PersonalPanel.vue'
import PlayPanel from '../Panels/PlayPanel.vue'
import ConnectPanel from '../Panels/ConnectPanel.vue'
defineProps({
  msg: {
    type: String,
    required: false
  }
})

const homePanel = ref(null)

onMounted(() => {
    homePanel.value.focus()
})
</script>

<template>
  <div id="canvas" class="draggable-container">
    <Panel ref="homePanel">
      <HomePanel />
    </Panel>
    <Panel>
      <SkillsPanel />
    </Panel>
    <Panel :invert="true">
      <CreditsPanel />
    </Panel>
    <Panel>
      <BooksPanel />
    </Panel>
    <Panel :invert="true">
      <PersonalPanel />
    </Panel>
    <Panel background="felt.webp" :cover="false">
      <PlayPanel />
    </Panel>
    <Panel :invert="true">
      <ConnectPanel />
    </Panel>
    <div></div>
  </div>
</template>

<style scoped>
#canvas {
  padding-left: 10rem;
  display: grid;
  height: 100%;
  grid-gap: 1rem;
  grid-template-columns: repeat(7, 500px) 0.5rem;
}

@media (max-width: 1200px) {
  #canvas {
    padding-left: 0rem;
    grid-template-columns: 1fr;
    grid-gap: 0rem;
    max-width: 100vw;
  }
}
</style>
