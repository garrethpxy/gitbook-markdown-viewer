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
  }
}
</script>

<style>

</style>