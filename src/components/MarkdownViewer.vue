<template>
  <div class="docs">
    <div class="flex">
      <div class="sidebar page-links">
        <div v-html="pageLinks"></div>
      </div>
      <div class="main-content-area markdown-body">
        <div v-html="documentHtml"></div>
      </div>
      <div v-if="headers" class="header-links sidebar">
        <h4>ON THIS PAGE</h4>
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
import 'github-markdown-css/github-markdown.css'
import _ from 'lodash'
import axios from 'axios'

export default {
  props: {
    sourcePackageName: {
      type: String,
      required: true
    },
    docPath: {
      type: String,
      default: ''
    },
    docName: {
      type: String,
      required: true
    }
  },
  data(){
    return {
      documentHtml: "",
      pageLinks: ""
    }
  },
  computed: {
    headers() {
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(this.documentHtml, 'text/html');

      let headerLinks = htmlDoc.querySelectorAll(".header-anchor");
      return _.map(headerLinks, link => {
        return {
          link,
          text: link.parentNode.textContent
        }
      })
    }
  },
  beforeMount () {
    // retrieve the html data
    axios.get(`/html-docs/${this.docPath}/${this.docName}.html`)
      .then(res => {
        this.documentHtml = res.data
      })

    axios.get(`/html-docs/SUMMARY.html`)
      .then(res => {
        this.pageLinks = res.data
      })
  },
  mounted(){
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

.page-links {
  #table-of-contents {
    font-size: 24px;
   }
}

.main-content-area {
  width: 800px;
  text-align: left;
}


</style>