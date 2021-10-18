<template>
  <div class="idx-search">
    <search-tool @searchData="getSearchData" />
  </div>
</template>

<script>
import SearchTool from './search-tool'
import isEmpty from 'lodash/isEmpty'

export default {
  name: 'Dashboard',
  components: { SearchTool },
  data () {
    return {

    }
  },
  computed: {
    isHomePage () {
      return this.$route.path.includes('dashboard')
    }
  },
  methods: {
    getSearchData (query) {
      if (!isEmpty(query)) {
        this.$router.push({ name: 'SearchList', query })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.idx-search{
  width: 1000px;
  height: 70px;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
