<template>
  <div class="m-2">
    <el-form ref="form" :model="model" :rules="rules" label-width="100px">
      <el-row>
        <el-col :md="12" :lg="8">
          <el-form-item label="分类" prop="category">
            <el-input v-model="model.category" />
          </el-form-item>
        </el-col>
        <el-col :md="12" :lg="8">
          <el-form-item label="计划日期" prop="planDate">
            <el-date-picker-wrapper v-model="model.planDate" />
          </el-form-item>
        </el-col>
        <el-col :md="12" :lg="8">
          <el-form-item label="工作事项" prop="workItem">
            <el-input v-model="model.workItem" />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-card shadow="hover">
            <div slot="header">工作内容</div>
            <el-table-wrapper :data="model.workContents" border stripe>
              <el-table-column align="center" label="工作内容" prop="workContent">
                <template slot-scope="{ row }">
                  <el-input v-model="row.workContent" type="textarea" :autosize="{ minRows: 1, maxRows: 4 }" />
                </template>
              </el-table-column>
              <el-table-column align="center" label="完成期限" prop="deadline">
                <template slot-scope="{ row }">
                  <el-date-picker-wrapper v-model="row.deadline" />
                </template>
              </el-table-column>
              <el-table-column align="center" label="工作进度" prop="workProcess">
                <template slot-scope="{ row }">
                  <el-input v-model="row.workProcess" clearable />
                </template>
              </el-table-column>
              <el-table-column align="center" label="责任班组" prop="responseUserDeptName" />
              <el-table-column align="center" label="责任人" prop="responseUserId">
                <template slot-scope="{ row }">
                  <user-selector v-model="row.responseUserId" class="w-full" @selected-item="(val) => handleSelect(val, row)" />
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" width="100">
                <template slot="header" slot-scope="{ row }">
                  <el-link type="primary" class="mr-10 font-12" @click="doAddWorkContent(row)"><i class="el-icon-plus" />添加</el-link>
                </template>
                <template slot-scope="{ $index }">
                  <el-link type="danger" class="mr-10 font-12" @click="doRemoveWorkContent($index)"><i class="el-icon-delete" />删除</el-link>
                </template>
              </el-table-column>
            </el-table-wrapper>
          </el-card>
        </el-col>
      </el-row>
    </el-form>

    <div class="flex items-center justify-center mt-2">
      <el-button type="primary" icon="el-icon-edit-outline" size="medium" @click="doSave">保存</el-button>
    <!--<el-button icon="el-icon-back" size="medium" @click="goToList">返回列表</el-button>-->
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import { getItem, addItem, modifyItem } from './api'
import UserSelector from '@/components/UserSelector'
import ElDatePickerWrapper from '@/components/ElDatePickerWrapper'
import ElTableWrapper from '@/components/ElTableWrapper'

import { mapper } from '@/views/department-work/const'

const planType = mapper.PSN[0]

export default {
  name: 'PersonWorkDetail',
  components: { ElDatePickerWrapper, UserSelector, ElTableWrapper },
  // eslint-disable-next-line vue/require-prop-types
  props: ['id'],
  data () {
    return {
      isLoading: false,
      isSaving: false,
      model: {
        category: null,
        id: null,
        planDate: new Date(),
        planType: planType,
        workContents: [
          {
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
            workContent: `工作事项`,
            workPlanId: null,
            workProcess: '0'
          }
        ],
        workItem: null
      },
      rules: {
        category: [{ required: true, message: '不能为空', trigger: 'blur' }],
        planDate: [{ required: true, message: '不能为空', trigger: 'blur' }],
        workItem: [{ required: true, message: '不能为空', trigger: 'blur' }]
      }
    }
  },
  watch: {
    id: {
      handler: function (val) {
        if (val) {
          this.getItemData(val)
        }
      },
      immediate: true
    }
  },
  methods: {
    async getItemData (id) {
      const { data } = await getItem(id)
      this.model = data
    },

    doAddWorkContent () {
      const workContent = {
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
        remark: '测试数据',
        responseUserDeptName: null,
        responseUserId: null,
        responseUserName: null,
        seq: 1,
        statusUpdateTime: null,
        updateBy: null,
        updateTime: null,
        userPushToDept: null,
        workContent: '工作事项1',
        workPlanId: this.model.id,
        workProcess: '0'
      }
      this.model.workContents.push(workContent)
    },

    doRemoveWorkContent (index) {
      this.model.workContents.splice(index, 1)
    },

    handleSelect (val, row) {
      this.$set(row, 'responseUserDeptName', val?.departmentModel?.departmentName)
    },

    doSave () {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          const data = cloneDeep(this.model)
          this.isSaving = true
          const fn = this.model.id ? modifyItem : addItem
          this.isSaving = true
          try {
            await fn(data).finally(() => {
              this.isSaving = false
            })
            this.$message.success('保存成功')
            this.emitData(true)
          } catch (e) {
            this.emitData(false)
          }
        }
      })
    },

    emitData (status = true) {
      this.$emit('add-result', { done: status })
    },

    goToList () {
      this.$router.push({
        name: 'PersonalWork'
      })
    }
  }
}
</script>

<style scoped>

</style>
