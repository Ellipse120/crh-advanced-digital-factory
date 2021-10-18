<template>
  <detail-skeleton>
    <el-form ref="form" :v-loading="isLoading" :model="model" :rules="rules" label-width="160px">
      <el-row>
        <el-col :span="12" label="征求单位">
          <el-form-item label="征求单位" prop="requestDept">
            <el-cascader-wrapper v-model="model.requestDept" :options="optionsOrganization" :props="{value: 'id', label: 'value', checkStrictly: true}" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="文件名称" prop="rfcDocName">
            <el-input v-model="model.rfcDocName" clearable placeholder="文件名称" title="文件名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="附件" prop="fileList">
            <el-upload class="inline-block mr-5" accept=".doc, .docx, .pdf" :on-remove="(file, fileList) => removeFile(file, fileList, 'attachFileModels')" action="" :http-request="() => customUpload('attachFileModels')" :on-change="onFileChange">
              <el-button type="success">上传附件</el-button>
              <span class="ml-5 upload-note align-top">支持格式：.rar, .zip, .doc, .docx, .pdf，单个文件不能超过20MB</span>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="已上传附件" prop="attachFileModels">
            <p v-for="i in model['attachFileModels']" :key="i.idx">
              <el-link type="primary">{{ i.fileName }}</el-link>
            </p>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="有关要求" prop="operationCode">
            <el-input v-model="model.requirement" :rows="8" type="textarea" clearable placeholder="有关要求" title="有关要求" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="截止时间" prop="operationCode">
            <!--            <el-input v-model="model.operationCode" clearable placeholder="截止时间" title="截止时间" />-->
            <el-date-picker v-model="model.deadline" type="date" placeholder="截止时间" title="截止时间" class="full-width" />
          </el-form-item>
        </el-col>
        <el-col :span="8" label="发布单位">
          <el-form-item label="发布单位" prop="requestDept">
            <el-cascader-wrapper v-model="model.publishDept" disabled :options="optionsOrganization" :props="{value: 'id', label: 'value', checkStrictly: true}" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发布人" prop="operationCode">
            <el-input v-model="model.createBy" clearable placeholder="发布人" title="发布人" disabled />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button type="primary" icon="el-icon-edit-outline" size="medium" @click="onSubmit">保存</el-button>
      <!--      <el-button type="primary" icon="el-icon-edit-outline" size="medium" @click="onConsole">测试</el-button>-->
      <el-button icon="el-icon-back" size="medium" @click="goToList">返回列表</el-button>
    </template>

  </detail-skeleton>
</template>

<script>
import { getToken } from '@/utils/auth'
import DetailSkeleton from '@/components/DetailSkeleton'
import ElCascaderWrapper from '@/components/ElCascaderWrapper'
import { addDetail, getDetail, putDetail } from './api'
import { importData } from '@/views/file-add/api'
import { mapGetters } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'CommentAdd',
  components: { DetailSkeleton, ElCascaderWrapper },
  data () {
    return {
      isAdd: false,
      isLoading: false,
      model: {
        requestDept: 'GT',
        publishDept: 'SHJ',
        deadline: new Date().getTime()
      },
      loginName: null,
      rules: {},
      fileList: [],
      selectionIds: [],
      uploadUrl: `${process.env.VUE_APP_BASE_API}/crew/file/batchUpload`,
      withTokenHeader: {
        Authorization: getToken()
      },
      tempIndex: null,
      file: []
    }
  },
  computed: {
    ...mapGetters(['allOrganizations', 'userInfo']),
    optionsOrganization () {
      return this.allOrganizations.treeData
    },
    isEdit () {
      const { params: { id }} = this.$route
      return !!id
    }
  },
  created () {
    const { params: { id }} = this.$route
    if (id) {
      this.initBackView(id)
    } else {
      console.log(this.userInfo)
      this.model.publishDept = this.userInfo.departmentCode
      this.model.createBy = this.userInfo.loginName
    }
    console.log(this.userInfo)
  },
  methods: {
    onFileChange (file) {
      this.file = file
    },

    async initBackView (id) {
      const { data } = await getDetail(id)
      const { requestDeptInfo } = data
      this.model = data
      this.model.requestDept = this.setCascaderOrganizate(requestDeptInfo)
    },

    setCascaderOrganizate (data) {
      const { parentCode, parentBMCode, parentCJCode } = data
      const depart = []
      parentCode && depart.push(parentCode)
      parentBMCode && depart.push(parentBMCode)
      parentCJCode && depart.push(parentCJCode)
      return depart
    },

    removeFile (file, fileList) {
      // this.model[listIdx] = this.model[listIdx].filter(i => i !== file.id)
    },

    async customUpload (listIdx) {
      const formData = new FormData()
      formData.append('files', this.file.raw)
      formData.append('module', 'docmgmt')
      const { data } = await importData(formData)
      if (!Array.isArray(this.model[listIdx])) {
        this.model[listIdx] = []
      }
      this.model[listIdx].push(data[0])
      this.$message.success('上传成功')
    },

    async onSubmit () {
      const model = cloneDeep(this.model)
      model.requestDept = model.requestDept.pop()
      model.attachFileIds = model.attachFileModels?.map(i => i.id)
      let messageStr = ''
      if (this.isEdit) {
        await putDetail(model)
        messageStr = '修改征求意见成功'
      } else {
        await addDetail(model)
        messageStr = '添加征求意见成功'
      }
      this.$message({
        message: messageStr,
        type: 'success',
        duration: 1000,
        onClose: () => {
          this.$router.push({ name: 'TakeAdvice' })
        }
      })
    },

    onConsole () {
      const model = cloneDeep(this.model)
      console.log(model)
    },

    goToList () {
      this.$router.push({
        name: 'TakeAdvice'
      })
    },

    doUpload () {

    },

    delFile (type, index) {

    }

  }
}
</script>

<style lang="scss" scoped>
.upload-note {
  color: #a7a3a3
}
</style>
