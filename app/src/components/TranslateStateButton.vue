<template>
  <q-btn-toggle
    toggle-color="accent"
    toggle-text-color="white"
    size="sm"
    :readonly="readonly"
    v-bind:value="value"
    :options="selectOptions"
    v-on:input="val => { 
      if(this.value!=2){
        if((this.value==0 && val==1)||(this.value==1 && val==0)){
        $emit('input', val)
        $emit('micado-change',{id: this.objectId,state: val})
        }else{$q.notify('you cannot change to that state')}
      }else{
      $q.notify('Content in translation you cannot change its state')
      }}"
  />
</template>

<script>
//    @input="valueChanged()"
//val => valueChanged(val)
export default {
  name: 'TranslateStateButton',
  props: ['value', 'readonly', 'isForDefaultLanguage', 'objectId'],

  data () {
    return {
      selectOptions: this.$translationStateOptions
    }
  },
  methods: {
    valueChanged (event) {
      console.log("the translated state in button")
      console.log(event)
      console.log(this)
      console.log(this.value)
      //     console.log(this.$event)
      if (this.value == 1)
        $emit('input', event)
      //      $emit('input', $event.target.value)
    }
  },
  created () {
    console.log("the readonly")
    console.log(this.readonly)
    console.log(this.selectOptions)
    this.selectOptions[3].disable = this.isForDefaultLanguage
    this.selectOptions[3]['v-show'] = this.isForDefaultLanguage
    console.log(this.selectOptions)
    console.log(this.objectId)

  }

}
</script>
