<template>
  <div class="row items-center all-pointer-events div-3" style="padding-top:10px">
    <q-icon class="q-mr-xs" size="24px" name="img:statics/icons/Help.png" />
      {{this.fieldLabel}}
    <q-tooltip content-class="bg-grey-8" anchor="top left" self="bottom left" :offset="[0, 8]">
      {{this.helpLabel}}
      </q-tooltip>
  </div> 
</template>

<script>
export default {
  name: "HelpLabel",
  props:["fieldLabel", "helpLabel"]
}
</script>
<style>
</style>
