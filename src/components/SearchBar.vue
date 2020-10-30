<template>
  <div class="search-bar-wrapper">
    <input type="text" v-model="searchTerm" placeholder="Search Documentation"/>
    <div class="search-results">
      <ul>
        <li v-for="(hit, index) in searchHits" :key="index">
          <a :href="hit.item.docPath + '' + hit.item.hash" @click="onClickHit">
            <b>{{hit.item.documentTitle}}</b>
            <svg width="1em" height="1em" viewBox="0 0 16 16" class="spacer-icon bi bi-chevron-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
            </svg>
             {{hit.item.headerText}}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Fuse from 'fuse.js'
const CONFIG = require('../../docs-config')

export default {
  data() {
    return {
      searchTerm: '',
      fuse: undefined,
    }
  },
  computed:{
    searchHits() {
      // return [{"item":{"hash":"#administrators","headerText":"Administrators","documentTitle":"Bot Management","elementType":"H3","docPath":"/essentials/bot-management.md"},"refIndex":33,"score":0.54},{"item":{"hash":"#libraries","headerText":"Libraries","documentTitle":"Bot Management","elementType":"H3","docPath":"/essentials/bot-management.md"},"refIndex":32,"score":0.55},{"item":{"hash":"#chat-analytics","headerText":"Chat Analytics","documentTitle":"Chat Analytics","elementType":"H1","docPath":"/essentials/chat-analytics.md"},"refIndex":56,"score":0.621229562710754},{"item":{"hash":"#chatbot-performance","headerText":"Chatbot Performance","documentTitle":"Chat Analytics","elementType":"H2","docPath":"/essentials/chat-analytics.md"},"refIndex":60,"score":0.621229562710754},{"item":{"hash":"#edit-user","headerText":"Edit User","documentTitle":"User & Roles Management","elementType":"H2","docPath":"/essentials/user-and-roles-management.md"},"refIndex":198,"score":0.621229562710754},{"item":{"hash":"#transitions-block","headerText":"Transitions Block","documentTitle":"Editing an Intent","elementType":"H4","docPath":"/essentials/intent-and-dialog-building/editing-an-intent.md"},"refIndex":152,"score":0.6468482211944342},{"item":{"hash":"#teaching-view","headerText":"Teaching View","documentTitle":"Libraries and Intent Management","elementType":"H2","docPath":"/essentials/libraries-and-intent-management.md"},"refIndex":183,"score":0.6468482211944342},{"item":{"hash":"#roles-and-access-rights","headerText":"Roles and Access Rights","documentTitle":"User & Roles Management","elementType":"H2","docPath":"/essentials/user-and-roles-management.md"},"refIndex":201,"score":0.6708203932499369},{"item":{"hash":"#avatar-visibility","headerText":"Avatar Visibility","documentTitle":"Bot Management","elementType":"H4","docPath":"/essentials/bot-management.md"},"refIndex":40,"score":0.672052998243801},{"item":{"hash":"#user-satisfaction","headerText":"User Satisfaction","documentTitle":"Chat Analytics","elementType":"H2","docPath":"/essentials/chat-analytics.md"},"refIndex":78,"score":0.672052998243801}]
      if(!this.fuse) return [];
      return this.fuse.search(this.searchTerm).splice(0, 10);
    }
  },
  beforeMount() {
    // get search data for Fuse.js
      axios.get(`${process.env.BASE_URL}${CONFIG.HEADERS_LINKS_DATA_FILENAME}`)
      .then(res => {
        this.allHeadersData = res.data;

        const options = {
          includeScore: true,
          keys: ['headerText']
        }

        this.fuse = new Fuse(this.allHeadersData, options);
      })
  },
  methods: {
    onClickHit() {
      this.searchTerm = '';
    }
  }
}
</script>

<style lang="scss">
.search-bar-wrapper {
  width: 30%;
  margin: 0 auto;
  position: relative;

  input {
    width: 100%;
    font-size: 16px;
    padding: 6px 10px;
    border: 1px solid #CECECE;
    border-radius: 3px;
  }

  .search-results {
    width: 100%;

    ul {
      list-style-type: none;
      padding: 0;
      width: 30vw;
      margin: 0;
      position: absolute;
      background: #FFF;
      z-index: 10000;
      border-radius: 0 0 6px 6px;
      border: 1px solid aliceblue;
      border-top: 0;
      left: 1px;
    }

    li {
      text-align:left;
      a {
        text-decoration: none;
        padding: 5px 10px;
        display: block;
        color: #666;

        &:hover {
          background: aliceblue;
        }
      }
    }

    .spacer-icon {
      position: relative;
      top: 2px;
      left: 2px;
      height: 0.8em;
    }
  }
}


</style>