<template>
  <div>
    <div class="file-search">
      <search-tool @searchData="getSearchData" />
    </div>

    <div class="file-wrap">
      <div>
        <el-form :inline="true" label-width="100px" :model="query">
          <el-form-item label="发布日期">
            <el-date-picker v-model="date" class="full-width" type="daterange" clearable start-placeholder="发布开始日期" end-placeholder="发布结束日期" title="发布日期" value-format="yyyy-MM-dd" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select-wrapper v-model="query.file" :options="docStatusList" />
          </el-form-item>
          <el-form-item label=" ">
            <el-button-wrapper content="hello" icon="el-icon-close" @click="resetQuery">清空</el-button-wrapper>
            <!--          <el-button-wrapper type="success" icon="el-icon-plus" @click="doAdd">添加</el-button-wrapper>-->
            <el-button-wrapper type="warning" icon="el-icon-download" :loading="isExporting" @click="doExport">导出</el-button-wrapper>
            <el-button-wrapper type="danger" icon="el-icon-delete" @click="doRemove('list','')">批量删除</el-button-wrapper>
          </el-form-item>
        </el-form>
      </div>

      <div>
        <el-table-wrapper
          v-loading="isLoading"
          class="mb-10"
          :data="list"
          @selection-change="selectionChange"
        >
          <el-table-column align="center" type="selection" />
          <el-table-column type="index" label="序号" align="center" />
          <el-table-column label="分类" prop="category" align="center" />
          <el-table-column label="子类" prop="subCategory" align="center" />
          <el-table-column label="文件名" prop="docName" align="center">
            <template slot-scope="{ row }">
              <el-link type="primary" @click="showInfo(row)">{{ row.docName }}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="文号" prop="docNo" align="center" />
          <el-table-column label="文种" prop="docTypeStr" align="center" />
          <el-table-column label="发文单位" prop="publishUnitStr" align="center" />
          <el-table-column label="发文部门" prop="publishDeptStr" align="center" />
          <el-table-column label="发文日期" prop="publishDate" align="center" />
          <el-table-column label="状态" prop="statusStr" align="center" />
          <el-table-column label="修订安排" prop="reviseStatusStr" align="center" />
          <el-table-column label="意见" prop="remark" align="center" show-overflow-tooltip />
          <el-table-column label="文件树" prop="operationTime" align="center">
            <template slot-scope="{ row }">
              <div class="flex justify-center">
                <svg-icon icon-class="tree" class-name="text-xl text-blue-400 hover:text-blue-600 cursor-pointer" @click="viewFileTreeInfo(row)" />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="160">
            <template slot-scope="scope">
              <!--<el-button-wrapper type="text" icon="el-icon-edit" size="mini" @click="doEdit(scope)">编辑</el-button-wrapper>-->
              <el-button-wrapper type="text" icon="el-icon-delete" size="mini" @click="doRemove('item', scope)">删除</el-button-wrapper>
            </template>
          </el-table-column>
        </el-table-wrapper>
      </div>

      <el-dialog :visible.sync="treeInfoVisible" width="60%" title="文件树详情">
        <el-table-wrapper v-loading="isLoadingTreeInfo" :data="treeInfoList">
          <el-table-column type="index" align="center" label="序号" />
          <el-table-column align="center" label="对应部门" />
          <el-table-column align="center" label="文件名" prop="docName" />
          <el-table-column align="center" label="文号" prop="docNo" />
          <el-table-column align="center" label="发文部门" prop="publishDeptStr" />
          <el-table-column align="center" label="发文日期" prop="publishDate" />
          <el-table-column align="center" label="文种" prop="docTypeStr" />
          <el-table-column align="center" label="状态" prop="statusStr" />
        </el-table-wrapper>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getDictionaryList } from '@/api/common'
import { getSolrList, deleteItem, exportData, getTreeInfoList } from './api'
import { downFileStream } from '@/utils'
import ElSelectWrapper from '@/components/ElSelectWrapper'
import ElButtonWrapper from '@/components/ElButtonWrapper'
import ElTableWrapper from '@/components/ElTableWrapper'
import SearchTool from '@/views/dashboard/search-tool'

export default {
  name: 'FileManagement',
  components: {
    ElSelectWrapper,
    ElButtonWrapper,
    ElTableWrapper,
    SearchTool
  },
  data () {
    return {
      date: [],
      docTypeList: [],
      fileType: '1',
      query: {
        arr: []
      },
      defaultQuery: {
        operationCode: null,
        operationContent: null,
        isPage: '1'
      },
      isAdd: false,
      isLoading: false,
      isExporting: false,
      selectionIds: [],
      list: [],
      refineArr: [],
      treeInfoVisible: false,
      isLoadingTreeInfo: false,
      treeInfoList: [],
      docStatusList: []
    }
  },
  async created () {
    await this.getCommonData()
  },
  methods: {

    async getSearchData (query) {
      const { data } = await getSolrList(query)
      this.list = data
    },

    async viewFileTreeInfo (row) {
      this.treeInfoVisible = true
      await this.getTreeInfoData(row.odocId)
    },

    async getTreeInfoData (id) {
      this.isLoadingTreeInfo = true
      this.treeInfoList = []
      const { data } = await getTreeInfoList(id).finally(() => {
        this.isLoadingTreeInfo = false
      })
      this.treeInfoList = data?.list
      this.treeInfoPagination = data?.pageReq
    },

    async doRemove (type, { row }) {
      if (type === 'list') {
        if (this.selectionIds.length === 0) {
          this.$message.warning('请选择删除项')
          return
        }
        await deleteItem(this.selectionIds.toString())
        this.$message.success('删除成功')
        await this.getList()
      } else {
        this.$confirm(`确认删除文件名为【${row.docName}】文件？`, '提醒', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await deleteItem(row.id)
          this.$message.success('删除成功')
          await this.getList()
        }).catch(_ => {})
      }
    },

    doAdd () {
      this.$router.push({ name: 'FileAdd' })
    },

    doEdit ({ row }) {
      this.$router.push({ name: 'FileEdit', params: { id: row.id }})
    },

    showInfo (item) {
      this.$router.push({ name: 'FileManagementInfo', params: { id: item.id }})
    },

    async doExport () {
      let query = null
      if (this.selectionIds.length) {
        query = { ...this.query, ids: this.selectionIds }
      } else {
        query = { ...this.query }
      }

      this.isExporting = true
      const res = await exportData(query).finally(() => {
        this.isExporting = false
      })
      downFileStream(res)
    },

    selectionChange (val) {
      this.selectionIds = val.map(i => i.id)
    },

    resetQuery () {
      this.query = Object.assign({}, this.defaultQuery)
    },

    async getCommonData () {
      const key1 = 'DOCUMENT_TYPE'
      const key2 = 'DOCUMENT_STATUS'

      const { data: enums } = await getDictionaryList([key1, key2].toString())
      this.docTypeList = enums[key1]
      this.docStatusList = enums[key2]
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-col {
    margin-bottom: 0.3rem;
  }
}
.file-search{
  margin: 5px 20px;
  ::v-deep .quick-wrap{
    display: none !important;
  }
}
.file-wrap{
  padding: 15px 20px;
}
</style>
