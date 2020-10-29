<template>
  <div class="docs">
    <div class="flex">
      <!-- Left Side Bar -->
      <div class="sidebar page-links">
        <div v-html="pageLinksHtml"></div>
      </div>

      <!-- Document Content Area -->
      <div ref="contentArea" class="flex main-content-area">
        <div v-html="documentHtml" class="markdown-body"></div>

        <!-- Right Side Bar -->
        <div v-if="headers.length" class="header-links sidebar sticky">
          <h4 class="sidebar__header">ON THIS PAGE</h4>
          <ul>
            <template v-for="(header, index) in headers">
              <li
                v-if="header.element !== 'H1'"
                :key="index"
                :class="{
                  'depth-1': header.element === 'H2',
                  'depth-2': header.element === 'H3',
                  'hidden': header.element === 'H4',
                }"
                >
                  <a
                    :key="index"
                    :href="header.link.hash">
                      {{header.text}}
                  </a>
              </li>
            </template>
          </ul>
        </div>
      </div>

    </div>
  </div>
</template>


<script>
import 'github-markdown-css/github-markdown.css'
import _ from 'lodash'
import axios from 'axios'
import Fuse from 'fuse.js'

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
      pageLinksHtml: "",
      allHeadersData: {},
      fuse: null
    }
  },
  computed: {
    /**
     * Parses the currently loaded HTML document and retrieve the header links
     * Displayed in the left sidebar
     */
    headers() {
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(this.documentHtml, 'text/html');

      let headerLinks = htmlDoc.querySelectorAll(".header-anchor");
      return _.chain(headerLinks)
                .map(link => {
                    return {
                      link,
                      text: link.parentNode.textContent.replace("¶ ", ""),
                      element: link.parentNode.nodeName
                    }
                    // drop headers with no text
                    //  possible if gitbook authors accidentally
                    //  leave empty header elements in the Wyziwig editor
                }).filter(o => !!o.text.trim()).value()
    },
    currentUrlHash() {
      return window.location.hash.replace("#","");
    }
  },
  beforeMount () {
    const pathToCompiledDocs = `${process.env.BASE_URL}${CONFIG.TARGET_DOC_FOLDER}`;

    /**
    * Load the HTML content as specified by the current window path
    */
    axios.get(`${pathToCompiledDocs}/${this.docPath}/${this.docName}.html`)
      .then(res => {
        this.documentHtml = "<br />" + res.data // add a br to the top of doc for better readability

        // programmatically jump to anchor because DOM may have not been
        // built when browser's inbuilt anchor jumping was triggered
        this.$nextTick(() => {
          this.jumpToAnchor();
        })
      })

   /**
    * Load the left-sidebar main Page Links content, found in SUMMARY.md
    */
    axios.get(`${pathToCompiledDocs}/SUMMARY.html`)
      .then(res => {
        // Rewrite links and make them absolute so they are not affected by current window path
        // Reason:
        //  - we are using the browser's URL & history to navigate around the gitbook
        //  - when the browser navigates into nested pages, these relative links will break
        this.pageLinksHtml = res.data.replace(/(href=")(.*\.md")/g, `$1/$2`);

        // if no active document is loaded, then load the first pageLink
        if (!this.docName) {
          console.info('path to document was invalid. loading first page...')

          // parse the HTML up into a virtual dom and extract the page links
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
        } else {
          // if a document was loaded, then set the page link active style
          this.$nextTick(() => {
            this.setCurrentPageLinkAsActive();
          })
        }
      })

      // get search data for Fuse.js
      axios.get(`${process.env.BASE_URL}${CONFIG.HEADERS_LINKS_DATA_FILENAME}`)
      .then(res => {
        this.allHeadersData = res.data;

        const options = {
          includeScore: true,
          keys: ['headerText']
        }

        const fuse = new Fuse(this.allHeadersData, options);

        const result = fuse.search('intent');
        console.log('result',result);
      })
  },
  mounted(){
  },
  methods: {
    jumpToAnchor() {
      let id = this.currentUrlHash;
      if(id) {
        let top = document.getElementById(id).offsetTop; //Getting Y of target element
        console.log('scrolling to', top)
        this.$refs.contentArea.scrollTo(0, top);                        //Go there directly or some transition
      }
    },
    setCurrentPageLinkAsActive() {
      let pathName = window.location.pathname;
      let node = document.querySelectorAll(`[href="${pathName}"]`)[0];
      if (node) node.classList.add('active')
    }
  }
}

</script>

<style lang="scss">

$sidebarTopOffsetPx: 40px;

.flex {
  display: flex;
  justify-content: center;
}

.sidebar {
  width: 300px;
  margin-right: 50px;
  text-align: left;

  .sidebar__header {
    left: 0;
    margin-top: $sidebarTopOffsetPx + 20;
  }

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  &.header-links {
    margin-left: 30px;
    width: 300px;

    li {
      padding: 5px 0;
      border-bottom: 1px dashed rgb(226, 232, 240);

      &.depth-2 {
        padding-left: 15px;
        border-bottom: none;
      }
      &.hidden {
        display: none;
      }
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
  left: -20px;
  z-index: 10000000;
  opacity: 0;
  position: absolute;
}

h1,h2,h3,h4,h5,h6 {
  position: relative;

  &:hover {
    .header-anchor {
      opacity: 1;
    }
  }
}

.page-links {
  margin-top: $sidebarTopOffsetPx;

  h2 {
    padding: 10px 0 0 10px;
    font-size: 20px;
    font-weight: bold;
    color: #555;
  }

  ul {
    padding-left: 15px;
  }

  li {
    margin: 8px 0;
  }

  a {
    text-decoration: none;
    color: #555;

    &.active {
     font-weight: bold;
     color: #333;
    }
  }

  #table-of-contents {
    display: none;
   }
}

.main-content-area {
  width: 1100px;
  text-align: left;
  height: 100vh;
  overflow-y: scroll;

  .markdown-body {
    width: 800px;
    margin-left: 25px;
    position: relative;
  }
}

.sticky {
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 0;
}


</style>