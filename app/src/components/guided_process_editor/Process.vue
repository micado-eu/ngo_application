<template>

  <q-item
  style="padding-top:0px; padding-bottom:0px"
  >
    <div>
      <div >
        <div class=" q-pa-md col" style="width:750px; padding-bottom:0px; padding-left:0px">
          <div style="font-size:20px; text-align:left; font-size:18px">{{ this.Title }}</div>
        </div>
     
    </div>
    <div class=" row" style="width:750px">
       <div class=" q-pa-md  col" style="text-align:left; padding-top:0px;padding-bottom:0px;padding-left:0px">
        <q-chip v-for="tag in Tag_1" :label="tag.user_type" :key="tag.id"></q-chip>
        <q-chip v-for="tag in Tag_2" :label="tag.topic" :key="tag.id"></q-chip>
      </div>
      <div class="q-pa-md q-gutter-sm  col" style="padding-top:0px; padding-bottom:0px; text-align:right">
      <q-btn size="11px" no-caps style="width:70px:border-radius:2px"  color="info" label="Comment" :id=this.Link :disable="hideAdd" @click="hide();comment($event)" />      
      </div>
    </div>
    <hr style="margin:0px">
    </div>
  </q-item>
</template>

<script>
export default {
  name: 'Process',
  props: ["Title",  "Tag_1", "Tag_2", "Link", "Path", "process"], 
  data() {
    return {
      hideAdd: false
    };
  },

  methods: {
  remove_process(event){
      let target = event.currentTarget.id
      console.log(this.Link)
      this.$emit('remove', this.Link)

    }, 
  comment(event){
    this.$emit('comment', this.process)
  },
  hide(){
    this.hideAdd = true;
  },
  restore(){
    this.hideAdd = false
  }
  }
}
</script>
<style scoped>
/*div >>> .q-item {
  border-radius: 2rem;

  &:hover {
    color: blue;
  }
}*/
</style>