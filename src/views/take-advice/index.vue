<template>
  <div class="app-container">
    <div>
      <el-form :inline="true" :model="query">
        <el-form-item>
          <el-input v-model="query.rfcDocName" clearable placeholder="请输入文件名称" title="文件名称" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="query.publishUnit" clearable placeholder="请输入发文单位" title="发文单位" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="query.publishDept" clearable placeholder="请输入发文部门" title="发文部门" />
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="query.routeDate" type="date" clearable value-format="yyyy-MM-dd" placeholder="请选择截止时间" title="截止时间" />
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-close" @click="resetQuery">清空</el-button>
          <el-button type="primary" icon="el-icon-search" :loading="isLoading" @click="doSearch">查询</el-button>
          <el-button type="success" icon="el-icon-plus" @click="commentAdd">添加</el-button>
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
      <el-table-column label="文件名称" prop="rfcDocName" align="center" />
      <el-table-column label="发文单位" align="center">
        <template slot-scope="{row: {publishDeptInfo}}">{{ publishDeptInfo && publishDeptInfo.parentUnitName }}</template>
      </el-table-column>
      <el-table-column label="发文部门" prop="operationTime" align="center">
        <template slot-scope="{row: {publishDeptInfo}}">{{ publishDeptInfo && publishDeptInfo.departmentName }}</template>
      </el-table-column>
      <el-table-column label="有关要求" prop="requirement" align="center" />
      <el-table-column label="截至日期" prop="deadline" align="center">
        <template slot-scope="{row}">{{ formatTimeMixin(row.deadline, 'yyyy-MM-dd') }}</template>
      </el-table-column>
      <el-table-column label="征求对象" prop="operationTime" align="center">
        <template slot-scope="{row: {requestDeptInfo}}">{{ requestDeptInfo && requestDeptInfo.departmentName }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-view" size="mini" @click="CommentDetail(scope.row)">查看</el-button>
          <el-button type="text" icon="el-icon-edit" size="mini" @click="EditDetail(scope.row)">编辑</el-button>
          <el-button type="text" icon="el-icon-delete" size="mini" @click="deleteItem(scope.row)">删除</el-button>
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
import { getList, deleteItem } from './api'
import autoTableHeight from '@/mixins/autoTableHeight'
import ElTableWrapper from '@/components/ElTableWrapper'

export default {
  name: 'TakeAdvice',
  components: { ElTableWrapper },
  mixins: [autoTableHeight],
  data () {
    return {
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
  created () {
    this.doSearch()
  },
  methods: {
    doSearch () {
      this.pagination.pageNo = 1
      this.getList()
    },

    commentAdd () {
      this.$router.push({ name: 'CommentAdd' })
    },

    EditDetail (row) {
      this.$router.push({ name: 'CommentAdd', params: { id: row.id }})
    },

    async deleteItem (row) {
      this.$confirm(`确认删除文件名为【${row.rfcDocName}】文件？`, '提醒', {
        type: 'warning'
      }).then(async () => {
        await deleteItem(row.id)
        this.$message.success('删除成功')
        await this.getList()
      }).catch(_ => {})
    },

    CommentDetail (row) {
      this.$router.push({ name: 'CommentDetail', params: { id: row.id }})
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

    cellStyle ({ row, column }) {
      if (column.label === '操作' && !row.isPast) {
        return 'background-color: #f15959'
      } else {
        return ''
      }
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

<style lang="scss" scoped>

</style>
