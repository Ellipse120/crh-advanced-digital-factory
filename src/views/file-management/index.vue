<template>
  <div class="app-container">
    <div>
      <el-form :inline="true" label-width="100px" :model="query">
        <el-form-item label="文种">
          <el-select-wrapper v-model="query.docType" :options="docTypeList" />
        </el-form-item>
        <el-form-item label="文件名称">
          <el-input v-model="query.operationCode" clearable placeholder="请输入文件名称" title="文件名称" />
        </el-form-item>
        <el-form-item label="文号">
          <el-input v-model="query.operationContent" clearable placeholder="请输入文号" title="文号" />
        </el-form-item>
        <el-form-item label="文件内容">
          <el-input v-model="query.file" clearable placeholder="请输入文件内容" title="文件内容" />
        </el-form-item>
        <el-form-item label="发布日期">
          <el-date-picker v-model="date" class="full-width" type="daterange" clearable start-placeholder="发布开始日期" end-placeholder="发布结束日期" title="发布日期" value-format="yyyy-MM-dd" />
        </el-form-item>
        <el-form-item label="发文单位">
          <el-select v-model="query.file" class="full-width" placeholder="请输入发文单位" title="发文单位" clearable filterable default-first-option>
            <el-option v-for="(item, index) in refineArr" :key="index" :value="item.value" :label="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="发文部门">
          <el-select v-model="query.file" class="full-width" placeholder="请输入发文部门" title="发文部门" clearable filterable default-first-option>
            <el-option v-for="(item, index) in refineArr" :key="index" :value="item.value" :label="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select-wrapper v-model="query.file" :options="docStatusList" />
        </el-form-item>
        <el-form-item v-if="fileType !== '1'">
          <el-select v-model="query.arr" class="full-width" multiple placeholder="请选择适用范围" title="适用范围" clearable filterable default-first-option>
            <el-option v-for="(item, index) in limitArr" :key="index" :value="item.value" :label="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="fileType !== '1'">
          <el-select v-model="query.arr" class="full-width" multiple placeholder="请输入适用车型" title="适用车型" clearable filterable default-first-option>
            <el-option v-for="(item, index) in limitArr" :key="index" :value="item.value" :label="item.value" />
          </el-select>
          <!-- <el-input v-model="query.file" clearable placeholder="请输入适用车型" title="适用车型" /> -->
        </el-form-item>
        <el-form-item v-if="fileType !== '1'">
          <el-input v-model="query.file" clearable placeholder="请输入检修方式" title="检修方式" />
        </el-form-item>
        <el-form-item label=" ">
          <el-button-wrapper content="hello" icon="el-icon-close" @click="resetQuery">清空</el-button-wrapper>
          <el-button-wrapper type="primary" icon="el-icon-search" :loading="isLoading" @click="doSearch">查询</el-button-wrapper>
          <el-button-wrapper type="success" icon="el-icon-plus" @click="doAdd">添加</el-button-wrapper>
          <el-button-wrapper type="warning" icon="el-icon-download" :loading="isExporting" @click="doExport">导出</el-button-wrapper>
          <el-button-wrapper type="danger" icon="el-icon-delete" @click="doRemove('list','')">批量删除</el-button-wrapper>
        </el-form-item>
      </el-form>
    </div>

    <div>
      <el-table
        ref="searchTable"
        v-loading="isLoading"
        size="mini"
        class="mb-10"
        border
        stripe
        :height="tableHeight"
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
            <el-button-wrapper type="text" icon="el-icon-edit" size="mini" @click="doEdit(scope)">编辑</el-button-wrapper>
            <el-button-wrapper type="text" icon="el-icon-delete" size="mini" @click="doRemove('item', scope)">删除</el-button-wrapper>
          </template>
        </el-table-column>
      </el-table>

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
</template>

<script>
import { getDictionaryList } from '@/api/common'
import { getList, deleteItem, exportData, getTreeInfoList } from './api'
import autoTableHeight from '@/mixins/autoTableHeight'
import { downFileStream } from '@/utils'
import ElSelectWrapper from '@/components/ElSelectWrapper'
import ElButtonWrapper from '@/components/ElButtonWrapper'
import ElTableWrapper from '@/components/ElTableWrapper'

export default {
  name: 'FileManagement',
  components: {
    ElSelectWrapper,
    ElButtonWrapper,
    ElTableWrapper
  },
  mixins: [autoTableHeight],
  data () {
    return {
      date: [],
      docTypeList: [],
      limitArr: [
        {
          value: '动车'
        },
        {
          value: '客车'
        },
        {
          value: '货车'
        }
      ],
      fileType: '1',
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
      isAdd: false,
      isLoading: false,
      isExporting: false,
      selectionIds: [],
      list: [],
      refineArr: [],
      treeInfoVisible: false,
      isLoadingTreeInfo: false,
      treeInfoPagination: {
        pageNo: 1,
        pageSize: 20,
        totalRecords: 0
      },
      treeInfoList: [],
      docStatusList: []
    }
  },
  watch: {
    $route: {
      handler: 'getList',
      immediate: true
    }
  },
  async created () {
    console.log(this.$route.query)
    await this.getCommonData()
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

    async viewFileTreeInfo (row) {
      this.treeInfoVisible = true
      await this.getTreeInfoData(row.id)
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
</style>
