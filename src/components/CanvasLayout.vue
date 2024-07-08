<script setup>
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
</script>

<template>
  <div id="canvas" v-dragscroll class="draggable-container">
    <Panel background="44956031652_f1348f0645_b.jpg">
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
    <Panel>
      <PersonalPanel />
    </Panel>
    <Panel background="felt.jpg" :cover="false">
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
