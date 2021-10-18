<template>
  <detail-skeleton>
    <el-form ref="form" :model="model" :rules="rules" label-width="100px">
      <el-card shadow="hover" class="mb-2">
        <el-row>
          <el-col :md="12" :lg="8">
            <el-form-item label="制定单位" prop="reportDept">
              <el-input v-model="model.reportDept" />
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="8">
            <el-form-item label="制定部门" prop="reportUnit">
              <el-input v-model="model.reportUnit" clearable />
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="8">
            <el-form-item label="对规文种" prop="docType">
              <el-select-wrapper v-model="model.docType" multiple :options="docTypeList" />
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="8">
            <el-form-item label="年度" prop="year">
              <el-date-picker v-model="model.year" class="full-width" type="year" value-format="yyyy" clearable />
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="8">
            <el-form-item label="月度" prop="month">
              <el-date-picker v-model="model.month" class="full-width" type="month" value-format="MM" format="MM" clearable />
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="8">
            <el-form-item label="">
              <el-button icon="el-icon-close" @click="resetQuery">清空</el-button>
              <el-button type="primary" icon="el-icon-document-copy" @click="generateTemplate">生成</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <el-card shadow="hover" class="mb-2">
        <rich-text-editor :key="tinyKey" v-model="model.report" height="60vh" :options="{ templates: defaultTemplates, template_replace_values: replaceValue }" />
      </el-card>
    </el-form>

    <template #footer>
      <el-button type="primary" icon="el-icon-edit-outline" size="medium">保存</el-button>
      <el-button type="warning" icon="el-icon-s-promotion" size="medium">发布</el-button>
      <el-button type="success" icon="el-icon-download" size="medium">导出</el-button>
      <el-button icon="el-icon-back" size="medium" @click="goToList">返回列表</el-button>
    </template>
  </detail-skeleton>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import { getYear, getMonth } from 'date-fns'
import DetailSkeleton from '@/components/DetailSkeleton'
import RichTextEditor from '@/components/RichTextEditor'
import ElSelectWrapper from '@/components/ElSelectWrapper'
import { getDictionaryList } from '@/api/common'

