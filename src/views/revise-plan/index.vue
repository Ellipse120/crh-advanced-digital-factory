<template>
  <div class="app-container">
    <div>
      <el-form :inline="true" :model="query">
        <el-form-item>
          <el-input v-model="query.file" clearable placeholder="请输入文种" title="文种" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="query.file" clearable placeholder="请输入发文单位" title="发文单位" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="query.file" clearable placeholder="请输入发文部门" title="发文部门" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="query.file" clearable placeholder="请输入状态" title="状态" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="query.file" class="full-width" placeholder="请选择修订安排" title="修订安排" clearable filterable default-first-option>
            <el-option v-for="(item, index) in allRevises" :key="index" :value="item.value" :label="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-close" @click="resetQuery">清空</el-button>
          <el-button type="primary" icon="el-icon-search" :loading="isLoading" @click="doSearch">查询</el-button>
          <el-button type="success" icon="el-icon-download" :loading="isExporting" @click="doExport">导出</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table-wrapper
      ref="searchTable"
      v-loading="isLoading"
      class="mb-10"
      :height="tableHeight"
      :data="list"
      @selection-change="selectionChange"
    >
      <el-table-column align="center" type="selection" />
      <el-table-column type="index" label="序号" align="center" />
      <el-table-column label="分类" prop="category" align="center" show-overflow-tooltip />
      <el-table-column label="子类" prop="subCategory" align="center" show-overflow-tooltip />
      <el-table-column label="文件名" prop="docName" align="center" />
      <el-table-column label="文号" prop="docNo" align="center" />
      <el-table-column label="文种" prop="docTypeStr" align="center" />
      <el-table-column label="发文单位" prop="publishUnitStr" align="center" />
      <el-table-column label="发文部门" prop="publishDeptStr" align="center" />
      <el-table-column label="发文时间" prop="publishDate" align="center" />
      <el-table-column label="修订安排" prop="reviseStatusStr" align="center" />
      <el-table-column label="完成时间" prop="reviseFinishTime" align="center" />
      <el-table-column label="意见" prop="operationTime" align="center" />
      <el-table-column label="修订部门" prop="reviseDept" align="center" />
      <el-table-column label="操作" align="center" width="160">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === '1'" type="text" icon="el-icon-edit" size="mini" @click="doEdit(scope)">未修订</el-button>
          <el-button v-if="scope.row.status === '2'" type="text" icon="el-icon-check" size="mini" disabled>已修订</el-button>
        </template>
      </el-table-column>
    </el-table-wrapper>

    <el-pagination
      :current-page="pagination.pageNo"
      :page-sizes="[10, 20, 100]"
      :page-size="pagination.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.totalRecords"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import ElTableWrapper from '@/components/ElTableWrapper'
import { getList, exportData } from './api'
import autoTableHeight from '@/mixins/autoTableHeight'
import { downFileStream } from '@/utils'
import { getDictionaryList } from '@/api/common'

export default {
  name: 'RevisePlan',
  components: {
    ElTableWrapper
  },
  mixins: [autoTableHeight],
  data () {
    return {
      allRevises: [{
        value: '有修订计划'
      }, {
        value: '今年已修订'
      }],
      query: {
        arr: []
      },
      defaultQuery: {
        operationCode: null,
        operationContent: null,
        isPage: '1'
      },
      pagination: {
        pageNo: 1,
        pageSize: 20,
        totalRecords: 0
      },
      isLoading: false,
      isExporting: false,
      selectionIds: [],
      list: []
    }
  },
  mounted () {
    this.doSearch()
  },
  methods: {
    doSearch () {
      this.pagination.pageNo = 1
      this.getList()
    },

    async getList () {
      this.isLoading = true
      const query = { ...this.query, ...this.pagination }
      const { data } = await getList(query).finally(() => {
        this.isLoading = false
      })
      this.list = data?.list
      this.pagination = data?.pageReq
    },

    doEdit ({ row }) {
      this.$confirm(`确认修订【${row.operationContent}】文件？`, '提醒', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // await deleteItem(row.id)
        this.$message.success('修订成功')
        await this.getList()
      }).catch(_ => {})
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

    handleCurrentChange (currentPage) {
      this.pagination.pageNo = currentPage
      this.getList()
    },

    handleSizeChange (pageSize) {
      this.pagination.pageSize = pageSize
      this.getList()
    },

    async getCommonData () {
      const key1 = 'DOCUMENT_TYPE'
      const { data: enums } = await getDictionaryList([key1].toString())
      this.docTypeList = enums[key1]
    },

    resetQuery () {
      this.query = Object.assign({}, this.defaultQuery)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
