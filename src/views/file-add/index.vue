<template>
  <detail-skeleton>
    <div v-loading="isLoading" class="height">
      <el-form ref="form" :model="model" :rules="rules" label-width="160px">
        <el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="文种" prop="docType">
                <el-select v-model="model.docType" class="full-width" placeholder="请选择" title="文种" clearable filterable>
                  <el-option v-for="item in docTypeList" :key="item.key" :value="item.key" :label="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <template v-if="model.docType">
            <el-row>
              <el-col :span="8">
                <el-form-item label="文件名称" prop="docName">
                  <el-input v-model="model.docName" clearable placeholder="请输入" title="文件名称" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="文号" prop="docNo">
                  <el-input v-model="model.docNo" clearable placeholder="请输入" title="文号" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="版本" prop="fileName">
                  <el-input v-model="model.fileName" clearable placeholder="请输入" title="版本" />
                </el-form-item>
              </el-col>
              <el-col v-if="['1', '2'].includes(fileType)" :span="8">
                <el-form-item label="编号" prop="docCode">
                  <el-input v-model="model.docCode" clearable placeholder="请输入" title="编号" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="发文单位" prop="publishDept">
                  <el-cascader-wrapper v-model="model.publishDept" :options="optionsOrganization" :props="{value: 'id', label: 'value', checkStrictly: true}" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="发文时间" prop="publishDate">
                  <el-date-picker v-model="model.publishDate" class="full-width" placeholder="请选择" title="发文时间" type="date" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="检修方式" prop="repairMethod">
                  <el-input v-model="model.repairMethod" clearable placeholder="请输入" title="检修方式" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="等级" prop="level">
                  <el-input v-model="model.level" clearable placeholder="请输入" title="等级" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="适用范围" prop="applyScopes">
                  <el-input v-model="model.applyScopes" clearable placeholder="请输入" title="适用范围" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="适用车型" prop="applyCarType">
                  <el-input v-model="model.applyCarType" clearable placeholder="请输入" title="适用车型" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="项目分类" prop="category">
                  <el-input v-model="model.category" clearable placeholder="请输入" title="项目分类" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="下级是否需要细化">
                  <el-select v-model="model.subDocOrgs" class="full-width" multiple placeholder="请选择" title="下级是否需要细化" clearable filterable default-first-option>
                    <el-option v-for="(item, index) in refineArr" :key="index" :value="item.value" :label="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 文件上传 -->
            <el-row>
              <el-col :span="12">
                <el-form-item label="正文" prop="bodyFileId">
                  <el-upload class="inline-block mr-5" accept=".doc, .docx, .pdf" :on-remove="(file, fileList) => removeFile(file, 'bodyFileIdList')" action="" :http-request="() => customUpload('bodyFileIdList')" :on-change="onFileChange">
                    <el-button type="success">上传正文</el-button>
                    <span class="ml-5 upload-note align-top">支持格式：.rar, .zip, .doc, .docx, .pdf，单个文件不能超过20MB</span>
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="已上传正文" prop="bodyFileIdList">
                  <p v-for="i in model['bodyFileIdList']" :key="i.idx">
                    <el-link type="primary">{{ i.fileName }}</el-link>
                  </p>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="附件" prop="attachFileIds">
                  <el-upload class="inline-block mr-5" accept=".doc, .docx, .pdf" :on-remove="(file, fileList) => removeFile(file, 'attachFileIdsList')" action="" :http-request="() => customUpload('attachFileIdsList')" :on-change="onFileChange">
                    <el-button type="success">上传正文</el-button>
                    <span class="ml-5 upload-note align-top">支持格式：.rar, .zip, .doc, .docx, .pdf，单个文件不能超过20MB</span>
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="已上传附件" prop="attachFileIdsList">
                  <p v-for="i in model['attachFileIdsList']" :key="i.idx">
                    <el-link type="primary">{{ i.fileName }}</el-link>
                  </p>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <el-form-item label="对应上级文件">
                  <div class="inline-block mr-5">
                    <el-button type="success" @click="customUploadFile('refineIds')">关联文件</el-button>
                    <ul class="el-upload-list el-upload-list--text">
                      <li v-for="(item, index) in model['refineIds']" :key="index" class="el-upload-list__item is-ready">
                        <a class="el-upload-list__item-name"><i class="el-icon-document" />{{ item.docName }}</a>
                        <i class="el-icon-close" @click="deleteUploadFile(item, 'refineIds')" />
                      </li>
                    </ul>
                  </div>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="废止文件">
                  <div class="inline-block mr-5">
                    <el-button type="success" @click="customUploadFile('revokeIds')">关联文件</el-button>
                    <ul class="el-upload-list el-upload-list--text">
                      <li v-for="(item, index) in model['revokeIds']" :key="index" class="el-upload-list__item is-ready">
                        <a class="el-upload-list__item-name"><i class="el-icon-document" />{{ item.docName }}</a>
                        <i class="el-icon-close" @click="deleteUploadFile(item, 'revokeIds')" />
                      </li>
                    </ul>
                  </div>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="废弃部分文件">
                  <div class="mr-5">
                    <el-button type="success" @click="customUploadFile('partRevokeIds')">关联文件</el-button>
                    <ul>
                      <li v-for="(item, index) in model['partRevokeIds']" :key="index" class="flex content-center mt-2  text-gray-400 hover:text-blue-400 hover:bg-gray-200 cursor-pointer ">
                        <i class="el-icon-document leading-7 mr-1 text-gray-400 hover:text-gray-400" />
                        <div class="break-normal mr-3 ">{{ item.docName }}</div>
                        <el-input v-model="item.revokeDetail" class="w-96 inline-block mr-2" />
                        <i class="el-icon-close leading-7 text-gray-400 hover:text-gray-400" @click="deleteUploadFile(item, 'partRevokeIds')" />
                      </li>
                    </ul>
                  </div>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="停执文件">
                  <div class="inline-block mr-5">
                    <el-button type="success" @click="customUploadFile('disableIds')">关联文件</el-button>
                    <ul class="el-upload-list el-upload-list--text">
                      <li v-for="(item, index) in model['disableIds']" :key="index" class="el-upload-list__item is-ready">
                        <a class="el-upload-list__item-name"><i class="el-icon-document" />{{ item.docName }}</a>
                        <i class="el-icon-close" @click="deleteUploadFile(item, 'disableIds')" />
                      </li>
                    </ul>
                  </div>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="解读材料" prop="explainFileId">
                  <el-upload class="inline-block mr-5" accept=".doc, .docx, .pdf" :on-remove="(file, fileList) => removeFile(file, 'explainFileIdList')" action="" :http-request="() => customUpload('explainFileIdList')" :on-change="onFileChange">
                    <el-button type="success">上传正文</el-button>
                    <span class="ml-5 upload-note align-top">支持格式：.rar, .zip, .doc, .docx, .pdf，单个文件不能超过20MB</span>
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="已上传解读材料" prop="explainFileIdList">
                  <p v-for="i in model['explainFileIdList']" :key="i.idx">
                    <el-link type="primary">{{ i.fileName }}</el-link>
                  </p>
                </el-form-item>
              </el-col>
            </el-row>

          </template>
        </el-row>

      </el-form>
    </div>

    <template #footer>
      <el-button type="primary" icon="el-icon-edit-outline" size="medium" @click="onSubmit">保存</el-button>
      <el-button icon="el-icon-back" size="medium" @click="goToList">返回列表</el-button>
    </template>

    <el-dialog
      width="40%"
      title="文件"
      :visible.sync="dialogVisible"
    >
      <el-table
        ref="searchTable"
        v-loading="isLoading"
        size="mini"
        class="mb-10"
        border
        stripe
        :data="fileList"
        @selection-change="selectionChange"
      >
        <el-table-column align="center" type="selection" />
        <el-table-column type="index" label="序号" align="center" />
        <el-table-column
          label="文件名"
          prop="docName"
          align="center"
        />
        <el-table-column
          label="文号"
          prop="docNo"
          align="center"
        />
        <el-table-column
          label="文种"
          prop="docTypeStr"
          align="center"
        />
      </el-table>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="doUpload">关联</el-button>
      </div>
    </el-dialog>

  </detail-skeleton>
