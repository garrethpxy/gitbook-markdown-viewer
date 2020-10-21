<template>
  <div class="docs">
    <div class="flex">
      <div class="sidebar">
        <SummaryContent></SummaryContent>
      </div>
      <div class="main-content-area markdown-body">
        <MainContent></MainContent>
      </div>
      <div v-if="headers" class="header-links sidebar">
        <ul>
          <li v-for="(header, index) in headers" :key="index">
          <a :href="header.link.hash">{{header.text}}</a>
        </li>
        </ul>
      </div>
    </div>
  </div>
</template>


<script>
import SummaryContent from "gitbook-test/SUMMARY.md"
import MainContent from "gitbook-test/README.md"
import 'github-markdown-css/github-markdown.css'
import _ from 'lodash'

export default {
  props: {
    sourcePackageName: {
      type: String,
      required: true
    },
    docPath: {
      type: String
    },
    docName: {
      type: String
    }
  },
  components: {
    SummaryContent,
    MainContent
  },
  data(){
    return {
      headers: [],
      currentContentPath: "",
    }
  },
  mounted(){
    console.log(this.docPath)
    this.$nextTick(() => {
      let headerLinks = document.querySelectorAll(".header-anchor");
      this.headers = _.map(headerLinks, link => {
        return {
          link,
          text: link.parentNode.textContent
        }
      })
      console.log(this.headers);
    })
  }
}

</script>

<style lang="scss">

.flex {
  display: flex;
  justify-content: center;
}

.sidebar {
  width: 300px;
  margin-right: 50px;
  text-align: left;

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  &.header-links {
    margin-left: 80px;

    li {
      padding: 5px 0;
      border-bottom: 1px dashed rgb(226, 232, 240);
    }

    a {
      color: rgb(74, 85, 104);
      display: block;
      padding: 5px 0;
      font-weight: bold;
      text-decoration: none;
      font-size: 14px;
    }
  }
}

.main-content-area {
  width: 800px;
  text-align: left;
}


</style>