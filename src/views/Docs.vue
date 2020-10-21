<template>
  <div>
    <MarkdownViewer
      sourcePackageName="gitbook-test"
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
      return this.$route.params.docPath;
    },
    docName() {
      return this.$route.params.docName;
    }
  }
}
</script>

<style>

</style>