  <template>
  <div class="container">
    <q-card>
      <q-card-section :hidden="hideForm">
        <q-tabs
          v-model="langTab"
          dense
          class="bg-grey-2"
          active-color="accent"
          indicator-color="accent"
          align="justify"
          narrow-indicator
        >
          <q-tab
            v-for="language in languages"
            :key="language.lang"
            :name="language.name"
            :label="language.name"
          />
        </q-tabs>
        <q-tab-panels
          v-model="langTab"
          class="bg-grey-2 inset-shadow "
          animated
        >
          <q-tab-panel
            v-for="language in languages"
            :key="language.lang"
            :name="language.name"
          >
            <q-input
              v-model="int_comment_shell.translations.filter(filterTranslationModel(language.lang))[0].comment"
              filled
              type="textarea"
              label="Comment"
              :readonly="!(int_comment_shell.translations.filter(filterTranslationModel(language.lang))[0].translationState==0)||!(language.lang===activeLanguage)"
            />
            <div>
              <TranslateStateButton
                v-model="int_comment_shell.translations.filter(filterTranslationModel(language.lang))[0].translationState"
                :isForDefaultLanguage="language.lang===activeLanguage"
                :objectId="int_comment_shell.id"
                :readonly="!(language.lang===activeLanguage)"
                @micado-change="test"
                @return-to-edit="test2"
              />
            </div>
          </q-tab-panel>
        </q-tab-panels>

        <q-btn
          color="accent"
          :data-cy="'savecomment'"
          unelevated
          rounded
          style="width:70px;border-radius:2px"
          label="Save"
          @click="saveComment(int_comment_shell)"
        />
        <q-btn
          class="button"
          :data-cy="'cancelcomment'"
          unelevated
          rounded
          style="width:70px;border-radius:2px"
          label="Cancel"
          @click="cancelComment()"
        />
        <q-btn
          class="button"
          :data-cy="'deletecomment'"
          unelevated
          rounded
          style="width:70px;border-radius:2px"
          label="Delete"
          @click="deleteComment(int_comment_shell)"
        />
      </q-card-section>
    </q-card>
    <div style="text-align:center;padding-top:10px">
      <div
        class="col"
        style="display:inline-block;padding-right:20px;padding-left:20px"
      >
        <q-input
          style="border-radius:10px; width:590px;font-size:18px"
          dense
          items-center
          filled
          v-model="search"
          label="Search"
        >
          <template v-slot:append>
            <q-avatar>
              <q-icon name="search" />
            </q-avatar>
          </template>
        </q-input>
      </div>
    </div>

    <div style="text-align:center;">
      <q-list style="display:inline-block;width:750px">
        <Process
          v-for="process in filteredProcesses"
          ref="process"
          :process="process"
          :key="process.id"
          :Title="showProcessLabel(process)"
          :processTopics="topics"
          :processUsers="users"
          :Topics="process.processTopics"
          :Users="process.applicableUsers"
          :Link="process.id"
          :selectedProcess="selectedGraph"
          :mermaid="mermaid"
          Path="guided_process_editor"
          @remove="deleteProcess"
          @comment="editComment"
          @selectGraph="show"
        >
        </Process>
      </q-list>
    </div>
  </div>
</template>


<script>
import Process from '../components/guided_process_editor/Process'
import TranslateStateButton from '../components/shared/translatestatebutton/TranslateStateButton'
import storeMappingMixin from '../mixin/storeMappingMixin'

