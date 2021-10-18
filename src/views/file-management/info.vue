<template>
  <div class="app-container">
    <el-form class="flex justify-between">
      <el-form-item>
        基本信息
      </el-form-item>
      <el-form-item class="fixed right-5">
        <el-button type="success" icon="el-icon-edit" @click="doSubmit">意见提报</el-button>
        <el-button type="success" icon="el-icon-edit" @click="doEdit">文件维护</el-button>
      </el-form-item>
    </el-form>

    <el-form ref="form" :v-loading="isLoading" :model="model" label-width="160px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="文件名称" prop="operationCode">
            {{ model.docName }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="文号" prop="operationContent">
            {{ model.docNo }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="文种" prop="file">
            {{ model.docTypeStr }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发文单位" prop="file">
            {{ model.publishDept }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发文时间" prop="routeDate">
            {{ model.publishDate }}
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="正文">
            <ul v-for="(item, index) in model.bodyFileIdList" :key="index" class="el-upload-list el-upload-list--text">
              <li class="el-upload-list__item is-ready" style="margin:0;line-height:28px;">
                <a class="el-upload-list__item-name" style="color: #409EFF"><i class="el-icon-document" style="color: #409EFF" />{{ item.fileName }}</a>
              </li>
            </ul>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="附件">
            <div class="inline-block mr-5">
              <ul v-for="(item, index) in model.attachFileIdsList" :key="index" class="el-upload-list el-upload-list--text">
                <li class="el-upload-list__item is-ready" style="margin:0;line-height:28px;">
                  <a class="el-upload-list__item-name" style="color: #409EFF" @click="doView(index, '2')"><i class="el-icon-document" style="color: #409EFF" />{{ item.fileName }}</a>
                </li>
              </ul>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="解读材料">
            <div class="inline-block mr-5">
              <ul v-for="(item, index) in model.explainFileIdList" :key="index" class="el-upload-list el-upload-list--text">
                <li class="el-upload-list__item is-ready" style="margin:0;line-height:28px;">
                  <a class="el-upload-list__item-name" style="color: #409EFF" @click="doView(index, '3')"><i class="el-icon-document" style="color: #409EFF" />{{ item.fileName }}</a>
                </li>
              </ul>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      ref="searchTable"
      v-loading="isLoading"
      size="mini"
      class="mb-10"
      border
      stripe
      :data="treeInfoList"
    >
      <el-table-column type="index" label="序号" align="center" />
      <el-table-column
        label="发文部门"
        prop="publishDept"
        align="center"
        show-overflow-tooltip
      />
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
    </el-table>

    <el-form class="flex justify-between">
      <el-form-item>
        修改意见记录
      </el-form-item>
      <el-form-item>
        <el-button type="success" icon="el-icon-download" :loading="isExporting" @click="doExport">导出</el-button>
      </el-form-item>
    </el-form>

    <el-table
      ref="searchTable"
      v-loading="isLoading"
      size="mini"
      class="mb-10"
      border
      stripe
      :data="model.odocDocumentCommentInfoRespVOList"
    >
      <el-table-column type="index" label="序号" align="center" />
      <el-table-column
        label="修改意见"
        prop="comment"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        label="单位"
        prop="commentUnit"
        align="center"
      />
      <el-table-column
        label="部门"
        prop="commentDept"
        align="center"
      />
      <el-table-column
        label="录入人"
        prop="commentByName"
        align="center"
      />
      <el-table-column
        label="录入时间"
        prop="commentTime"
        align="center"
      />
      <el-table-column
        label="状态"
        prop="statusStr"
        align="center"
      />
      <el-table-column
        label="操作"
        align="center"
        width="160"
      >
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" size="mini" @click="doHandle(scope)">处理</el-button>
          <el-button type="text" icon="el-icon-check" size="mini" disabled>已处理</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="意见提报"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="form" :model="formData" label-width="120px">
        <el-form-item label="文件名:" prop="docItem">
          <el-input v-model="model.docName" disabled />
        </el-form-item>
        <el-form-item label="文号/编号:" prop="comment">
          <el-input v-model="model.docNo" disabled />
        </el-form-item>
        <el-form-item label="修订原因:" prop="commentReason">
          <el-input v-model="formData.comment" type="textarea" :rows="6" show-word-limit maxlength="100" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="submitComment">提交</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { exportData, getItem, getTreeInfoList, addDocComment } from './api'
import { downFileStream } from '@/utils'

export default {
  name: 'FileManagementInfo',
  data () {
    return {
      isLoading: false,
      refineArr: [],
      model: {
        file: null
      },
      treeInfoList: [],
      dialogVisible: false,
      isExporting: false,
      detailId: null,
      formData: {
        comment: null,
        docId: null
      }
    }
  },
  created () {
    const { params: { id }} = this.$route
    if (id) {
      this.detailId = id
      this.getDetail(id)
      this.getTreeInfoData(id)
    }
  },
  methods: {
    async getDetail (id) {
      const { data } = await getItem(id)
      this.model = data
    },

    doSubmit () {
      this.dialogVisible = true
    },

    doEdit () {
      this.$router.push({ name: 'FileEdit', params: { id: this.detailId }})
    },

    doView () {

    },

    async getTreeInfoData (id) {
      const { data } = await getTreeInfoList(id).finally(() => {
        this.isLoadingTreeInfo = false
      })
      this.treeInfoList = data?.list
    },

    async submitComment () {
      this.formData.docId = this.detailId
      await addDocComment(this.formData)
      this.$message.success('意见提报成功！')
      this.dialogVisible = false
      await this.getDetail(this.detailId)
    },

    async doDownload (item) {
      const data = await exportData(item)
      downFileStream(data)
    },
    async doExport () {
      let query = null
      query = { ...this.query }

      this.isExporting = true
      const res = await exportData(query).finally(() => {
        this.isExporting = false
      })
      downFileStream(res)
    },

    doHandle ({ row }) {

    }
  }
}
</script>

<style lang="scss" scoped>

</style>
