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
          <el-date-picker v-model="query.routeDate" type="date" clearable value-format="yyyy-MM-dd" title="提报时间" />
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-close" @click="resetQuery">清空</el-button>
          <el-button type="primary" icon="el-icon-search" :loading="isLoading" @click="doSearch">查询</el-button>
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
      <el-table-column label="文件名" prop="remindTime" align="center" />
      <el-table-column label="文号" prop="remindTime" align="center" />
      <el-table-column label="文种" prop="remindTime" align="center" />
      <el-table-column label="修改意见" prop="remindTime" align="center" />
      <el-table-column label="提报单位" prop="operationTime" align="center" />
      <el-table-column label="提报部门" prop="operationTime" align="center" />
      <el-table-column label="提报人" prop="operationTime" align="center" />
      <el-table-column label="提报时间" prop="time" align="center" />
      <el-table-column label="状态" prop="status" align="center" />
      <el-table-column label="处理意见" prop="remark" align="center" show-overflow-tooltip />
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
// import cloneDeep from 'lodash/cloneDeep'
// import { getList, deleteItem, exportData } from './api'
import ElTableWrapper from '@/components/ElTableWrapper'
import { exportData } from './api'
import autoTableHeight from '@/mixins/autoTableHeight'
import { isBefore } from 'date-fns'
import { downFileStream } from '@/utils'

export default {
  name: 'RevisePlan',
  components: {
    ElTableWrapper
  },
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
      list: [],
      tempList: [
        {
          id: '1',
          operationCode: '安全',
          operationContent: '基础安全',
          remindTime: '中国铁路上海局集团有限公司',
          operationTime: '辆动函[2021] 51号',
          fileType: '技术规章',
          status: '未处理',
          time: '2021-09-01',
          remark: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
        },
        {
          id: '2',
          operationCode: '安全',
          operationContent: '基础安全',
          remindTime: '中国铁路上海局集团有限公司',
          operationTime: '辆动函[2021] 51号',
          fileType: '管理制度',
          status: '采纳',
          time: '2021-08-01',
          remark: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
        },
        {
          id: '3',
          operationCode: '安全',
          operationContent: '基础安全',
          remindTime: '中国铁路上海局集团有限公司',
          operationTime: '辆动函[2021] 51号',
          fileType: '管理制度',
          status: '采纳',
          time: '2021-06-01',
          remark: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
        },
        {
          id: '4',
          operationCode: '安全',
          operationContent: '基础安全',
          remindTime: '基础安全',
          operationTime: '辆动函[2021] 51号',
          fileType: '管理制度',
          status: '采纳',
          time: '2021-05-01',
          remark: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
        },
        {
          id: '5',
          operationCode: '安全',
          operationContent: '基础安全',
          remindTime: '防御机制',
          operationTime: '辆动函[2021] 51号',
          fileType: '管理制度',
          status: '采纳',
          time: '2021-04-01',
          remark: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
        },
        {
          id: '6',
          operationCode: '安全',
          operationContent: '基础安全',
          remindTime: '安全关键',
          operationTime: '辆动函[2021] 51号',
          fileType: '管理制度',
          status: '未采纳',
          time: '2021-03-01',
          remark: ''
        },
        {
          id: '7',
          operationCode: '安全',
          operationContent: '基础安全',
          remindTime: '评价问责',
          operationTime: '辆动函[2021] 51号',
          fileType: '管理制度',
          status: '采纳',
          time: '2021-02-01',
          remark: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
        }
      ]
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
      // const query = { ...this.query, ...this.pagination }
      // const { data } = await getList(query).finally(() => {
      //   this.isLoading = false
      // })
      setTimeout(() => {
        this.isLoading = false
        this.tempList.forEach((item) => {
          if (isBefore(new Date(item.time), new Date())) {
            item.isPast = true
          } else {
            item.isPast = false
          }
        })
        this.list = this.tempList
      }, 1000)

      // this.list = data?.list
      // this.pagination = data?.pageReq
    },

    cellStyle ({ row, column }) {
      if (column.label === '状态' && row.status === '未处理') {
        return 'background-color: #f15959; color: #fff'
      } else {
        return ''
      }
    },

    doEdit ({ row }) {

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

    resetQuery () {
      this.query = Object.assign({}, this.defaultQuery)
    }
  }
}
</script>

<style scoped>

</style>
