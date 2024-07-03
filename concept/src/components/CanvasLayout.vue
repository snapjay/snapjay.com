<script setup>
import Panel from './PanelLayout.vue'
import HomePanel from '../Panels/HomePanel.vue'
import SkillsPanel from '../Panels/SkillsPanel.vue'
import CreditsPanel from '../Panels/CreditsPanel.vue'
import BooksPanel from '../Panels/BooksPanel.vue'
import PersonalPanel from '../Panels/PersonalPanel.vue'
import PlayPanel from '../Panels/PlayPanel.vue'
import ContactPanel from '../Panels/ContactPanel.vue'
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
      <ContactPanel />
    </Panel>
  </div>
</template>

<style scoped>
#canvas {
  display: grid;
  height: 100%;
  grid-gap: 1rem;
  grid-template-columns: repeat(7, 500px);
}
</style>
