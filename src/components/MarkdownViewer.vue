<template>
  <div class="docs">
    <div class="flex">
      <div class="sidebar page-links">
        <div v-html="pageLinksHtml"></div>
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
const CONFIG = require('../../docs-config')

export default {
  props: {
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
      pageLinksHtml: ""
    }
  },
  computed: {
    headers() {
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(this.documentHtml, 'text/html');

      let headerLinks = htmlDoc.querySelectorAll(".header-anchor");
      return _.chain(headerLinks)
                .map(link => {
                    return {
                      link,
                      text: link.parentNode.textContent.replace("¶ ", "")
                    }
                }).filter(o => !!o.text).value()
    },
  },
  beforeMount () {
    const pathToCompiledDocs = `${process.env.BASE_URL}${CONFIG.TARGET_DOC_FOLDER}`;
    // retrieve the html data
    axios.get(`${pathToCompiledDocs}/${this.docPath}/${this.docName}.html`)
      .then(res => {
        this.documentHtml = res.data
      })

    axios.get(`${pathToCompiledDocs}/SUMMARY.html`)
      .then(res => {
        this.pageLinksHtml = res.data

        // if no active document is loaded, then load the first pageLink
        if (!this.docName) {
          console.info('path to document was invalid. loading first page...')

          const parser = new DOMParser();
          const htmlDoc = parser.parseFromString(this.pageLinksHtml, 'text/html');
          let pageLinks = htmlDoc.querySelectorAll("li a");

          console.log('routing to:',`${pageLinks[0].pathname}` );

          if(pageLinks.length) {
            // Simulate a click on the link rather than using vue-router
            // Reason: these links are constructed at build time and already have baseUrl embedded
            //  Since vue-router will append the baseUrl during programmatic routing,
            //  we will end up with a malformed URL with 2 baseUrls.
            window.location.href = `${pageLinks[0].pathname}`
          } else {
            console.log('no pages available for loading.')
          }
        }
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

.header-anchor {
  opacity: 0;
}

h1,h2,h3,h4,h5,h6 {
  position: relative;
  left: -20px;

  &:hover {
    .header-anchor {
      opacity: 1;
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