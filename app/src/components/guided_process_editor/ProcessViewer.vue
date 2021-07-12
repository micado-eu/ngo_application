  <template>
  <div>
    <span v-if="loading">&nbsp;</span>
    <div
      v-else
      class="container"
    >
    <div class="title">
     {{this.the_process}}
    </div>
      <!--<div class="row pad" >
              <q-img
                class="image"
                v-for="tag in full_process.topics"
                :src="topics.filter(topic => topic.id == tag)[0].icon"
                :key="'topic'.concat(tag)"
              >
              </q-img>
               <q-img
                class="image"
                v-for="tag in full_process.users"
                :src="users.filter(user => user.id == tag)[0].icon"
                :key="tag"
              >
               </q-img>
    </div>-->
      <hr style="border: 1px solid #FF7C44;">
      <div
        class="q-pa-lg"
        style="text-align: justify;text-justify: inter-word"
      >
        <glossary-editor-viewer
          :content="the_process_description"
          :key="the_process_description"
        />
      </div>
      <div class="row">
        <div class="col">
          <q-scroll-area
            vertical
            id="scroll"
            class="bg-grey-1"
          >
            <vue-mermaid
              class="center"
              :nodes="mermaid"
              :config="merconf"
              type="graph TD"
              v-on:nodeClick="editNodeMer"
            ></vue-mermaid>
          </q-scroll-area>
        </div>
      </div>

      <div
        :class="nodePanelVisible"
        header="Details of the step1"
      >
        <!-- <h5
      :class="nodePanelVisible"
      class="header"
    >{{this.shell_data.text}}</h5>
    <hr>-->
        <div
          v-if="flowData.url !=null"
          style="text-align:center; padding-top:10px"
        >
          <a
            :href="'//' + flowData.url"
            target="_blank"
            style="text-decoration:none;"
          >
            <q-btn
              class="negative-button"
              no-caps
              rounded
              color="info"
              :label="$t('button.procedure')"
            />
          </a>
        </div>
        <!--<q-field
        class="header-title"
        color="purple-12"
        
        stack-label
      >
       <template v-slot:control>
          <div
            class="self-center full-width no-outline step-title"
            tabindex="0"
          >{{shell_data.text}}</div>
        </template>
    </q-field>-->
        <div class="q-pa-md fields-container">
          <div class="field">
            <p class="title" style="text-align:left">
           {{shell_data.text}}
            </p>
            <!--<p class="textup">{{$t('desc_labels.document_type')}}:</p>-->
            <hr>
          </div>

          <div class="q-pa-md field custom-pad">
            <p class="textup">
            {{$t('input_labels.description')}}
            </p>
            <GlossaryEditorViewer
              class="textdown"
              :content="shell_data.description"
              :key="shell_data.description"
            ></GlossaryEditorViewer>
            <hr>
          </div>
          <div class="q-pa-md field custom-pad">
            <p class="textup">
            {{$t('input_labels.cost')}}
            </p>
            <p class="textdown">{{this.flowData.cost}}</p>
            <hr>
          </div>
          <div class="q-pa-md field custom-pad">
            <p class="textup">
            {{$t('input_labels.location')}}
            </p>
            <p
              class="textdown"
              tabindex="0"
            ><a :href="gmap_location"> {{flowData.location}} </a></p>
            <hr>
          </div>
          <div class="q-pa-md field custom-pad">
            <p class="textup">
            {{$t('input_labels.required_documents')}}
            </p>
            <q-list style=" padding-left:15px">
              <!--<q-item-label header>{{$t('desc_labels.required_documents')}}</q-item-label>-->
              <DocumentItem
                v-for="doc in documents"
                :theDoc="doc"
                :key="doc.id"
                :slide="slide"
                :data="hotspot_data"
                :options="pic_options"
                :pictures="doc.pictures"
                @showdoc="showDocument(doc.id)"
                @transition="changeHotspot"
                @clean="clean"
                @showpicture="showPictures(doc.id)"
              >
              </DocumentItem>
            </q-list>
            <hr>
          </div>
        </div>
      </div>
      <div class="q-pa-md fields-container">
        <div class="q-pa-md field custom-pad">
          <p class="textup">
         {{$t('input_labels.click_step')}}
          </p>
          <hr>
        </div>
        <div class=" q-pa-md  row field  custom-pad">
          <div class="col-11 topic">
            {{$t('filters.topics_title')}}:
            <q-img
              class="image"
              v-for="tag in full_process.processTopics"
              :src="topics.filter(topic => topic.id == tag.idTopic)[0].icon"
              :key="'topic'.concat(tag.idTopic)"
            >
            </q-img>
          </div>

        </div>
        <div class="q-pa-md field custom-pad">
          <hr>
          <CommentList :selected_process_comments="selected_process_comments" />
          <hr>
        </div>

      </div>
    </div>
  </div>