export default {
  name: 'RegulationsReportGenerate',
  components: {
    DetailSkeleton,
    RichTextEditor,
    ElSelectWrapper
  },
  data () {
    return {
      isLoading: false,
      model: {
        x: null,
        docType: [],
        reportDept: null,
        reportUnit: null,
        handleRemark: null,
        remark: null,
        year: null,
        month: null,
        report: '<p><span style="text-decoration: underline;">123顶顶顶</span></p>',
        time: new Date()
      },
      defaultModel: {
        x: null,
        docType: [],
        reportDept: 'xx',
        reportUnit: 'yy',
        handleRemark: null,
        remark: null,
        year: null,
        month: null,
        report: null,
        time: new Date()
      },
      rules: {
        reportDept: [{ required: true, message: '不能为空', trigger: 'blur' }],
        reportUnit: [{ required: true, message: '不能为空', trigger: 'blur' }],
        docType: [{ required: true, message: '不能为空', trigger: 'change' }],
        year: [{ required: true, message: '不能为空', trigger: 'blur' }],
        month: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      docTypeList: [],
      tinyKey: '1'
    }
  },
  computed: {
    replaceValue () {
      return {
        year: this.model.year,
        month: this.model.month,
        reportDept: this.model.reportDept,
        reportUnit: this.model.reportUnit,
        docType: this.model.docType?.join('/'),
        today: this.formatTimeMixin(new Date(), 'yyyy年MM月dd日')
      }
    },
    defaultTemplates () {
      return [
        {
          title: '通报模板',
          description: '',
          content: `<p style="text-align: center;">
            <strong>关于{$year}年XX季{$month}月XX周XX单位XX部门{$docType}对规的通报</strong></p>
            <p>XX单位/XX部门/XX班组：</p> <p>&nbsp;&nbsp;根据计划安排，XX单位XX部门组织开展了XX年XX季XX月XX周技术规章/管理制度/作业标准对规，现将情况通报如下：</p>
            <p>&nbsp;</p>
            <p>&nbsp;&nbsp;一、整体情况</p> <p>&nbsp;&nbsp;共计对XXX办法（上铁辆〔2015〕438号）、XXX办法（上铁辆〔2021〕55号）等5个规章/制度进行了对规，发现问题XX个，其中管理、制定、培训、执行、整改及其它问题分别X、X、X、X、X、X个。好的方面：.......。主要问题：......。</p>
            <p>&nbsp;</p>
            <p>&nbsp;&nbsp;二、规章管理存在问题</p>
            <p>&nbsp;</p>
            <p>&nbsp;&nbsp;三、规章制定存在问题</p>
            <p>&nbsp;</p>
            <p>&nbsp;&nbsp;四、规章培训存在问题</p>
            <p>&nbsp;</p>
            <p>&nbsp;&nbsp;五、规章执行存在问题</p>
            <p>&nbsp;</p>
            <p>&nbsp;&nbsp;六、规章整改存在问题</p>
            <p>&nbsp;</p>
            <p>&nbsp;&nbsp;七、其它问题</p>
            <p>&nbsp;</p>
            <p>&nbsp;&nbsp;八、有关要求</p>
            <p>&nbsp;</p> <p>&nbsp;</p>
            <p style="text-align: right;">&nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; {$reportDept}单位{$reportUnit}部门</p>
            <p style="text-align: right;">&nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; {$today}</p>`
        }
      ]
    }
  },
  created () {
    const now = new Date()
    this.model.year = getYear(now) + ''
    this.model.month = getMonth(now) + 1 + ''
    this.getCommonData()
  },
  methods: {
    generateTemplate () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.content = null
          this.model.report = `<p style="text-align: center;">
          <strong>关于${this.replaceValue.year}年XX季${this.replaceValue.month}月XX周XX单位XX部门${this.replaceValue.docType}对规的通报</strong></p>
          <p>XX单位/XX部门/XX班组：</p> <p>&nbsp;&nbsp;根据计划安排，XX单位XX部门组织开展了XX年XX季XX月XX周技术规章/管理制度/作业标准对规，现将情况通报如下：</p>
          <p>&nbsp;</p>
          <p>&nbsp;&nbsp;一、整体情况</p> <p>&nbsp;&nbsp;共计对XXX办法（上铁辆〔2015〕438号）、XXX办法（上铁辆〔2021〕55号）等5个规章/制度进行了对规，发现问题XX个，其中管理、制定、培训、执行、整改及其它问题分别X、X、X、X、X、X个。好的方面：.......。主要问题：......。</p>
          <p>&nbsp;</p>
          <p>&nbsp;&nbsp;二、规章管理存在问题</p>
          <p>&nbsp;</p>
          <p>&nbsp;&nbsp;三、规章制定存在问题</p>
          <p>&nbsp;</p>
          <p>&nbsp;&nbsp;四、规章培训存在问题</p>
          <p>&nbsp;</p>
          <p>&nbsp;&nbsp;五、规章执行存在问题</p>
          <p>&nbsp;</p>
          <p>&nbsp;&nbsp;六、规章整改存在问题</p>
          <p>&nbsp;</p>
          <p>&nbsp;&nbsp;七、其它问题</p>
          <p>&nbsp;</p>
          <p>&nbsp;&nbsp;八、有关要求</p>
          <p>&nbsp;</p> <p>&nbsp;</p>
          <p style="text-align: right;">&nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ${this.model.reportDept}单位${this.model.reportUnit}部门</p>
          <p style="text-align: right;">&nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ${this.replaceValue.today}</p>
        `
          this.tinyKey = this.genUUIDMixin()
        }
      })
    },

    resetQuery () {
      this.model = cloneDeep(this.defaultModel)
    },

    async getCommonData () {
      const key1 = 'DOCUMENT_TYPE'

      const { data: enums } = await getDictionaryList([key1].toString())
      this.docTypeList = enums[key1]
    },

    goToList () {
      this.$router.push({
        name: 'RegulationsReport'
      })
    }
  }
}
</script>

<style scoped>

</style>
