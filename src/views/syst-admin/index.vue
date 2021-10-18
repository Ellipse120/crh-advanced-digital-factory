<template>
  <div class="app-container">
    <el-row :gutter="10" type="flex" justify="space-between" class="mb-10">
      <el-col :xs="12" :sm="6" :md="6" :lg="6" :xl="6">
        <el-input v-model="query.configGroup" clearable placeholder="请输入配置项组" title="配置项组" />
      </el-col>
      <el-col :xs="12" :sm="6" :md="6" :lg="6" :xl="6">
        <el-input v-model="query.configKey" clearable placeholder="请输入配置项key" title="配置项key" />
      </el-col>
      <el-col :xs="12" :sm="6" :md="6" :lg="6" :xl="6">
        <el-input v-model="query.scope" clearable placeholder="请输入配置范围" title="配置范围" />
      </el-col>
      <el-col :xs="12" :sm="6" :md="6" :lg="6" :xl="6">
        <el-input v-model="query.remark" clearable placeholder="请输入备注" title="备注" />
      </el-col>
      <el-button icon="el-icon-close" @click="resetQuery">清空</el-button>
      <el-button type="primary" icon="el-icon-search" :loading="isLoading" @click="doSearch">查询</el-button>
      <el-button type="success" icon="el-icon-plus" @click="doAdd">添加</el-button>
    </el-row>

    <el-table-wrapper
      ref="searchTable"
      v-loading="isLoading"
      class="mb-10"
      :height="tableHeight"
      :data="list"
    >
      <el-table-column
        label="配置名称"
        prop="configName"
        align="center"
        min-width="200"
        class-name="col--color-cyan cell--entry-display-name"
      />
      <el-table-column
        prop="configGroup"
        align="center"
        label="配置项组"
        class-name="col--color-red cell--entry-categorization"
      />
      <el-table-column
        label="配置项key"
        prop="configKey"
        align="center"
        width="200"
        class-name="col--color-yellow cell--entry-key"
      />
      <el-table-column
        label="配置范围"
        prop="scope"
        align="center"
        width="150"
        class-name="col--color-purple cell--entry-scope"
      />
      <el-table-column
        label="配置项值"
        prop="configVal"
        min-width="500"
        header-align="center"
        show-tooltip-when-overflow
      />

      <el-table-column
        prop="remark"
        label="备注"
        header-align="center"
        min-width="300"
      />
      <el-table-column
        label="操作"
        align="center"
        width="200"
      >
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" size="mini" @click="doEdit(scope)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="doRemove(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table-wrapper>

    <el-pagination
      :current-page="pagination.pageNo"
      :page-sizes="[10, 20, 100]"
      :page-size="pagination.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.totalRecords"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-dialog
      :title="isAdd ? '添加' : '编辑'"
      :visible.sync="dialogVisible"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="form" :model="model" :rules="rules" label-width="120px">
        <el-form-item label="配置名称" prop="configName">
          <el-input v-model="model.configName" clearable />
        </el-form-item>
        <el-form-item label="配置项组" prop="configGroup">
          <el-input v-model="model.configGroup" clearable />
        </el-form-item>
        <el-form-item label="配置项key" prop="configKey">
          <el-select v-model="model.configKey" class="full-width" placeholder="请选择" allow-create filterable clearable>
            <el-option v-for="item in configKeies" :key="item.key" :label="item.key" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="配置项值">
          <el-input v-model="model.configVal" type="textarea" :autosize="{ minRows: 6, maxRows: 20}" clearable />
        </el-form-item>
        <el-form-item label="配置范围">
          <el-input v-model="model.scope" clearable />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="model.remark" clearable />
        </el-form-item>
        <el-form-item label="示例">
          <span>{{ exampleData }}</span>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button type="primary" @click="doSave">保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import { formatText, parseTime } from '@/utils'
import { getSystList, getSystItem, addSystItem, modifySystItem, deleteSystItem } from './api'
import { getDiffTypeDictList } from '@/api/dict'
import autoTableHeight from '@/mixins/autoTableHeight'
import ElTableWrapper from '@/components/ElTableWrapper'

export default {
  name: 'SystAdmin',
  components: { ElTableWrapper },
  mixins: [autoTableHeight],
  data () {
    return {
      query: {
        configKey: null,
        configGroup: null,
        scope: null,
        remark: null
      },
      pagination: {
        pageNo: 1,
        pageSize: 20,
        totalRecords: 0
      },
      isAdd: false,
      dialogVisible: false,
      isLoading: false,
      list: [],
      configKeies: [],
      model: {
        configName: null,
        configGroup: null,
        configKey: null,
        configVal: null,
        createBy: null,
        createTime: null,
        deleted: null,
        id: null,
        scope: null,
        remark: null,
        updateBy: null,
        updateTime: null
      },
      defaultModel: {
        configName: null,
        configGroup: null,
        configKey: null,
        configVal: null,
        createBy: null,
        createTime: null,
        deleted: null,
        id: null,
        scope: null,
        remark: null,
        updateBy: null,
        updateTime: null
      },
      rules: {
        configName: [{ required: true, message: '不能为空', trigger: 'blur' }],
        configGroup: [{ required: true, message: '不能为空', trigger: 'blur' }],
        configKey: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      exampleData: ''
    }
  },
  watch: {
    '$route': {
      handler: 'getList',
      immediate: true
    },
    'model.configKey': function (val) {
      if (val) {
        const target = this.configKeies.find(o => o.key === val)
        this.exampleData = target && target.ext.example
      } else {
        this.exampleData = ''
      }
    }
  },
  created () {
    this.getEnums()
  },
  methods: {
    doSearch () {
      this.pagination.pageNo = 1
      this.getList()
    },

    doRemove ({ row: { id, configGroup, configKey }}) {
      this.$confirm(`确认删除 ${configGroup}【${configKey}】？`, '提醒', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await deleteSystItem(id)
        this.$message.success('删除成功')
        await this.getList()
      }).catch(_ => {})
    },

    async doEdit ({ row: { id }}) {
      this.isAdd = false
      const { data } = await getSystItem(id)
      this.model = data
      this.dialogVisible = true
    },

    async getList () {
      this.isLoading = true
      const query = { ...this.query, ...this.pagination }
      const { data } = await getSystList(query).finally(() => {
        this.isLoading = false
      })
      this.list = data.list && data.list
      this.pagination = data.pageReq && data.pageReq
    },

    async getEnums () {
      const param1 = 'systconfigkeys'
      const { data } = await getDiffTypeDictList([param1].toString())
      this.configKeies = data[param1]
    },

    doAdd () {
      this.isAdd = true
      this.model = cloneDeep(this.defaultModel)
      this.dialogVisible = true
    },

    doSave () {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          const data = cloneDeep(this.model)
          if (this.isAdd) {
            await addSystItem(data)
            this.dialogVisible = false
            this.$message.success('添加成功')
            await this.getList()
          } else {
            await modifySystItem(data)
            this.dialogVisible = false
            this.$message.success('编辑成功')
            await this.getList()
          }
        }
      })
    },

    handleCurrentChange (currentPage) {
      this.pagination.pageNo = currentPage
      this.getList()
    },

    handleSizeChange (pageSize) {
      this.pagination.pageSize = pageSize
      this.getList()
    },

    resetQuery () {
      this.query = Object.assign({}, {
        configKey: null,
        configGroup: null,
        scope: null
      })
    },

    formatDate (value, format = '{y}-{m}-{d} {h}:{i}:{s}') {
      return parseTime(value, format)
    },

    formatText (data, value) {
      return formatText(data, value)
    }
  }
}
</script>
