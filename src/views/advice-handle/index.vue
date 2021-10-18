<template>
  <div class="app-container">
    <div>
      <el-form :inline="true" :model="query">
        <el-form-item label="文种">
          <el-input v-model="query.file" clearable placeholder="请输入文种" title="文种" />
        </el-form-item>
        <el-form-item label="文件名">
          <el-input v-model="query.file" clearable placeholder="请输入文件名" title="文件名" />
        </el-form-item>
        <el-form-item label="文号">
          <el-input v-model="query.file" clearable placeholder="请输入文号" title="文号" />
        </el-form-item>
        <el-form-item label="提报单位">
          <el-input v-model="query.file" clearable placeholder="请输入提报单位" title="提报单位" />
        </el-form-item>
        <el-form-item label="提报部门">
          <el-input v-model="query.file" clearable placeholder="请输入提报部门" title="提报部门" />
        </el-form-item>
        <el-form-item label="提报时间">
          <el-date-picker v-model="query.time" type="date" clearable value-format="yyyy-MM-dd" placeholder="请选择提报时间" title="提报时间" />
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-close" @click="resetQuery">清空</el-button>
          <el-button type="primary" icon="el-icon-search" :loading="isLoading" @click="doSearch">查询</el-button>
          <el-button type="success" icon="el-icon-plus" @click="doAdd">添加</el-button>
          <el-button type="warning" icon="el-icon-download" :loading="isExporting" @click="doExport">导出</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table-wrapper
      ref="searchTable"
      v-loading="isLoading"
      class="mb-10"
      :height="tableHeight"
      :data="list"
      :cell-style="cellStyle"
      @selection-change="selectionChange"
    >
      <el-table-column align="center" type="selection" />
      <el-table-column type="index" label="序号" align="center" />
      <el-table-column label="文件名" prop="docName" align="center" />
      <el-table-column label="文号" prop="docNo" align="center" />
      <el-table-column label="文种" prop="docTypeStr" align="center" />
      <el-table-column label="修改意见" prop="comment" align="center" />
      <el-table-column label="提报单位" prop="ommentUnit" align="center" />
      <el-table-column label="提报部门" prop="commentDept" align="center" />
      <el-table-column label="提报人" prop="commentByName" align="center" />
      <el-table-column label="提报时间" prop="commentTime" align="center">
        <template slot-scope="{row: {commentTime}}">{{ formatTextMixin(commentTime) }}</template>
      </el-table-column>
      <el-table-column label="状态" prop="status" align="center" />
      <el-table-column label="处理意见" prop="disposeComment" align="center" show-overflow-tooltip />
      <el-table-column label="操作" align="center" width="80">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === '未处理'" type="text" icon="el-icon-edit" size="mini" @click="doEdit(scope)">处理</el-button>
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
import { getList } from './api'
import autoTableHeight from '@/mixins/autoTableHeight'
import ElTableWrapper from '@/components/ElTableWrapper'

export default {
  name: 'RevisePlan',
  components: { ElTableWrapper },
  mixins: [autoTableHeight],
  data () {
    return {
      query: {
        file: null,
        time: null
      },
      defaultQuery: {
        file: null,
        time: null
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
  created () {
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
      this.$router.push({
        name: 'AdviceDetailHandle',
        params: {
          id: row.id
        }
      })
    },

    doAdd () {
      this.$router.push({
        name: 'AdviceDetailHandle'
      })
    },

    cellStyle ({ row, column }) {
      if (column.label === '状态' && row.status === '未处理') {
        return 'background-color: #f15959; color: #fff'
      } else {
        return ''
      }
    },

    async doExport () {
      let query = null
      if (this.selectionIds.length) {
        query = { ...this.query, ids: this.selectionIds }
      } else {
        query = { ...this.query }
      }
      console.log(query)

      // this.isExporting = true
      // const res = await exportData(query).finally(() => {
      //   this.isExporting = false
      // })
      // downFileStream(res)
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

    resetQuery () {
      this.query = Object.assign({}, this.defaultQuery)
    }
  }
}
</script>

<style scoped>

</style>
