<template>
  <div class="search-wrapper">
    <div style="height: 40px; display: flex;">
      <div class="select-wrap">
        <el-select v-model="query.docLevel" class="select-item" placeholder="组织机构">
          <el-option v-for="i in UNIT" :key="i.key" :value="i.key" :label="i.value" />
        </el-select>
        <el-select v-model="query.docType" style="width: 100px" class="select-item" placeholder="文件类型">
          <el-option v-for="i in docTypeList" :key="i.key" :value="i.key" :label="i.value" />
        </el-select>
        <el-select v-model="searchType" style="width: 100px" class="select-item" placeholder="搜索类型">
          <el-option v-for="i in searchTypeList" :key="i.key" :value="i.key" :label="i.value" />
        </el-select>
      </div>
      <div class="search-wrap">
        <el-input v-model="query.search">
          <el-button slot="append" style="width: 80px;" type="primary" @click="submit">搜索</el-button>
        </el-input>
      </div>
    </div>
    <div class="quick-wrap">
      <span v-for="i in quickList" :key="i.key" @click="clickQuick(i)">{{ i.value }}</span>
    </div>
  </div>
</template>
<script>
import isEmpty from 'lodash/isEmpty'
import { mapGetters } from 'vuex'
import { getDictionaryList } from '@/api/common'

export default {
  data () {
    return {
      query: {
        docLevel: 'GTJT',
        docType: 'JSGZ',
        search: null
      },
      list: [],
      docLevelList: ['各级发文', '国铁集团'],
      docTypeList: ['各类文件', '技术规章'],
      searchType: '0',
      searchTypeList: [{ value: '全文', key: '0' }, { value: '全文名称', key: '1' }, { value: '文号', key: '2' }, { value: '文件内容', key: '3' }],
      quickList: ['综合', '规章制度', '管理制度', '通知纪要', '作业标准', '车辆资料']
    }
  },
  computed: {
    ...mapGetters(['allOrganizations']),
    UNIT () {
      return this.allOrganizations.UNIT
    }
  },
  created () {
    const { query } = this.$route
    if (!isEmpty(query)) {
      this.query = query
      this.searchType = query.searchType
      this.$emit('searchData', this.query)
    }
    this.getCommonData()
  },
  methods: {
    async submit () {
      // if (!this.search) return
      this.query.searchType = this.searchType
      switch (this.searchType) {
        case '0':
          this.query.docName = this.query.search
          this.query.docNo = this.query.search
          this.query.docContent = this.query.search
          break
        case '1':
          this.query.docName = this.query.search
          break
        case '2':
          this.query.docNo = this.query.search
          break
        case '3':
          this.query.docContent = this.query.search
          break
      }
      this.$emit('searchData', this.query)
    },

    async getCommonData () {
      const key1 = 'DOCUMENT_TYPE'

      const { data: enums } = await getDictionaryList([key1].toString())
      this.docTypeList = enums[key1]
      this.quickList = enums[key1]
      console.log(this.docTypeList)
    },

    clickQuick (val) {
      this.query.searchType = this.searchType
      this.query.docType = val.key
      this.$emit('searchData', this.query)
      // this.search = val
    }
  }
}
</script>

<style scoped lang="scss">
.search-wrapper{
  .select-wrap{
      background-color: #e8f1fe;
    .select-item{
        width: 130px;
        margin-right: 5px;
      ::v-deep{
        .el-input__inner{
          height: 40px;
          color: #0079ff;
          border: none;
          background: transparent;
        }
      }
    }
  }
  .search-wrap{
      width: 600px;
      height: 40px;
    ::v-deep{
      .el-input__inner{
        height: 40px;
      }
      .el-input-group__append{
        color: #fff;
        background-color: #409EFF;
      &:hover{
         background-color: rgb(102,177,255)
       }
      }
    }
  }
    .quick-wrap{
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      color: #999;
      position: absolute;
      left: 350px;
      bottom: 0;
    span{
      cursor: pointer;
      margin-right: 15px;
    &:hover{
       color: #333;
     }
    }
  }
}
</style>
