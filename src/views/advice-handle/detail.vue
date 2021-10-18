<template>
  <detail-skeleton>
    <el-form ref="form" :model="model" :rules="rules" label-width="100px">
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
            <el-form-item label="提报单位" prop="reportDept">
              <el-input v-model="model.reportDept" clearable />
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="8">
            <el-form-item label="提报部门" prop="reportUnit">
              <el-input v-model="model.reportUnit" clearable />
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="8">
            <el-form-item label="发文部门" prop="reportDept">
              <el-input v-model="model.reportDept" clearable />
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="8">
            <el-form-item label="提报时间" prop="time">
              <el-date-picker v-model="model.time" class="full-width" clearable />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <el-card shadow="hover" class="mb-2">
        <el-row>
          <el-col :span="24">
            <el-form-item label="修改意见" prop="remark">
              <el-input v-model="model.remark" type="textarea" :autosize="{ minRows: 4, maxRows: 8 }" maxlength="300" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <el-card shadow="hover" class="mb-2">
        <el-row>
          <el-col :span="24">
            <el-form-item label="处理意见" prop="handleRemark">
              <el-input v-model="model.handleRemark" type="textarea" :autosize="{ minRows: 4, maxRows: 8 }" maxlength="300" show-word-limit clearable />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
    </el-form>

    <template #footer>
      <el-button type="primary" icon="el-icon-edit-outline" size="medium">保存</el-button>
      <el-button type="danger" icon="el-icon-close" size="medium">不采纳</el-button>
      <el-button type="success" icon="el-icon-check" size="medium">采纳</el-button>
      <el-button icon="el-icon-back" size="medium" @click="goToList">返回列表</el-button>
    </template>
  </detail-skeleton>
</template>

<script>
import DetailSkeleton from '@/components/DetailSkeleton'

export default {
  name: 'AdviceDetailHandle',
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
    goToList () {
      this.$router.push({
        name: 'AdviceHandle'
      })
    }
  }
}
</script>

<style scoped>

</style>