import editEntityMixin from '../mixin/editEntityMixin'
import { mapGetters, mapActions } from "vuex";
export default {
  name: 'ProcessList',
  props: {
    msg: String
  },
  mixins: [storeMappingMixin({
    getters: {
      processes: 'flows/processes',
      comments: 'comments/comments',
      topics: 'topic/topic',
      users: 'user_type/user',
      graphList: 'flows/graphList'
    }, actions: {
      fetchGraph: 'flows/fetchGraph',
      fetchCommentsByTenant: 'comments/fetchCommentsByTenant',
      saveComments: 'comments/saveComments',
      editComments: 'comments/editComments',
      deleteComments: 'comments/deleteComments',
      fetchFlows: 'flows/fetchFlows',
       fetchTopic: 'topic/fetchTopic',
      fetchUserType: 'user_type/fetchUserType'
    }
  }),
    editEntityMixin],
  components: {
    Process, TranslateStateButton
  },
  data () {
    return {
      graphs:[],
      mermaid:[],
      selectedGraph:null, 
      temp_tenant_id: 2,
      is_new: true,
      search: ' ',
      hideForm: true,
      translatedState: 1,
      int_comment_shell: { id: -1, idProcess: -1, translations: [] },
      selectOptions: this.$translationStateOptions
    }
  },
  computed: {
    /*processes () {
     return this.$store.state.flows.flows
   }, */
    //   ...mapGetters("flows", ["processes"]),
    //   ...mapGetters("comments", ["comments"]),
    filteredProcesses () {
      //if none of the fields is filled in it will give the full list of processes
      if (this.search == "") {
        return this.processes
      }
      else {
        /* THIS IS THE LOGIC FOR THE LINK TO THE BACKEND */
        return this.processes.filter((a_process) => {
          console.log("active language")
          console.log(this.activeLanguage)
          var curlangproc = a_process.translations.filter((transl) => { return transl.lang == this.activeLanguage })[0]
          console.log("this is curlangproc")
          console.log(curlangproc)
          //Splits the search field and puts the words in an array
          var searchArray = this.search.split(" ")
          if (searchArray.every(string => curlangproc.process.toLowerCase().includes(string))) {
            return true;
          }
        })
      }
    },
    /*comments(){
      return this.$store.state.comments.comments
    }*/
  },
  methods: {
    show(id){
      if(this.selectedGraph == id){
        this.selectedGraph = null
      }
      else{
        console.log("i am th egraph list")
        console.log(this.graphList)
       var the_graph =  this.graphList.filter((graph)=>{
         console.log(graph)
          return graph.id == id
        })[0]
        console.log(the_graph)
        this.mermaid = the_graph.graph
        this.$store.commit("flows/setNodePanelVisible", "hidden");
        console.log(this.selectedGraph)
      console.log(id)
      console.log("in show")
      this.selectedGraph = id
      }
      
    },
    /*
    ...mapActions("comments", [
      "fetchCommentsByTenant",
      "saveComments",
      "editComments",
      "deleteComments",
    ]),
    ...mapActions("flows", [
      "fetchFlows"
    ]),
    */
    showProcessLabel (workingProcess) {
      return workingProcess.translations.filter(this.filterTranslationModel(this.activeLanguage))[0].process
    },
    deleteProcess (value) {
      var deletedProcess = this.processes.filter((filt) => {
        console.log("in fil")
        console.log(filt)
        return filt.id == value
      })
      this.$store.commit('flows/deleteProcess', deletedProcess[0])
    },
    saveComment (int_comment_shell) {
      var the_process = this.processes.filter((a_process) => {
        return a_process.id == int_comment_shell.idProcess
      })[0]
      console.log("i am the process")
      console.log(the_process)
      var payload = { comment: this.int_comment_shell, process: the_process }
      if (this.is_new) {
        //this.$store.dispatch('comments/saveComments', {comment : this.int_comment_shell, process: the_process})
        this.saveComments(payload)
        this.hideForm = true
        this.createShell()
        for (var i = 0; i < this.$refs.process.length; i++) {
          this.$refs.process[i].restore()
        }
      }
      else {
        this.editComments(payload)
        //this.$store.dispatch('comments/editComments',  {comment : this.int_comment_shell, process: the_process})
        console.log("EDITED")
        console.log(this.$store.comments)
        this.hideForm = true
        for (var i = 0; i < this.$refs.process.length; i++) {
          this.$refs.process[i].restore()
        }
        this.createShell()
      }
    },
    cancelComment () {
      this.createShell()
      this.hideForm = true
      for (var i = 0; i < this.$refs.process.length; i++) {
        this.$refs.process[i].restore()
      }
    },
    deleteComment (comment) {
      this.deleteComments(comment.id)
      //this.$store.dispatch('comments/deleteComments', comment.id)
      this.hideForm = true
      for (var i = 0; i < this.$refs.process.length; i++) {
        this.$refs.process[i].restore()
      }
    },
    editComment (value) {
      /*THIS IS THE VERSION OF EDIT THAT WORKS WITH THE BACKEND*/
      console.log("these are the tenant specific comments")
      console.log(this.comments)
      var process_comments = []
      var current_comment = null
      if (value.comments != null) {
        value.comments.forEach((comment) => {
          process_comments.push(comment.idcomment)
        })
      }
      for (var i = 0; i < process_comments.length; i++) {
        var the_comment = this.comments.filter((com) => {
          //console.log(com.id)
          //console.log(process_comments[i])
          return com.id == process_comments[i]
        })[0]
        if (the_comment != null) {
          current_comment = the_comment
          break;
        }
      }
      console.log(current_comment)
      console.log("I AM THE COMMENT")
      console.log(current_comment)
      if (current_comment == null) {
        console.log("inside if")
        this.is_new = true
        this.createShell()
        this.int_comment_shell.idProcess = value.id
        for (var i = 0; i < this.$refs.process.length; i++) {
          this.$refs.process[i].hide()
        }
        this.hideForm = false
      }
      else {
        console.log("inside else")
        this.is_new = false
        this.mergeProcess(current_comment)
        console.log(current_comment)
        console.log(value)
        for (var i = 0; i < this.$refs.process.length; i++) {
          this.$refs.process[i].hide()
        }
        console.log(this.$refs.process)
        //this.$refs.process.restore()
        this.hideForm = false
      }
    },
    createShell () {
      this.int_comment_shell = { id: -1, idProcess: -1, translations: [], tenantId: this.temp_tenant_id }
      this.languages.forEach(l => {
        this.int_comment_shell.translations.push({ id: -1, lang: l.lang, comment: '', translationDate: null, translationState: 0 })
      });
    },
    mergeProcess (comment) {
      console.log("MERGING")
      console.log(process)
      this.int_comment_shell.id = comment.id
      this.int_comment_shell.idProcess = comment.idProcess
      this.int_comment_shell.tenantId = comment.tenantId
      //this.edit_process.applicableUsers = process.applicableUsers
      //    this.edit_process.processTopics = process.processTopics
      comment.translations.forEach(pr => {
        console.log(pr)
        //    this.int_topic_shell.translations.filter(function(sh){return sh.lang == tr.lang})
        for (var i = 0; i < this.int_comment_shell.translations.length; i++) {
          if (this.int_comment_shell.translations[i].lang == pr.lang) {
            this.int_comment_shell.translations.splice(i, 1);
            this.int_comment_shell.translations.push(JSON.parse(JSON.stringify(pr)))
            break;
          }
        }
      });

    },
    test (id) {
      console.log("received also mocado-change")
      console.log(id)
      this.changeTranslationState(this.int_comment_shell, id.state)
    },
    test2 (id) {
      console.log("received also return to edit")
      console.log(id)
      this.changeTranslationState(this.int_comment_shell, id.state)
    },
    changeTranslationState (element, state) {
      console.log(element)
      element.translations.forEach(el => {
        el.translationState = state
      })
      console.log(element)
    }
  },
  created () {
    this.createShell()
    this.loading = true
    console.log(this.$store);
    //this.$store.dispatch('flows/fetchFlows')
    this.fetchFlows()
      .then(processes => {
        var promiseGraph=[]
        console.log(processes)
        processes.forEach((process)=>{
          this.fetchGraph({ id: process.id, userLang: this.$userLang }).then(graph =>{
            this.graphs.push({id: process.id, graph: graph})
          })
          
        })
        this.$store.commit("flows/setGraphs", this.graphs);
         /* Promise.all(promiseGraph).then(graph => {
        console.log(graph)
        this.graphs = graph
        this.$store.commit("flows/setGraphs", this.graphs);
        
      })*/

        })
      
    //this.$store.dispatch('comments/fetchCommentsByTenant', this.temp_tenant_id)
    this.fetchCommentsByTenant(this.temp_tenant_id)
      .then(comments => {
        this.loading = false
      })
      this.fetchTopic({ defaultLang: this.$defaultLang, userLang: this.$userLang })  
    this.fetchUserType({ defaultLang: this.$defaultLang, userLang: this.$userLang })
    .then(user_types =>{
      console.log("in user type")
      console.log(user_types)
    })
    console.log("logged in")
     console.log(this.$auth.loggedIn())
         console.log(this.$auth.user())

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  padding-top: 50px;
  padding-right: 80px;
  padding-bottom: 50px;
  padding-left: 80px;
}
</style>
© 2020 GitHub, Inc.
Terms
Privacy
Security
Status
Help
Contact GitHub
Pricing
API
Training
Blog
About