</template>


<script>
const DocumentItem = () => import('components/DocumentItem')
import storeMappingMixin from '../../mixin/storeMappingMixin'
import editEntityMixin from '../../mixin/editEntityMixin'
const CommentList = () => import('components/CommentList')
const GlossaryEditorViewer = () => import("components/GlossaryEditorViewer")




export default {
  name: 'ProcessViewer',
  mixins: [editEntityMixin,
    storeMappingMixin({
      getters: {
        processes: 'flows/processes',
        processById: 'flows/processById',
        flowData: 'flows/flowData',
        shell_data: 'flows/shell_data',
        documents: 'flows/documents',
        nodePanelVisible: 'flows/nodePanelVisible',
        process_comments: 'comments/process_comments',
        comments: 'comments/comments',
        document_types: 'document_type/document_types',
        flows: 'flows/processes',
        //topics: 'topic/topics',
        //users: 'user_type/users',
        //my_documents: 'documents/my_documents',
        hotspots: 'picture_hotspots/hotspots'
      }, actions: {
        fetchGraph: 'flows/fetchGraph',
        fetchCommentsByProcess: 'comments/fetchCommentsByProcess',
        fetchComments: 'comments/fetchComments',
        fetchDocumentType: 'document_type/fetchDocumentType',
        //fetchTopic: 'topic/fetchTopic',
        //fetchUserType: 'user_type/fetchUserType',
        fetchFlows: 'flows/fetchFlows',
        //fetchDocuments: 'documents/fetchDocuments',
        fetchDocumentTypePicturesById: 'picture_hotspots/fetchHotspotsByIdGraph'

      }
    })
  ],
  props: ['processid', 'url', 'topics'],
  components: {
    DocumentItem,CommentList, GlossaryEditorViewer
  },
  data () {
    return {
      loading: true,
      details: false,
      id: this.$route.params.id,
      merconf: { theme: "default", startOnLoad: false, securityLevel: 'loose', useMaxWidth: false, flowchart: { padding: 5 } },
      mermaid: [],
      the_process: null,
      the_process_description: null,
      selected_process_comments: [],
      pictures: [],
      full_process: null,
      pic_options: [],
      slide: null,
      hotspot_data: [],
      focused_step: null,
      user_list: [],
      topic_list: []
    }
  },
  computed: {
    process_comments_computed () {
      //console.log(this.$store.state.comments.process_comments)
      //return this.$store.state.comments.process_comments
      console.log("inside computed")
      console.log(this.process_comments)
      return this.process_comments
    },
    sortedUsers () {
      this.user_list = JSON.parse(JSON.stringify(this.full_process.users))
      return this.user_list.sort()
    },
    sortedTopics () {
      this.topic_list = JSON.parse(JSON.stringify(this.full_process.topics))
      return this.topic_list.sort()
    },
    gmap_location () {
      return "https://www.google.com/maps/search/?api=1&query=" + this.flowData.location
    }
  },
  methods: {
    back () {
      /*console.log(this.url)
      var back_url = JSON.parse(this.url)
      if(this.url.length == 1){
        this.$router.push({
         name: 'home',

      })
      }
      else{
        this.$router.push({
         name: 'crumbs',
        params: {
        topicFilter: this.url
        }
      })
      }*/
      this.$router.go(-1);
    },
    stripHtml (html) {
      let tmp = document.createElement("DIV");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    },
    clean () {
      console.log("in clean")
      this.pic_options = []
      this.hotspot_data = []

      console.log(this.hotspot_data)
    },
    changeHotspot (value) {


      console.log(value)
      this.hotspot_data = []
      console.log("I TRANSITIONED ON HE OTHER PAGE")
      this.fetchDocumentTypePicturesById({ id: value.pic_id, defaultLang: this.$defaultLang, currentLang: this.$userLang }).then(() => {
        this.hotspots.forEach((spot) => {
          this.hotspot_data.push(
            {
              Message: spot.message,
              Title: spot.title,
              x: spot.x,
              y: spot.y

            }
          )
        })
        console.log("i am hotpots for this pic")
        console.log(this.hotspot_data)

      })


    },
    showPictures (value) {

      console.log("in show")

      console.log(this.hotspot_data)
      var pics = this.document_types.filter((a_pic) => {
        console.log(a_pic.id)
        console.log(value)
        console.log(a_pic.id == value)
        return a_pic.id == value
      })[0]
      console.log(pics)
      console.log("this is the pic id i'm sending")
      console.log(pics.pictures[0].id)
      console.log(this.$defaultLang)
      console.log(this.$activeLanguage)
      this.fetchDocumentTypePicturesById({ id: pics.pictures[0].id, defaultLang: this.$defaultLang, currentLang: this.$userLang }).then(() => {
        this.hotspots.forEach((spot) => {
          this.hotspot_data.push(
            {
              Message: spot.message,
              Title: spot.title,
              x: spot.x,
              y: spot.y

            }
          )
        })
        console.log("i am hotpots for this pic")
        console.log(this.hotspot_data)
        console.log(pics)
        for (var i = 0; i < pics.pictures.length; i++) {
          this.pic_options.push({ label: i + 1, value: pics.pictures[i].id })
        }
      })


    },
    showDocument (docid) {
      var userId = this.$store.state.auth.user.umid
      var user_docs = this.my_documents.filter((my_doc) => {
        return my_doc.userId == userId
      })

      var the_doc = user_docs.filter((doc) => {
        return doc.documentTypeId == docid
      })[0]

      this.$router.push({ name: 'viewdocument', params: { thedocid: the_doc.id } })


    },
    checkWallet (docid) {
      if (this.$auth.loggedIn()) {
        var userId = this.$store.state.auth.user.umid

        var user_docs = this.my_documents.filter((my_doc) => {
          return my_doc.userId == userId
        })

        var the_doc = user_docs.filter((doc) => {
          return doc.documentTypeId == docid
        })

        if (the_doc.length != 0) {
          return true
        }
        else {
          return false
        }

      }
      else {
        return false
      }
    },

    editNodeMer (nodeId) {
      console.log(nodeId)
      if(nodeId[0]== 'm'){
        var new_nodeId = nodeId.substring(15)
      }
      else{
        var new_nodeId = nodeId
      }
      const arr1 = this.mermaid.filter(d => d.id == new_nodeId)
      console.log("I am flow data")
      arr1[0].data.documents.forEach((doc) => {
        for (var i = 0; i < this.document_types.length; i++) {
          if (this.document_types[i].pictures != null) {
            for (var j = 0; j < this.document_types[i].pictures.length; j++) {
              if (doc.id == this.document_types[i].pictures[j].documentTypeId) {
                if (doc.pictures == null) {
                  doc.pictures = [this.document_types[i].pictures[j]]
                }
                else {
                  doc.pictures.push(this.document_types[i].pictures[j])
                }
              }
            }
          }
        }
      })
      console.log(arr1[0].data);
      if (this.focused_step == new_nodeId) {
        this.$store.commit("flows/setNodePanelVisible", "hidden");
        this.focused_step = null
      }
      else {
        this.$store.commit("flows/setNodePanelVisible", "");
        this.focused_step = new_nodeId
      }

      this.$store.commit("flows/setDocuments", arr1[0].data.documents);
      this.$store.commit("flows/setFlowData", arr1[0].data);
      this.$store.commit("flows/setShellData", arr1[0]);
      console.log("I am the documents")
      console.log(this.documents)
    },

    showStep (event, node) {
      console.log(node)
      if (node.group == "nodes") {
        console.log("editing")
        this.details = true
        console.log("I'm old")
        this.step = JSON.parse(JSON.stringify(node))
        console.log(this.step)
      }
    },
    initialize () {
      this.loading = true
      this.$q.loading.show({
        message: this.$t('input_labels.loading')
      })
      var prom1 = []
      var prom2 = []
      var prom3 = []
      var prom4 = []
      var prom5 = []
      var prom6 = []
      var prom7 = []
      var prom8 = []
      if (this.flows.length > 0) {
        console.log("inside if")
        try {
          this.full_process = this.processById(this.processid)
        } catch (err) {
          if (err === "Not found") {
              // Route doesn't exist in router so it will redirect to 404
            } else throw err
        }
        console.log("I am full process")
        console.log(this.full_process)
        this.the_process = this.full_process.translations.filter(this.filterTranslationModel(this.$userLang))[0].process
        console.log("I am full process description")
        console.log(this.full_process.description)
        this.the_process_description = this.full_process.translations.filter(this.filterTranslationModel(this.$userLang))[0].description
        console.log("I AM THE_PROCESS DESC")
        console.log(this.the_process_description)
      }
      else {
        console.log("inside else")
        prom1.push(this.fetchFlows({ defaultLang: this.$defaultLang, userLang: this.$userLang }))
        Promise.all(prom1).then((process) => {
          console.log("I a flows")
          console.log(this.flows)
          try {
            this.full_process = this.processById(this.processid)
          } catch (err) {
            if (err === "Not found") {
                // Route doesn't exist in router so it will redirect to 404
                this.$router.push('/404')
              } else throw err
          }
          console.log("I am full process")
          console.log(this.full_process)
          this.the_process = this.full_process.process
          this.the_process_description = this.full_process.description

        })
      }


      console.log("I am return from prom1")

      prom2.push(this.fetchGraph({ id: this.processid, userLang: this.$userLang }))
      Promise.all(prom2).then(graph => {
        console.log(graph)
        const elementFlow = graph[0]
        console.log("i am element flow")
        console.log(elementFlow)
        this.mermaid = elementFlow
        this.$store.commit("flows/setNodePanelVisible", "hidden");
        //return this.the_process
        prom3.push(this.fetchDocumentType())
        Promise.all(prom3).then(() => {
          prom4.push(this.fetchComments())
          Promise.all(prom4).then((comment_list) => {
            console.log("I am comment list")
            console.log(comment_list)
            prom5.push(this.fetchCommentsByProcess(this.processid))
            Promise.all(prom5).then((the_comments) => {
              console.log(this.$store.state.comments.process_comments)
              console.log("comments associated to the process")
              console.log(the_comments)
              console.log(this.process_comments)
              if(the_comments[0].length >0){
                the_comments[0].forEach((comment) => {
                console.log("INSIDE FOREACH")
                console.log(comment)
                for (var i = 0; i < this.comments.length; i++) {
                  console.log("INSIDE FOR")
                  if (comment.idcomment == this.comments[i].id) {
                    console.log("INSIDE IF")
                    console.log(this.comments[i])
                    this.selected_process_comments.push(this.comments[i])

                       /* prom8.push(this.fetchDocuments())
                        Promise.all(prom8).then(() => {
                          //console.log(process[0])
                          //this.full_process = process[0]
                          console.log("i am full process")
                          console.log(this.full_process)
                          console.log(this.process_comments)
                          console.log(this.loading)
                          console.log("loading the page")

                        })*/
                      
                    
                  }
                  else {
                    console.log("loading the page")
                    this.$q.loading.hide()
                    this.loading = false

                  }
                }
                this.$q.loading.hide()
                      this.loading = false

              })
              }
              else{
                this.$q.loading.hide()
                this.loading = false
              }
console.log("I AM TOPICS")
console.log(this.topics)
            })
          })

        })
      })


      console.log(this);
      console.log(this.$Countly);
      this.$Countly.q.push(['add_event', {
        "key": "process",
        "count": 1,
        "sum": 1,
        "dur": 1,
        "segmentation": {
          "idprocess": this.id,
          "nationality": "italian",
          "language": this.$userLang
        }
      }]);
      /* this.full_process = this.processes.filter((process) =>{
         return process.id == this.processid
       })[0]*/


      // TODO





      console.log(this.$auth.loggedIn())
    }
  },


  created () {
    this.initialize()
  },
  watch: {
    '$route.params.processid': function (processid) {
      this.initialize()
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
.banner {
  font-style: normal;
  height: 72px;
  text-align: center;
  padding-top: 15px;
  font-weight: bold;
  font-size: 22px;
  line-height: 41px;
  color: white;
  background-color: #ff7c44;
}
canvas {
  margin-left: -300px;
  background-color: blue;
}
g.label {
  font-size: 10px;
}
#scroll {
  height: 250px;
  margin-top: 25px;
}
.header {
  font-weight: 400;
  font-size: 12px;
  padding-left: 30px;
  padding-right: 30px;
}
.button {
  width: 130px;
  margin-top: 20px;
}
.button-div {
  padding-top: 0px;
  padding-bottom: 0px;
  text-align: center;
}
.image {
  max-height: 25px;
  max-width: 25px;
  margin-right: 5px;
  margin-left: 5px;
}
.title {
  margin-bottom: 5px;
  font-weight: 700;
  font-size: 18px;
  text-align: center;
  margin-top: 20px;
}
.toolbar-list {
  background-color: #ff7c44;
}
.pad {
  display: flex;
  justify-content: center;
  align-items: center;
}
.center {
  text-align: center;
}
.header-title {
  padding-left: 30px;
  padding-right: 30px;
}
.step-title {
  font-weight: 700;
  font-size: 16px;
}
.icon {
  width: 15px;
  height: 15px;
  margin-top: -22px;
}
.textup {
  font-family: Nunito;
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 16px;
  color: #000000;
  margin-bottom: 0px;
}
.textdown {
  font-family: Nunito Sans;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 16px;
  color: #000000;
  padding-left: 15px;
  padding-top: 10px;
}
.custom-pad {
  padding-top: 0px;
  padding-bottom: 0px;
}
.click-step {
  font-family: Nunito;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 16px;
  color: #000000;
}
.topic {
  font-family: Nunito;
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 16px;
  color: #000000;
}
.go_back {
  background-color: white;
  color: #0f3a5d;
  border: 1px solid #0f3a5d;
  border-radius: 50px;
}
</style>
