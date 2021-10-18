<template>
  <detail-skeleton>
    <div class="info-wrap mb-20">
      <el-descriptions title="基本信息" border :column="2" :label-style="{width: '120px', height: '60px', 'text-align': 'right'}">
        <el-descriptions-item label="征求单位：">{{ model.requestDeptInfo && model.requestDeptInfo.parentUnitName }}</el-descriptions-item>
        <el-descriptions-item label="征求单位：">{{ model.requestDeptInfo && model.requestDeptInfo.departmentName }}</el-descriptions-item>
        <el-descriptions-item label="征求车间：">{{ model.requestDeptInfo && model.requestDeptInfo.parentCJName }}</el-descriptions-item>
        <el-descriptions-item label="文件名称：">{{ model.rfcDocName }}</el-descriptions-item>
        <el-descriptions-item label="截止时间：">2021/06/07 12:00</el-descriptions-item>
        <el-descriptions-item label="发布单位：">{{ model.publishDeptInfo && model.publishDeptInfo.parentUnitName }}</el-descriptions-item>
        <el-descriptions-item label="发布部门：">{{ model.publishDeptInfo && model.publishDeptInfo.departmentName }}</el-descriptions-item>
        <el-descriptions-item label="发布人：">{{ formatTimeMixin(model.deadline, 'yyyy-MM-dd') }}</el-descriptions-item>
        <el-descriptions-item label="有关要求：" :label-style="{height: '120px', 'text-align': 'right'}">{{ model.requirement }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions border :column="2" :label-style="{width: '120px', height: '100px', 'text-align': 'right'}">
        <el-descriptions-item label="附件上传：" :content-style="{'border-top': 'none'}">
          <div class="inline-block mr-5">
            <ul v-for="(item, index) in model.attachFileModels" :key="index" class="el-upload-list el-upload-list--text">
              <li class="el-upload-list__item is-ready">
                <a class="el-upload-list__item-name" style="color: #409EFF" @click="doView(index, '1')"><i class="el-icon-document" style="color: #409EFF" />{{ item.fileName }}</a>
              </li>
            </ul>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="table-wrap">
      <h3 class="mb-20">修改意见记录</h3>
      <el-table-wrapper v-loading="isLoading" class="mb-10" :data="list">
        <el-table-column label="序号" type="index" align="center" />
        <el-table-column label="文件条款" prop="docItem" align="center" />
        <el-table-column label="修订意见" prop="comment" align="center" />
        <el-table-column label="修订原因" prop="commentReason" align="center" />
        <el-table-column label="提报单位" align="center">
          <template slot-scope="{row: {commentByDept}}">{{ commentByDept && commentByDept.parentUnitName }}</template>
        </el-table-column>
        <el-table-column label="提报部门" prop="dicDescription" align="center">
          <template slot-scope="{row: {commentByDept}}">{{ commentByDept && commentByDept.departmentName }}</template>
        </el-table-column>
        <el-table-column label="提报人" prop="commentByName" align="center" />
      </el-table-wrapper>
    </div>

    <template #footer>
      <el-button type="primary" icon="el-icon-edit-outline" size="medium" @click="onAdd">意见提报</el-button>
      <el-button icon="el-icon-back" size="medium" @click="goToList">返回列表</el-button>
    </template>

    <el-dialog
      title="意见提报"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="close"
    >
      <el-form ref="form" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="文件条款:" prop="docItem">
          <el-input v-model="formData.docItem" />
        </el-form-item>
        <el-form-item label="修订意见:" prop="comment">
          <el-input v-model="formData.comment" type="textarea" :rows="6" show-word-limit maxlength="100" />
        </el-form-item>
        <el-form-item label="修订原因:" prop="commentReason">
          <el-input v-model="formData.commentReason" type="textarea" :rows="6" show-word-limit maxlength="100" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="submitComment">提交</el-button>
      </span>
    </el-dialog>

  </detail-skeleton>
</template>

<script>
import DetailSkeleton from '@/components/DetailSkeleton'
import ElTableWrapper from '@/components/ElTableWrapper'

import { getDetail, addComment } from './api'

export default {
  name: 'CommentDetail',
  components: { DetailSkeleton, ElTableWrapper },
  data () {
    return {
      isLoading: false,
      model: {},
      list: [],
      rules: {
        docItem: { required: true, message: '不能为空', trigger: 'blur' },
        comment: { required: true, message: '不能为空', trigger: 'blur' },
        commentReason: { required: true, message: '不能为空', trigger: 'blur' }
      },
      formData: {
        docItem: null,
        comment: null,
        commentReason: null,
        commentBy: 1
      },
      rfcDocId: null,
      fileList: [{
        'id': '1',
        'name': '中国铁路上海局集团有限公司1'
      }, {
        'id': '2',
        'name': '中国铁路上海局集团有限公司2'
      }, {
        'id': '3',
        'name': '中国铁路上海局集团有限公司3'
      }],
      dialogVisible: false
    }
  },
  created () {
    const { params: { id }} = this.$route
    if (id) {
      this.getDetail(id)
      this.rfcDocId = id
    }
  },
  methods: {
    async getDetail (id) {
      const { data } = await getDetail(id)
      this.model = data
      this.list = data.comments
    },

    async submitComment () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.formData.rfcDocId = this.rfcDocId
          await addComment(this.formData)
          this.$message({
            message: '意见提报成功',
            type: 'success',
            duration: 1000,
            onClose: () => {
              this.dialogVisible = false
              this.getDetail(this.rfcDocId)
            }
          })
        }
      })
    },

    doView () {

    },

    onAdd () {
      this.dialogVisible = true
    },

    close () {
      this.$refs.form.resetFields()
      this.dialogVisible = false
    },

    goToList () {
      this.$router.push({
        name: 'TakeAdvice'
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
