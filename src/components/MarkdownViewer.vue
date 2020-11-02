<template>
  <div class="docs">
    <div class="sticky-nav">
      <SearchBar></SearchBar>
    </div>
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
import SearchBar from './SearchBar.vue'

const CONFIG = require('../../docs-config')

export default {
  components: {
    SearchBar
  },
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
        // add a <br> for better readability
        this.documentHtml = res.data  + '<br /> <br />'

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

$topbarHeightOffset: 53px;

.flex {
  display: flex;
  justify-content: center;
}

.sidebar {
  width: 300px;
  text-align: left;

  .sidebar__header {
    left: 0;
    margin-top: 40px;
  }

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  &.header-links {
    padding-left: 30px;
    width: 300px;
    border-left: 1px solid #EEE;

    li {
      padding: 5px 0;
      border-top: 1px dashed rgb(226, 232, 240);

      &:first-of-type  {
        border-top: none;
      }

      &:last-of-type  {
        border-bottom: 1px dashed rgb(226, 232, 240);;
      }

      &.depth-2 {
        padding: 0px 15px 5px;
        border-top: none;
        a {font-weight: normal;}
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
  margin-top: $topbarHeightOffset;
  border-right: 1px solid #EEE;
  height: calc(100vh - #{$topbarHeightOffset});
  overflow-y: scroll;
  padding: 20px 10px;
  box-sizing: border-box;

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
  margin-top: $topbarHeightOffset;
  height: calc(100vh - #{$topbarHeightOffset});
  width: 1100px;
  text-align: left;
  overflow-y: scroll;

  .markdown-body {
    width: 800px;
    margin: 0 35px;
    position: relative;

    /* Force anchor tag jump offset */
    h1,h2,h3,h4 {
      padding-top: 20px;
    }
  }
}

.sticky {
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 0;
}

.sticky-nav {
  position: absolute;
  width: 100vw;
  z-index: 1000000;
  background: #FFF;
  border-bottom: 1px solid #EEE;
  padding: 10px;
}

@media only screen and (max-width: 1439px) {
  .sidebar {
    width: 30%;
  }
  .main-content-area {
    width: 70%;

    .sidebar {
      width: 30%
    }
  }
}


</style>