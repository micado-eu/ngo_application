<template>
<div>
  <q-item clickable @click="selectGraph()" style="padding-top:0px; padding-bottom:0px">
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
                :key="'topic'.concat(tag.idTopic)">
              </q-img>
               <q-img
                class="image"
                v-for="tag in Users"
                :src="processUsers.filter(user => user.id == tag.idUserTypes)[0].icon"
                :key="'user'.concat(tag.idUserTypes)"
              >
              </q-img>  
              <div
          class="q-pa-md q-gutter-sm  col"
          style="padding-top:0px; padding-bottom:5px; text-align:right"
        >
          <q-btn
            size="11px"
            no-caps
            :data-cy="'commentoprocess'.concat(Link)"
            style="width:70px:border-radius:2px"
            color="info"
            label="Comment"
            :disable="hideAdd"
            @click.stop="hide();comment($event)"
          />
        </div>
            </div>
        
      
      <hr style="margin:0px">
    </div>

  </q-item>
  <div v-if ="selectedProcess == this.Link" class="row">
      <div class="col">

       <vue-mermaid
            class="center"
            :nodes="mermaid"
            :config="merconf"
            type="graph TD"
            v-on:nodeClick="editNodeMer"
          ></vue-mermaid>
      </div>
    </div>
  </div>
</template>

<script>
import storeMappingMixin from '../../mixin/storeMappingMixin'
import editEntityMixin from '../../mixin/editEntityMixin'
export default {
  name: 'Process',
  mixins:[editEntityMixin,
    storeMappingMixin({
    getters: {

    }, actions: {
      fetchGraph: 'flows/fetchGraph',
    }
  })
  ],
  props: ["Title", "Link", "Path", "process", "processTopics", "processUsers", "Topics", "Users", 'selectedProcess', 'mermaid'],
  data () {
    return {
      open:true,
      hideAdd: false,
      merconf: { theme: "default", startOnLoad: false, securityLevel: 'loose', useMaxWidth: false, flowchart: { padding: 5 } },
    };
  },

  methods: {
    editNodeMer(){
      console.log("clicked on node")
    },
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
    }, 
    selectGraph(){
     
      console.log("emitting graph")
      this.$emit('selectGraph', this.Link)
    }
  }, 
  created() {
      
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