</template>

<script>
import DetailSkeleton from '@/components/DetailSkeleton'
import { getDetail, importData, odocDocument, superiorDoc, currentDeptDoc, putOdocDocument } from '@/views/file-add/api'
import { getDictionaryList } from '@/api/common'
import cloneDeep from 'lodash/cloneDeep'
import ElCascaderWrapper from '@/components/ElCascaderWrapper'
import { mapGetters } from 'vuex'

export default {
  name: 'FileAdd',
  components: { DetailSkeleton, ElCascaderWrapper },
  data () {
    return {
      model: {},
      rules: {},
      isLoading: null,
      file: [],
      fileList: [],
      dialogVisible: false,
      docTypeList: [],
      refineArr: [
        {
          value: '车辆部'
        },
        {
          value: '动车段'
        },
        {
          value: '客车段'
        },
        {
          value: '货车段'
        }
      ],
      dictionary: {
        'bodyFileId': 'bodyFileIdList',
        'attachFileIds': 'attachFileIdsList',
        'explainFileId': 'explainFileIdList'
      },
      relationType: null,
      selectionList: []
    }
  },
  computed: {
    ...mapGetters(['allOrganizations']),
    fileType () {
      return this.model.docType
    },
    optionsOrganization () {
      return this.allOrganizations.treeData
    }
  },
  async created () {
    this.getDetail()
    this.getCommonData()
  },
  methods: {
    onFileChange (file) {
      this.file = file
    },

    async getDetail () {
      const { params: { id }} = this.$route
      if (id) {
        const { data } = await getDetail(id)
        this.model = data
      }
    },

    removeFile (file, listIdx) {
      this.model[listIdx] = this.model[listIdx].filter(i => i.id !== file.id)
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

    async customUploadFile (type) {
      let data = null
      if (['refineIds'].includes(type)) {
        data = await superiorDoc()
      } else {
        data = await currentDeptDoc()
      }
      this.fileList = data.data
      this.relationType = type
      this.dialogVisible = true
      this.$nextTick(() => {
        this.model[type]?.forEach(i => {
          const addItem = this.fileList.find(j => j.id === i.id)
          this.$refs.searchTable.toggleRowSelection(addItem)
        })
      })
    },

    deleteUploadFile (file, typeName) {
      const filterFile = this.model[typeName].filter(i => i.id !== file.id)
      this.$set(this.model, typeName, filterFile)
      console.log(typeName, this.model[typeName])
    },

    async onSubmit () {
      const { params: { id }} = this.$route
      this.isLoading = true
      const requestData = cloneDeep(this.model)
      requestData.subDocOrgs = requestData.subDocOrgs.toString()
      requestData.partRevokeIds = requestData.partRevokeIds?.map(i => ({
        revokeDetail: i.revokeDetail,
        toDocIdId: i.id
      }))
      requestData.revokeIds = requestData.revokeIds?.map(i => i.id)
      requestData.refineIds = requestData.refineIds?.map(i => i.id)
      requestData.disableIds = requestData.disableIds?.map(i => i.id)
      Object.entries(this.dictionary).forEach((i) => {
        const [key, value] = i
        requestData[key] = requestData[value]?.map(j => j.id).toString()
      })
      if (id) {
        await putOdocDocument(requestData).finally(() => {
          this.isLoading = false
        })
        this.$message.success('文件编辑成功！')
        this.getDetail()
      } else {
        await odocDocument(requestData).finally(() => {
          this.isLoading = false
        })
        this.$message.success('文件添加成功！')
        this.goToList()
      }
    },

    async getCommonData () {
      const key1 = 'DOCUMENT_TYPE'
      const key2 = 'DOCUMENT_STATUS'

      const { data: enums } = await getDictionaryList([key1, key2].toString())
      this.docTypeList = enums[key1]
      this.docStatusList = enums[key2]
      console.log(this.docTypeList)
    },

    doUpload () {
      if (!this.selectionList.length) {
        this.$message.error('未选择文件无法关联')
        return
      }
      // this.model[this.relationType] = this.selectionList
      this.$set(this.model, this.relationType, this.selectionList)
      this.dialogVisible = false
    },

    selectionChange (val) {
      this.selectionList = val
    },

    goToList () {
      this.$router.push({
        name: 'FileManagement'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-note {
  color: #a7a3a3
}
.height {
  height: calc(100vh - 54px)
}
</style>
