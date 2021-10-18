<template>
  <div class="app-container">
    <div>
      <el-form :inline="true" :model="query">
        <el-form-item label="制定单位">
          <el-input v-model.trim="query.x" clearable placeholder="请输入制定单位" title="制定单位" />
        </el-form-item>
        <el-form-item label="制定部门">
          <el-input v-model.trim="query.x" clearable placeholder="请输入制定部门" title="制定部门" />
        </el-form-item>
        <el-form-item label="指定人">
          <el-input v-model.trim="query.x" clearable placeholder="请输入指定人" title="指定人" />
        </el-form-item>
        <el-form-item label="对规文种">
          <el-input v-model.trim="query.x" clearable placeholder="请输入对规文种" title="对规文种" />
        </el-form-item>
        <el-form-item label="发文单位">
          <el-input v-model.trim="query.x" clearable placeholder="请输入发文单位" title="发文单位" />
        </el-form-item>
        <el-form-item label="发文部门">
          <el-input v-model.trim="query.x" clearable placeholder="请输入发文部门" title="发文部门" />
        </el-form-item>
        <el-form-item label="年度">
          <el-date-picker v-model="query.year" type="year" placeholder="请选择年度" title="年度" clearable value-format="yyyy-MM-dd" />
        </el-form-item>
        <el-form-item label="月度">
          <el-date-picker v-model="query.month" type="month" placeholder="请选择月度" title="月度" clearable value-format="yyyy-MM-dd" />
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-close" @click="resetQuery">清空</el-button>
          <el-button type="primary" icon="el-icon-search" :loading="isLoading" @click="doSearch">查询</el-button>
          <el-button type="success" icon="el-icon-plus" @click="doAdd">添加</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="doRemove('list','')">删除</el-button>
          <el-button type="warning" icon="el-icon-download" :loading="isExporting" @click="doExport">导出</el-button>
          <el-upload class="btn-upload" accept=".xls,.xlsx" :show-file-list="false" action="" :http-request="customUpload" :on-change="onFileChange">
            <el-button type="success" icon="el-icon-upload2" :loading="isUploading">导入</el-button>
          </el-upload>
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
      <el-table-column label="制定单位" prop="remindTime" align="center" />
      <el-table-column label="制定部门" prop="operationTime" align="center" />
      <el-table-column label="对规计划" prop="operationTime" align="center" />
      <el-table-column label="文种" prop="operationTime" align="center" />
      <el-table-column label="对规时间" prop="time" align="center" />
      <el-table-column label="对规部门" prop="operationTime" align="center" />
      <el-table-column label="提报部门" prop="operationTime" align="center" />
      <el-table-column label="指定人" prop="operationTime" align="center" />
      <el-table-column label="问题录入" prop="operationTime" align="center" />
      <el-table-column label="操作" align="center" width="120">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" size="mini" @click="doEdit(scope)">编辑</el-button>
          <el-button type="text" icon="el-icon-delete" size="mini" @click="doRemove('item', scope)">删除</el-button>
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
import ElTableWrapper from '@/components/ElTableWrapper'
import { importData, exportData } from './api'
import autoTableHeight from '@/mixins/autoTableHeight'
import { downFileStream } from '@/utils'

export default {
  name: 'RevisePlan',
  components: { ElTableWrapper },
  mixins: [autoTableHeight],
  data () {
    return {
      query: {
        x: null,
        year: null,
        month: null
      },
      defaultQuery: {
        x: null,
        year: null,
        month: null
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
      isUploading: false,
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
        this.list = this.tempList
      }, 1000)

      // this.list = data?.list
      // this.pagination = data?.pageReq
    },

    doAdd () {
      this.$router.push({
        name: 'RegulationsPlanDetail'
      })
    },

    doEdit ({ row }) {
      this.$router.push({
        name: 'RegulationsPlanDetail',
        query: { id: row.id }
      })
      // this.isAdd = false
      // const data = cloneDeep(row)
      // data.remindTime = Number(data.remindTime)
      // data.operationTime = Number(data.operationTime)
      // this.model = data
      // this.dialogVisible = true
    },

    async doRemove (type, { row }) {
      if (type === 'list') {
        if (this.selectionIds.length === 0) {
          this.$message.warning('请选择删除项')
          return
        }
        // await deleteItem(this.selectionIds.toString())
        this.$message.success('删除成功')
        await this.getList()
      } else {
        this.$confirm(`确认删除文件名为【${row.operationContent}】文件？`, '提醒', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          // await deleteItem(row.id)
          this.$message.success('删除成功')
          await this.getList()
        }).catch(_ => {})
      }
    },

    async customUpload () {
      const formData = new FormData()
      formData.append('file', this.file.raw)
      this.isUploading = true
      await importData(formData).finally(() => {
        this.isUploading = false
      })
      this.$message.success('导入成功')
      await this.getList()
    },

    onFileChange (file) {
      this.file = file
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
.btn-upload {
  display: inline-block;
  margin-left: 10px;
}
</style>
