<template>
  <div class="app-container">
    <div>
      <el-form :inline="true" :model="query">
        <el-form-item label="工作事项">
          <el-input v-model.trim="query.workItem" clearable />
        </el-form-item>
        <el-form-item label="创建日期">
          <el-date-picker-wrapper v-model="time" type="daterange" clearable />
        </el-form-item>
        <el-form-item>
          <el-button-wrapper icon="el-icon-close" @click="resetQuery">清空</el-button-wrapper>
          <el-button-wrapper type="primary" icon="el-icon-search" :loading="isLoading" @click="doSearch">查询</el-button-wrapper>
          <el-button-wrapper type="success" icon="el-icon-plus" @click="doAdd">添加</el-button-wrapper>
          <el-button-wrapper type="danger" icon="el-icon-delete" @click="doDelete">批量删除</el-button-wrapper>
          <el-button-wrapper icon="el-icon-date" @click="generateReport('WEEK')">生成周小结</el-button-wrapper>
          <el-button-wrapper icon="el-icon-notebook-2" @click="generateReport('MONTH')">生成月小结</el-button-wrapper>
          <el-button type="warning" icon="el-icon-download" :loading="isExporting" @click="doExport">导出</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table-wrapper v-loading="isLoading" :data="list" class="mb-20" row-key="id" :span-method="mergeCol" @selection-change="selectionChange">
      <el-table-column align="center" type="selection" />
      <el-table-column align="center" type="index" label="序号" />
      <el-table-column align="center" label="发起人" prop="planByName" width="140" />
      <el-table-column align="center" label="创建日期" prop="createTime" width="120" :formatter="(row) => formatTimeMixin(row.createTime, 'yyyy-MM-dd')" />
      <el-table-column align="center" label="分类" prop="categoryName" width="140">
        <template slot-scope="{ row: workItem }">
          <el-input v-if="workItem.editable" v-model="workItem.category" clearable />
          <span v-else>{{ workItem.category }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="工作事项" prop="workItem" width="260">
        <template slot-scope="{ row: workItem }">
          <el-input v-if="workItem.editable" v-model="workItem.workItem" type="textarea" :autosize="{ minRows: 1, maxRows: 3 }" clearable />
          <span v-else>{{ workItem.workItem }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="{ row: workItem }">
          <operations-wrapper :btn-count="3">
            <el-button-wrapper type="text" icon="el-icon-plus" @click="doAddWorkItem(workItem)">添加</el-button-wrapper>
            <el-button-wrapper v-if="!workItem.editable" class="ml-0" type="text" icon="el-icon-edit" @click="doEditWorkItem(workItem)">编辑</el-button-wrapper>
            <el-button-wrapper v-if="workItem.editable" type="text" icon="el-icon-check" @click="doSaveEditWorkItem(workItem)">保存编辑</el-button-wrapper>
            <el-button-wrapper v-if="workItem.editable" type="text" icon="el-icon-close" @click="doCancelEditWorkItem(workItem)">取消编辑</el-button-wrapper>
            <el-button-wrapper type="text" icon="el-icon-minus" @click="doRemoveWorkItem(workItem)">删除</el-button-wrapper>
          </operations-wrapper>
        </template>
      </el-table-column>
      <el-table-column align="center" label="工作内容及要求" class-name="merged-column" width="250">
        <template slot-scope="{ row: workItem }">
          <el-table :show-header="false" :border="false" row-key="id" :data="workItem.workContents">
            <el-table-column align="center" label="工作内容及要求" prop="workContent" width="250">
              <template slot-scope="{ row: workContent, $index }">
                <div class="flex items-center">
                  <div class="mr-1"><el-tag>{{ $index + 1 }}</el-tag></div>
                  <el-input v-if="workContent.editable" v-model="workContent.workContent" type="textarea" :autosize="{ minRows: 1, maxRows: 1 }" />
                  <span v-else>{{ workContent.workContent }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="完成期限" prop="deadline" width="140">
              <template slot-scope="{ row: workContent }">
                <el-date-picker-wrapper v-if="workContent.editable" v-model="workContent.deadline" />
                <span v-else>{{ formatTimeMixin(workContent.deadline, 'yyyy-MM-dd') }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="工作进度" prop="workProcess" width="160">
              <template slot-scope="{ row: workContent }">
                <el-input v-if="workContent.editable" v-model="workContent.workProcess" />
                <span v-else>{{ workContent.workProcess }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="责任班组" prop="responseUserDeptName" width="140" />
            <el-table-column align="center" label="责任人" prop="responseUserName" width="140">
              <template slot-scope="{ row: workContent }">
                <user-selector v-if="workContent.editable" v-model="workContent.responseUserId" :init-val="workContent.responseUserName" @selected-item="(val) => handleSelect(val, workContent)" />
                <span v-else>{{ workContent.responseUserName }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="是否销号" prop="finishStatus" width="100">
              <template slot-scope="{ row: workContent }">
                <div>
                  <span class="text-xs">{{ formatTextMixin(enums.boolNumList, workContent.finishStatus) }}</span>
                  <span v-if="workContent.finishStatus === 0" class="ml-2 text-xs cursor-pointer text-red-500 hover:text-red-400" @click="finishWork(workContent)"><i class="el-icon-brush" />销号</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="{ row: workContent }">
                <operations-wrapper :btn-count="1">
                  <!--<el-button-wrapper type="text" icon="el-icon-plus" @click="doAddWorkContent(workItem, workContent, $index)">添加</el-button-wrapper>-->
                  <el-button-wrapper v-if="!workContent.editable" type="text" icon="el-icon-edit" @click="doEditWorkContent(workItem, workContent)">编辑</el-button-wrapper>
                  <el-button-wrapper v-if="workContent.editable" type="text" icon="el-icon-check" @click="doSaveEditWorkContent(workContent)">保存编辑</el-button-wrapper>
                  <el-button-wrapper v-if="workContent.editable" type="text" icon="el-icon-close" @click="doCancelEditWorkContent(workContent)">取消编辑</el-button-wrapper>
                  <el-button-wrapper type="text" icon="el-icon-minus" @click="doRemoveWorkContent(workItem, workContent)">删除</el-button-wrapper>
                  <el-button-wrapper type="text" icon="el-icon-guide" @click="handleOperate(workItem, staticMapper.URGENT[0])">{{ staticMapper.URGENT[1] }}</el-button-wrapper>
                  <el-button-wrapper v-if="workContent.canPush" type="text" icon="el-icon-s-promotion" @click="handleOperate(workItem, staticMapper.PUSH[0])">{{ staticMapper.PUSH[1] }}</el-button-wrapper>
                  <el-button-wrapper v-if="workContent.canRevoke" type="text" icon="el-icon-refresh-left" @click="handleOperate(workItem, staticMapper.REVOKE[0])">{{ staticMapper.REVOKE[1] }}</el-button-wrapper>
                  <el-button-wrapper v-if="workContent.canPushBack" type="text" icon="el-icon-d-arrow-left" @click="handleOperate(workItem, staticMapper.PUSHBACK[0])">{{ staticMapper.PUSHBACK[1] }}</el-button-wrapper>
                  <el-button-wrapper type="text" icon="el-icon-d-arrow-right" @click="handleOperate(workItem, staticMapper.PUSHDEPT[0])">{{ staticMapper.PUSHDEPT[1] }}</el-button-wrapper>
                </operations-wrapper>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column align="center" label="完成期限" prop="deadline" width="140" />
      <el-table-column align="center" label="工作进度" prop="workProcess" width="160" />
      <el-table-column align="center" label="责任班组" prop="responseUserDeptName" width="140" />
      <el-table-column align="center" label="责任人" prop="responseUserName" width="140" />
      <el-table-column align="center" label="是否销号" prop="finishStatus" width="100" />
      <el-table-column align="center" label="操作" />
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

    <el-dialog
      width="70%"
      title="添加"
      :visible.sync="detailDialogVisible"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div>
        <detail @add-result="handleAddResult" />
      </div>
    </el-dialog>

    <el-dialog
      width="70%"
      center
      :visible.sync="summaryDialogVisible"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div v-loading="isLoadingWorkSummary">
        <brief-summary :type="summaryType" :detail="workSummaryModel" />

        <div slot="footer" class="flex items-center justify-center">
          <el-button size="medium" type="primary" @click="doSaveWorkSummary">保存</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import { getWeekOfMonth } from 'date-fns'
import { mapState } from 'vuex'

import ElButtonWrapper from '@/components/ElButtonWrapper'
import ElDatePickerWrapper from '@/components/ElDatePickerWrapper'
import OperationsWrapper from '@/components/OperationsWrapper'
import UserSelector from '@/components/UserSelector'
import BriefSummary from '@/views/personal-work/brief-summary'
import {
  getList,
  modifyItem,
  deleteItem,
  addWorkContent,
  modifyWorkContent,
  pushWorkContent,
  cancelWorkContent,
  urgentWorkContent,
  revokeWorkContent,
  saveWorkSummary,
  generateWorkSummary,
  pushBackWorkContent,
  pushToDepartmentWorkContent,
  exportData
} from '@/views/department-work/api'
import { mapper as staticMapper } from '@/views/department-work/const'
import { downFileStream } from '@/utils'
import Detail from './detail'
import ElTableWrapper from '@/components/ElTableWrapper'

const planType = 'PSN'

export default {
  name: 'PersonWork',
  components: {
    ElTableWrapper,
    ElDatePickerWrapper,
    ElButtonWrapper,
    OperationsWrapper,
    UserSelector,
    BriefSummary,
    Detail
  },
  data () {
    return {
      staticMapper,
      time: [],
      selectionIds: [],
      query: {
        planBy: null,
        planByName: null,
        workItem: null,
        createTime: null,
        planType: planType,
        planByUnit: null,
        planByDept: null,
        planByBZ: null,
        planDateStart: null,
        planDateEnd: null
      },
      defaultQuery: {
        planBy: null,
        planByName: null,
        workItem: null,
        createTime: null,
        planType: planType,
        planByUnit: null,
        planByDept: null,
        planByBZ: null,
        planDateStart: null,
        planDateEnd: null
      },
      pagination: {
        pageNo: 1,
        pageSize: 20,
        totalRecords: 0
      },
      isLoading: false,
      isExporting: false,
      isLoadingWorkSummary: false,
      list: [],
      summaryType: null,
      summaryDialogVisible: false,
      detailDialogVisible: false,
      workSummaryModel: {
        conclusionPeriod: null,
        conclusionPeriodType: null,
        conclusionType: null,
        content: null,
        createBy: null,
        createTime: null,
        deleted: null,
        id: null,
        ownerDept: null,
        ownerId: null,
        remark: null,
        title: null,
        updateBy: null,
        updateTime: null,
        periodStartDate: null,
        workPlanIds: [],
        week: null
      },
      defaultWorkSummaryModel: {
        conclusionPeriod: null,
        conclusionPeriodType: null,
        conclusionType: null,
        content: null,
        createBy: null,
        createTime: null,
        deleted: null,
        id: null,
        ownerDept: null,
        ownerId: null,
        remark: null,
        title: null,
        updateBy: null,
        updateTime: null,
        periodStartDate: null,
        workPlanIds: [],
        week: null
      },
      oldWorkItem: {},
      oldWorkContent: {}
    }
  },
  computed: {
    ...mapState(['enums'])
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
      const query = cloneDeep({ ...this.query, ...this.pagination })
      if (this.time) {
        const [start, end] = this.time
        query.planDateStart = start
        query.planDateEnd = end
      }
      const { data } = await getList(query).finally(() => {
        this.isLoading = false
      })
      this.list = data?.list.map(l => {
        l.workContents = l.workContents.map(w => {
          return {
            ...w,
            editable: false // 编辑状态
          }
        })
        return {
          ...l,
          editable: false // 编辑状态
        }
      })
      this.pagination = data?.pageReq
    },

    handleAddResult (v) {
      this.detailDialogVisible = !v.done
      v.done && this.getList()
    },

    toggleEditable (row) {
      row.editable = !row.editable
    },

    doAddWorkItem (workItem) {
      const data = {
        editable: true,
        canPush: true,
        canRevoke: true,
        contentType: null,
        createBy: null,
        createTime: null,
        curResponseUserDept: null,
        curResponseUserId: null,
        deadline: new Date().getTime(),
        deleted: 0,
        emerStatus: null,
        finishStatus: 0,
        id: null,
        ownerDept: null,
        ownerId: null,
        planType: planType,
        remark: null,
        responseUserDeptName: null,
        responseUserId: null,
        responseUserName: null,
        seq: 1,
        statusUpdateTime: null,
        updateBy: null,
        updateTime: null,
        userPushToDept: null,
        workContent: `工作事项`,
        workPlanId: workItem?.id,
        workProcess: null
      }

      workItem.workContents.push(data)
    },

    doEditWorkItem (workItem) {
      workItem.editable = true
      this.oldWorkItem = cloneDeep(workItem)
    },

    async doSaveEditWorkItem (workItem) {
      await this.saveWorkItem(workItem)
      workItem.editable = false
    },

    doCancelEditWorkItem (workItem) {
      const old = cloneDeep(this.oldWorkItem)
      workItem.category = old.category
      workItem.workItem = old.workItem
      workItem.editable = false
    },

    doRemoveWorkItem (workItem) {
      this.$confirm(`确认删除工作事项：【${workItem.workItem}】？`, '提醒', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.isLoading = true
        await deleteItem(workItem.id).finally(() => {
          this.isLoading = false
        })
        this.$message.success('删除成功')
        await this.getList()
      }).catch(() => {})
    },

    async doAddWorkContent (workItem, workContent, $index) {
      const data = {
        canPush: true,
        canRevoke: true,
        canPushBack: true,
        contentType: null,
        createBy: null,
        createTime: null,
        curResponseUserDept: null,
        curResponseUserId: null,
        deadline: new Date().getTime(),
        deleted: 0,
        emerStatus: null,
        finishStatus: 0,
        id: null,
        ownerDept: null,
        ownerId: null,
        planType: planType,
        remark: null,
        responseUserDeptName: null,
        responseUserId: null,
        responseUserName: null,
        seq: 1,
        statusUpdateTime: null,
        updateBy: null,
        updateTime: null,
        userPushToDept: null,
        workContent: `工作事项${$index + 1}`,
        workPlanId: workItem?.id,
        workProcess: null
      }
      workItem.workContents.splice($index + 1, 0, data)
    },

    doEditWorkContent (workItem, workContent) {
      this.oldWorkContent = cloneDeep(workContent)
      workContent.editable = true
    },

    async doSaveEditWorkContent (workContent) {
      await this.saveWorkContent(workContent)
      workContent.editable = true
    },

    doCancelEditWorkContent (workContent) {
      const old = cloneDeep(this.oldWorkContent)
      workContent.workContent = old.workContent
      workContent.deadline = old.deadline
      workContent.workProcess = old.workProcess
      workContent.responseUserDeptName = old.responseUserDeptName
      workContent.responseUserName = old.responseUserName
      workContent.responseUserId = old.responseUserId
      workContent.editable = false
    },

    doRemoveWorkContent (workItem, index) {
      if (workItem.workContents.length <= 1) {
        return
      }
      workItem.workContents.splice(index, 1)
    },

    async handleOperate (workItem, key) {
      const mapperFn = {
        [staticMapper.URGENT[0]]: urgentWorkContent,
        [staticMapper.PUSH[0]]: pushWorkContent,
        [staticMapper.REVOKE[0]]: revokeWorkContent,
        [staticMapper.PUSHBACK[0]]: pushBackWorkContent,
        [staticMapper.PUSHDEPT[0]]: pushToDepartmentWorkContent
      }

      const fn = mapperFn[key]
      await fn({
        id: workItem.id,
        finishStatus: 1, // 1-已销号
        emerStatus: 1
      })
      this.$message.success(`${[staticMapper[key][1]]}成功`)
      await this.getList()
    },

    handleSelect (val, workContent) {
      this.$set(workContent, 'responseUserDeptName', val?.departmentModel?.departmentName)
    },

    mergeCol ({ columnIndex }) {
      if (columnIndex === 7) {
        return [1, 7]
      }
    },

    handleCurrentChange (pageNo) {
      this.pagination.pageNo = pageNo
      this.getList()
    },

    handleSizeChange (pageSize) {
      this.pagination.pageSize = pageSize
      this.getList()
    },

    resetQuery () {
      this.query = cloneDeep(this.defaultQuery)
      this.time = []
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
      this.$message.success('导出成功')
      downFileStream(res)
    },

    selectionChange (val) {
      this.selectionIds = val.map(i => i.id)
    },

    doAdd () {
      this.detailDialogVisible = true
      // this.$router.push({
      //   name: 'PersonWorkCreate'
      // })
    },

    doDelete () {
      if (!this.selectionIds.length) {
        this.$message.info('请先选择数据')
        return
      }
      this.$confirm(`确认删除？`, '提醒', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.isLoading = true
        await Promise.all(this.selectionIds.map(id => deleteItem(id))).finally(() => {
          this.isLoading = false
        })
        this.$message.success('删除成功')
        await this.getList()
      }).catch(() => {})
    },

    async saveWorkItem (workItem) {
      this.isLoading = true
      await modifyItem(workItem).finally(() => {
        this.isLoading = false
      })
      this.$message.success('保存成功')
      await this.getList()
    },

    async saveWorkContent (workContent) {
      if (!workContent.responseUserId) {
        this.$message.info('请选择责任人')
        return
      }
      this.isLoading = true
      const fn = workContent.id ? modifyWorkContent : addWorkContent
      await fn(workContent).finally(() => {
        this.isLoading = false
      })
      this.$message.success('保存成功')
      await this.getList()
    },

    async generateReport (type) {
      if (!this.selectionIds.length) {
        this.$message.info('请先选择数据')
        return
      }
      this.workSummaryModel = cloneDeep(this.defaultWorkSummaryModel)
      this.summaryType = type
      this.summaryDialogVisible = true
      const params = {
        conclusionType: planType,
        periodType: type,
        workPlanIds: this.selectionIds?.toString()
      }
      this.isLoadingWorkSummary = true
      const { data } = await generateWorkSummary(params).finally(() => {
        this.isLoadingWorkSummary = false
      })
      data && (data.content = data.content?.replace(/\r?\n|\r/g, '<br />'))
      data && (data.week = 'W' + getWeekOfMonth(new Date(data?.periodStartDate)))
      this.workSummaryModel = data
    },

    async doSaveWorkSummary () {
      const data = cloneDeep(this.workSummaryModel)
      const month = this.formatTimeMixin(new Date(data.periodStartDate), 'yyyy\'M\'MM')
      data.conclusionPeriod = data.conclusionPeriodType === this.staticMapper.WEEK[0] ? month + data.week : month

      await saveWorkSummary(data)
      this.$message.success('保存成功')
      this.summaryDialogVisible = false
    },

    async finishWork (workContent) {
      if (workContent.finishStatus === 0) {
        this.$confirm(`确认销号 【${workContent.workContent}】？`, '提醒', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          workContent.finishStatus = 1
          await cancelWorkContent(workContent)
          this.$message.success('销号成功')
          await this.getList()
        }).catch(() => {})
      }
    }
  }
}
</script>

<style>
.merged-column .el-table .cell, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell {
  padding: 0 !important;
}

.merged-column .cell {
  @apply p-0 max-h-36 overflow-auto;
}
</style>
