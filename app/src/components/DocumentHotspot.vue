<template>
  <v-hotspot
    :init-options="hotspotConfig"
    editable="false"
    interactivity="click"
    />
</template>

<script>
import VueHotspot from 'vue-hotspot'

export default {
   name: 'DocumentHotspot',
  props: ['picture', 'data'],
  components:{'v-hotspot': VueHotspot},
  data () {
    return {
      hotspotConfig: {
        image: this.picture,
        editable: false,
        interactivity: 'hover',
        data: this.data,
        hotspotColor: '#85ce61',
        messageBoxColor: '#E9E9E9',
        textColor: '#000000',
        opacity: 0.9
      }
    }
  }
}
</script>
