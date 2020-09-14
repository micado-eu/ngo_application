<template>
  <q-btn-toggle
    v-bind:value="value"
    :options="selectOptions"
    v-on:input="val => { if(this.value!=2){$emit('input', val)}else{
      $q.notify('Content in translation you cannot change its state')}}"
  />
</template>

<script>
//    @input="valueChanged()"
//val => valueChanged(val)
export default {
  name: 'TranslateStateButton',
  props: ['value'],

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
  }

}
</script>
