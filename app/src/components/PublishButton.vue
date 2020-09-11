<template>
  <q-toggle
    v-model="value"
    v-on:input="valueChanged()"
    :label="label"
  />
</template>

<script>
export default {
  // name: 'PublishButton',
  props: ['value', "label", "translationState"],

  data () {
    return {}
  },
  methods: {
    valueChanged () {
      console.log(this.value)
      if (this.translationState)
        $emit($event.target.value, 'input')
    }
  }

}
</script>
