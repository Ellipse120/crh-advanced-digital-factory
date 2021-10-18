<template>
  <div class="app-container">
    <div>
      <el-form :inline="true" :model="query">
        <el-form-item>
          <el-input v-model.trim="query.supNumber" clearable placeholder="请输入制定单位" title="制定单位" />
        </el-form-item>
        <el-form-item>
          <el-input v-model.trim="query.supervisorName" clearable placeholder="请输入制定部门" title="制定部门" />
        </el-form-item>
        <el-form-item>
          <el-input v-model.trim="query.supervisorName" clearable placeholder="请输入对规文种" title="对规文种" />
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="query.date" type="date" clearable placeholder="请选择年度" title="年度" value-format="yyyy-MM-dd" />
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="query.date" type="date" clearable placeholder="请选择月度" title="月度" value-format="yyyy-MM-dd" />
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
      <el-table-column label="通报名称" prop="remindTime" align="center" />
      <el-table-column label="发布单位" prop="operationTime" align="center" />
      <el-table-column label="发布部门" prop="operationTime" align="center" />
      <el-table-column label="发布时间" prop="time" align="center" />
      <el-table-column label="操作" align="center" width="100">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-view" size="mini" @click="viewDetail(scope)">查看</el-button>
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
// import cloneDeep from 'lodash/cloneDeep'
// import { getList, deleteItem, exportData } from './api'
import { exportData } from './api'
import autoTableHeight from '@/mixins/autoTableHeight'
import { downFileStream } from '@/utils'
import ElTableWrapper from '@/components/ElTableWrapper'

export default {
  name: 'RevisePlan',
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
      list: [],
      file: null,
      tempList: [
        {
          'id': '1',
          'operationCode': '安全',
          'operationContent': '基础安全',
          'remindTime': '中国铁路上海局集团有限公司',
          'operationTime': '辆动函[2021] 51号',
          'fileType': '技术规章',
          'status': '1',
          'time': '2021-09-01'
        },
        {
          'id': '2',
          'operationCode': '安全',
          'operationContent': '基础安全',
          'remindTime': '中国铁路上海局集团有限公司',
          'operationTime': '辆动函[2021] 51号',
          'fileType': '管理制度',
          'status': '2',
          'time': '2021-08-01'
        },
        {
          'id': '3',
          'operationCode': '安全',
          'operationContent': '基础安全',
          'remindTime': '中国铁路上海局集团有限公司',
          'operationTime': '辆动函[2021] 51号',
          'fileType': '管理制度',
          'status': '1',
          'time': '2021-06-01'
        },
        {
          'id': '4',
          'operationCode': '安全',
          'operationContent': '基础安全',
          'remindTime': '基础安全',
          'operationTime': '辆动函[2021] 51号',
          'fileType': '管理制度',
          'status': '2',
          'time': '2021-05-01'
        },
        {
          'id': '5',
          'operationCode': '安全',
          'operationContent': '基础安全',
          'remindTime': '防御机制',
          'operationTime': '辆动函[2021] 51号',
          'fileType': '管理制度',
          'status': '1',
          'time': '2021-04-01'
        },
        {
          'id': '6',
          'operationCode': '安全',
          'operationContent': '基础安全',
          'remindTime': '安全关键',
          'operationTime': '辆动函[2021] 51号',
          'fileType': '管理制度',
          'status': '2',
          'time': '2021-03-01'
        },
        {
          'id': '7',
          'operationCode': '安全',
          'operationContent': '基础安全',
          'remindTime': '评价问责',
          'operationTime': '辆动函[2021] 51号',
          'fileType': '管理制度',
          'status': '2',
          'time': '2021-02-01'
        }
      ]
    }
  },
  created () {
    this.getList()
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
        this.list = this.tempList
      }, 1000)

      // this.list = data?.list
      // this.pagination = data?.pageReq
    },

    viewDetail ({ row }) {
      this.$router.push({
        name: 'RegulationsReportGenerate',
        query: {
          id: row.id
        }
      })
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

<style lang="scss" scoped>
</style>
