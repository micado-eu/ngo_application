<template>

  <q-item style="padding-top:0px; padding-bottom:0px">
    <div>
      <div>
        <div
          class=" q-pa-md col"
          style="width:750px; padding-bottom:0px; padding-left:0px"
        >
          <div style="font-size:20px; text-align:left; font-size:18px">{{ this.Title }}</div>
        </div>

      </div>
     
        <div class="row pad">
            <q-img
                class="image"
                v-for="tag in Topics"
                :src="processTopics.filter(topic => topic.id == tag.idTopic)[0].icon"
                :key="tag.idTopic">
              </q-img>
               <q-img
                class="image"
                v-for="tag in Users"
                :src="processUsers.filter(user => user.id == tag.idUserTypes)[0].icon"
                :key="tag.idUserTypes"
              >
              </q-img>  
              <div
          class="q-pa-md q-gutter-sm  col"
          style="padding-top:0px; padding-bottom:5px; text-align:right"
        >
          <q-btn
            size="11px"
            no-caps
            style="width:70px:border-radius:2px"
            color="info"
            label="Comment"
            :id=this.Link
            :disable="hideAdd"
            @click="hide();comment($event)"
          />
        </div>
            </div>
        
      
      <hr style="margin:0px">
    </div>
  </q-item>
</template>

<script>
export default {
  name: 'Process',
  props: ["Title", "Link", "Path", "process", "processTopics", "processUsers", "Topics", "Users"],
  data () {
    return {
      hideAdd: false
    };
  },

  methods: {
    remove_process (event) {
      let target = event.currentTarget.id
      console.log(this.Link)
      this.$emit('remove', this.Link)

    },
    comment (event) {
      this.$emit('comment', this.process)
    },
    hide () {
      this.hideAdd = true;
    },
    restore () {
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
.image{
  height: 25px; 
  max-width: 25px;
  margin-right:5px
}
</style>