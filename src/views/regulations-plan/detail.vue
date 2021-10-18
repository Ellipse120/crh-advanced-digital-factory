<template>
  <detail-skeleton>
    <el-form ref="form" label-width="100px">
      <el-card shadow="hover" class="mb-2">
        <el-row :model="model" :rules="rules">
          <el-col :md="12" :lg="8">
            <el-form-item label="制度单位" prop="x">
              <el-input v-model="model.x" />
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="8">
            <el-form-item label="制定部门" prop="reportDept">
              <el-input v-model="model.x">
                <el-link slot="append">查看</el-link>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="8">
            <el-form-item label="制定人" prop="reportDept">
              <el-input v-model="model.reportDept" clearable />
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="8">
            <el-form-item label="对规文种" prop="reportUnit">
              <el-input v-model="model.reportUnit" clearable />
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="8">
            <el-form-item label="发文单位" prop="reportDept">
              <el-input v-model="model.reportDept" clearable />
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="8">
            <el-form-item label="发文部门" prop="time">
              <el-date-picker v-model="model.time" class="full-width" clearable />
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="8">
            <el-form-item label="年度" prop="time">
              <el-date-picker v-model="model.time" type="year" class="full-width" clearable />
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="8">
            <el-form-item label="月度" prop="time">
              <el-date-picker v-model="model.time" type="month" class="full-width" clearable />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <el-card shadow="hover" class="mb-2">
        <el-row>
          <el-col :md="24" :lg="16">
            <el-form-item label="文件名称" prop="x">
              <el-input v-model="model.x" />
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="8">
            <el-form-item label="文号" prop="x">
              <el-input v-model="model.x">
                <el-link slot="append">查看</el-link>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="8">
            <el-form-item label="文种" prop="x">
              <el-input v-model="model.x" />
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="8">
            <el-form-item label="对规时间" prop="x">
              <el-input v-model="model.x" />
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="8">
            <el-form-item label="对规部门" prop="x">
              <el-input v-model="model.x" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="问题录入" prop="handleRemark">
              <el-input v-model="model.handleRemark" clearable>
                <el-button slot="append" @click="goTo">问题录入</el-button>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
    </el-form>

    <template #footer>
      <el-button type="success" icon="el-icon-edit-outline" size="medium">提交</el-button>
      <el-button icon="el-icon-back" size="medium" @click="goToList">返回列表</el-button>
    </template>
  </detail-skeleton>
</template>

<script>
import DetailSkeleton from '@/components/DetailSkeleton'

export default {
  name: 'RegulationsPlanDetail',
  components: {
    DetailSkeleton
  },
  data () {
    return {
      isLoading: false,
      model: {
        x: null,
        reportDept: null,
        reportUnit: null,
        handleRemark: null,
        remark: null,
        time: new Date()
      },
      rules: {}
    }
  },
  methods: {
    goTo () {
      this.$router.push({
        name: 'ProblemWarehouse'
      })
    },

    goToList () {
      this.$router.push({
        name: 'RegulationsPlan'
      })
    }
  }
}
</script>

<style scoped>

</style>
