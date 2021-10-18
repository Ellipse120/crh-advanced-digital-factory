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
        <el-form-item label="对应计划">
          <el-select v-model="query.x" class="full-width" placeholder="请选择对应计划" title="对应计划" clearable filterable default-first-option>
            <el-option v-for="(item, index) in allPlans" :key="index" :value="item.value" :label="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-close" @click="resetQuery">清空</el-button>
          <el-button type="primary" icon="el-icon-search" :loading="isLoading" @click="doSearch">查询</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="doRemove('list','')">删除</el-button>
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
      <el-table-column label="分类" prop="remindTime" align="center" />
      <el-table-column label="来源" prop="operationTime" align="center" />
      <el-table-column label="文件名" prop="operationTime" align="center" />
      <el-table-column label="文号" prop="operationTime" align="center" />
      <el-table-column label="文种" prop="time" align="center" />
      <el-table-column label="问题" prop="operationTime" align="center" />
      <el-table-column label="责任单位/部门、班组" prop="operationTime" align="center" />
      <el-table-column label="整改措施" prop="operationTime" align="center" />
      <el-table-column label="整改期限" prop="operationTime" align="center" />
      <el-table-column label="录入时间" prop="time" align="center" />
      <!-- <el-table-column
        label="操作"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-delete" size="mini" @click="doRemove('item', scope)">删除</el-button>
        </template>
      </el-table-column> -->
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
// import { getList, deleteItem, exportData } from './api'
import ElTableWrapper from '@/components/ElTableWrapper'
import { importData } from './api'
import autoTableHeight from '@/mixins/autoTableHeight'

export default {
  name: 'RevisePlan',
  components: { ElTableWrapper },
  mixins: [autoTableHeight],
  data () {
    return {
      allPlans: [
        {
          value: '安检管理条例'
        }, {
          value: '安检管理条例06'
        }
      ],
      query: {
        x: null
      },
      defaultQuery: {
        x: null
      },
      pagination: {
        pageNo: 1,
        pageSize: 20,
        totalRecords: 0
      },
      isLoading: false,
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
      formData.append('files', this.file.raw)
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
