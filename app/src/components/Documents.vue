/**
 * Renders a list of documents with their title, emitter, and expiration date. Also includes a button to open a thumbnail modal or a dashboard container for uploading new documents.
 *
 * The component uses the Uppy library for file uploads, with restrictions on file size and type.
 *
 * @component
 * @prop {String} msg - A message to be displayed.
 * @data {Object} files - An object to store the uploaded files.
 * @data {Object} mainProps - An object with properties for the image component.
 * @computed {String} uppyId - A unique identifier for the Uppy instance.
 * @computed {Array} documents - An array of document objects fetched from the Vuex store.
 * @lifecycle created - Fetches the documents from the Vuex store.
 * @lifecycle mounted - Initializes the Uppy instance with the appropriate configuration.
 */
<template>
  <div class="documents">
    <q-list>
      <q-item v-for="doc in documents"
        >{{ doc.title
        }}<a
          ><b-img
            v-bind="mainProps"
            right
            rounded
            src="https://picsum.photos/125/125/?image=58"
            alt="Left image"
          ></b-img></a
        ><br />Emitted by:{{ doc.emitter }} - lasting up to:
        {{ doc.expire_date }}</q-item
      >
    </q-list>
    Upload new documents

    <div class="ThumbnailContainer" v-if="collection === 'thumbnail'">
      <button id="open-thumbnail-modal" class="button">Select file</button>
    </div>
    <div id="DashboardContainer" v-else></div>
  </div>
</template>

<script>
import Uppy from '@uppy/core'
import Dashboard from '@uppy/dashboard'
import XHRUpload from '@uppy/xhr-upload'
import Tus from '@uppy/tus'

//const Uppy = require('@uppy/core');
//const Dashboard = require('@uppy/dashboard');
//const XHRUpload = require('@uppy/xhr-upload');
//const Tus = require('@uppy/tus')

export default {
  name: 'Documents',
  props: {
    msg: String
  },
  data() {
      return {
      files: {},
      mainProps: { width: 50, height: 50, class: 'm1' }
      }
    },
  computed: {
  uppyId() {
    return `${this.modelId}-${this.collection}`;
  },
    documents() {
      return this.$store.state.documents.documents
    }
  },
  created () {
    this.loading = true
    console.log(this.$store);
    this.$store.dispatch('documents/fetchDocuments')
      .then(documents => {
        this.loading = false
      })
  },
  mounted() {
    const uppy = Uppy({
      id: this.uppyId,
      autoProceed: false,
      debug: true,
      thumbnailGeneration: true,
      restrictions: {
        maxFileSize: false,
        allowedFileTypes: ['image/*', 'application/pdf'],
      },
      meta: {
        modelId: this.modelId,
        collection: this.collection,
      },
      onBeforeFileAdded: () => {
        Promise.resolve();
      },
      onBeforeUpload: (files) => {
        this.files = files;
        Promise.resolve();
      },
    });
    if (this.collection === 'thumbnail') {
      uppy.use(Dashboard, {
        trigger: '#open-thumbnail-modal',
        metaFields: [
          { id: 'owner', name: 'Owner', placeholder: 'name of the photographer/owner' },
          { id: 'caption', name: 'Caption', placeholder: 'describe what the image is about' },
          { id: 'order', name: 'Order', placeholder: 'order' },
        ],
      });
    } else {
      uppy.use(Dashboard, {
        inline: true,
        target: '#DashboardContainer',
        replaceTargetContent: true,
        note: 'Images and PDF only.',
        maxHeight: 500,
        metaFields: [
          { id: 'owner', name: 'Owner', placeholder: 'name of the photographer/owner' },
          { id: 'caption', name: 'Caption', placeholder: 'describe what the image is about' },
          { id: 'order', name: 'Order', placeholder: 'order' },
        ],
      });
    }
    uppy.use(Tus, {
      endpoint: 'http://localhost:8081/upload', // use your tus endpoint here
      resume: true,
      autoRetry: true,
      retryDelays: [0, 1000, 3000, 5000]
    })
    /*
    uppy.use(XHRUpload, {
      endpoint: this.endpoint,
      headers: {
        'X-CSRF-TOKEN': window.csrfToken,
      },
    });
    // uppy.on('upload-success', (fileId, resp, uploadURL) => {
    //   debugger;
    //   console.log(uploadURL)
    //   var img = new Image()
    //   img.width = 300
    //   img.alt = fileId
    //   img.src = uploadURL
    //   document.body.appendChild(img)
    // });
    */
    uppy.run();
  },
  methods: {},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="uppy/dist/uppy.css"></style>
