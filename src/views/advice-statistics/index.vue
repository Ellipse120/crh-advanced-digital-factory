<template>
  <div class="app-container">
    <div>
      <el-form :inline="true" :model="query">
        <el-form-item label="制定单位">
          <el-input v-model.trim="query.supNumber" placeholder="制定单位" clearable />
        </el-form-item>
        <el-form-item label="制定部门">
          <el-input v-model.trim="query.supervisorName" placeholder="制定部门" clearable />
        </el-form-item>
        <el-form-item label="文种">
          <el-input v-model.trim="query.supervisorName" placeholder="文种" clearable />
        </el-form-item>
        <el-form-item label="文件名">
          <el-input v-model.trim="query.supervisorName" placeholder="文件名" clearable />
        </el-form-item>
        <el-form-item label="文名">
          <el-input v-model.trim="query.supervisorName" placeholder="文名" clearable />
        </el-form-item>
        <el-form-item label="发文时间">
          <el-date-picker v-model="query.supervisorName" type="datetime" placeholder="发文时间" clearable />
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-close" @click="resetQuery">清空</el-button>
          <el-button type="primary" icon="el-icon-search" :loading="isLoading" @click="doSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table-wrapper v-loading="isLoading" :data="list" class="mb-20">
      <el-table-column align="center" type="index" label="序号" />
      <el-table-column align="center" label="制定单位" prop="formulateUnit" />
      <el-table-column align="center" label="制定部门" prop="formulateDepart" />
      <el-table-column align="center" label="文种" prop="fileType" />
      <el-table-column align="center" label="意见条数" prop="ideaCount" />
      <el-table-column align="center" label="采纳条数" prop="adoptCount" />
    </el-table-wrapper>

    <el-pagination
      :current-page="pagination.pageNo"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pagination.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.totalRecords"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script>
import ElTableWrapper from '@/components/ElTableWrapper'

export default {
  name: 'DepartmentWork',
  components: {
    ElTableWrapper
  },
  data () {
    return {
      date: null,
      query: {
        supNumber: null,
        supervisorName: null,
        isSubmit: null
      },
      enums: {
        statustypeList: []
      },
      pagination: {
        pageNo: 1,
        pageSize: 20,
        totalRecords: 0
      },
      isLoading: false,
      list: [],
      tempList: [
        { formulateUnit: '上海段', formulateDepart: '技术科', fileType: '技术规章', ideaCount: '8', adoptCount: '3' },
        { formulateUnit: '上海段', formulateDepart: '技术科', fileType: '技术规章', ideaCount: '8', adoptCount: '3' },
        { formulateUnit: '上海段', formulateDepart: '技术科', fileType: '技术规章', ideaCount: '8', adoptCount: '3' },
        { formulateUnit: '上海段', formulateDepart: '技术科', fileType: '技术规章', ideaCount: '8', adoptCount: '3' },
        { formulateUnit: '上海段', formulateDepart: '技术科', fileType: '技术规章', ideaCount: '8', adoptCount: '3' },
        { formulateUnit: '上海段', formulateDepart: '技术科', fileType: '技术规章', ideaCount: '8', adoptCount: '3' },
        { formulateUnit: '上海段', formulateDepart: '技术科', fileType: '技术规章', ideaCount: '8', adoptCount: '3' },
        { formulateUnit: '上海段', formulateDepart: '技术科', fileType: '技术规章', ideaCount: '8', adoptCount: '3' }
      ]
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

    handleCurrentChange (pageNo) {
      this.pagination.pageNo = pageNo
      this.getList()
    },

    handleSizeChange (pageSize) {
      this.pagination.pageSize = pageSize
      this.getList()
    },

    getList () {
      this.isLoading = true
      setTimeout(() => {
        this.isLoading = false
        this.list = this.tempList
      }, 1000)
    },

    resetQuery () {}
  }
}
</script>

<style scoped>

</style>
