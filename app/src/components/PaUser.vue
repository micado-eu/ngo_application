<template>
  <div class="row">
    <q-item class="col" clickable @click="editing">
      {{this.theUser.username}}
    </q-item>
    <div class="col">
    </div>
  </div>
</template>

<script>
import IconWithTooltip from 'components/IconWithTooltip'
export default {
  name: 'PaUser',
  props: ["theUser"],
  data () {
    return {}
  },
  components: {
    IconWithTooltip
  },

  methods: {
    editing(){
      console.log(this.theUser.sub)
      this.$emit('edit', this.theUser.id)
    },
    remove_user (event) {
      let target = event.currentTarget.id
      console.log(this.Path)
      this.$emit('remove', this.Path)

    },
    interventionPlan () {
      console.log(this.theUser)
      this.$router.push({ name: 'interventionplan', params: { theuserid: this.theUser.sub } })
    },
    migrantData () {
      this.$router.push({ name: 'migrantdata', params: { theuserid: this.theUser.sub } })
    }

  }
}
</script>
<style scoped>
.item {
  padding-top: 16px;
  padding-bottom: 0px;
  width: 100%;
}
.username {
  font-size: 20px;
  text-align: left;
  font-size: 18px;
  width: 100%;
  padding-bottom: 0px;
  padding-left: 0px;
}
.width {
  width: 100%;
}
.container {
  text-align: left;
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 0px;
}
.span {
  padding-right: 5px;
}
.button-container {
  padding-top: 0px;
  padding-right: 0px;
  padding-bottom: 0px;
  text-align: center;
}
.button {
  width: 70px;
  margin-bottom: 5px;
  border-radius: 2px;
}
.hr {
  margin: 0px;
}
</style>