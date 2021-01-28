<template>
  <div class="row items-center all-pointer-events">
    <q-icon class="" size="md" :name="this.icon" />
    <q-tooltip content-class="bg-grey-8" anchor="top left" self="bottom left" :offset="[0, 8]">
      {{this.tooltip}}
      </q-tooltip>
  </div> 
</template>

<script>
export default {
  name: "IconWithTooltip",
  props:["icon", "tooltip"]
}
</script>
<style>
</style>
