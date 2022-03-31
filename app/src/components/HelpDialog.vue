<template>
  <q-dialog v-model="selected_info" @hide="reset()">
      <q-card class="q-pa-md" style="padding-top: 0px;width: 700px; max-width: 80vw;border: 2px solid #FF7C44;">
        <q-card-section>
          <div class="text-h6">{{ $t(nav.label) }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{$t(nav.description)}}
        </q-card-section>

      </q-card>
    </q-dialog>
</template>

<script>

export default {
  //name: 'Map',
  props:['nav', 'selected_info'],
  components: {
    
  },
  data () {
    
    return {
    }
  },
  methods:{
    reset(){
      this.$emit("hiding")
    }
  }
}
</script>
<style scoped>
.main_body{
  font-size: 16px;
}
.text-h6{
  font-weight: 700;
  font-size: 20px;
  color: #0F3A5D;
}
</style>
