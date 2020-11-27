<template>
  <div>
    <MarkdownViewer
      :docPath="docPath"
      :docName="docName"
    ></MarkdownViewer>
  </div>
</template>

<script>
import MarkdownViewer from "@/components/MarkdownViewer.vue"
export default {
  components: {
    MarkdownViewer
  },
  data() {
    return {
      docHash: '',
    };
  },
  computed: {
    docPath() {
      return this.$route.params.pathToDoc;
    },
    docName() {
      return this.$route.params.docName;
    },
  },
  watch: {
    '$route.hash': {
      handler(docHash) {
        this.docHash = docHash;
        this.postMessage();
      },
      immediate: true,
    }
  },
  methods: {
    postMessage() {
      window.parent.postMessage(JSON.stringify({
        docName: this.docName,
        docPath: this.docPath,
        docHash: this.docHash,
        type: 'gitbook-mardown-viewer-data-transfer',
      }), '*');
    },
  },
  mounted() {
    this.postMessage();
  }
}
</script>

<style>

</style>