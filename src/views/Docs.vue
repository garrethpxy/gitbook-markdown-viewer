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
  computed: {
    docPath() {
      console.log('doc path', this.$route.params.pathToDoc);
      return this.$route.params.pathToDoc;
    },
    docName() {
      console.log('doc name', this.$route.params.docName);
      return this.$route.params.docName;
    },
  },
  mounted() {
    window.parent.postMessage(JSON.stringify({
      docName: this.docName,
      docPath: this.docPath,
      type: 'gitbook-mardown-viewer-data-transfer',
    }), '*')
    console.log('posted')
  }
}
</script>

<style>

</style>