<template>
  <div>
    <div class="border-l-100 border-red-500 ring-4 my-4">WindiCSS</div>

    <button
      bg="blue-400 hover:blue-500 dark:blue-500 dark:hover:blue-600"
      text="sm white"
      font="mono light"
      p="y-2 x-4"
      border="2 rounded blue-200"
    >
      Button
    </button>

    <el-divider />

    {{ model }}
    <el-form label-width="80px" :model="model">

      <el-row :gutter="12">
        <form-item v-for="(item, index) in forms" :key="index" :layout-config="item.layoutConfig || {}">
          <el-form-item :label="item.label" :prop="item.name">
            <component :is="item.component" v-model="model[item.name]" v-bind="item.props" />
          </el-form-item>
        </form-item>
      </el-row>

    </el-form>

    <pre>{{ testData }}</pre>
    <el-table-wrapper :data="testData" :stripe="false">
      <el-table-column align="center" label="A" property="a">
        <template slot-scope="scope">
          <inline-editor :val-data="scope.row.a" @update:valData="(v) => test(v, scope)" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="B" property="b">
        <template slot-scope="scope">
          <el-input v-model="scope.row.b" />
        </template>
      </el-table-column>
    </el-table-wrapper>
  </div>
</template>

<script>
import Vue from 'vue'
import { ref } from '@vue/composition-api'
import FormItem from '@/components/FormItem'
import ElSelectWrapper from '@/components/ElSelectWrapper'
import ElDatePickerWrapper from '@/components/ElDatePickerWrapper'
import ElCheckboxGroupWrapper from '@/components/ElCheckboxGroupWrapper'
import ElRadioGroupWrapper from '@/components/ElRadioGroupWrapper'
import ElInputWrapper from '@/components/ElInputWrapper'
import ElTableWrapper from '@/components/ElTableWrapper'
import InlineEditor from '@/components/InlineEditor'

// eslint-disable-next-line vue/one-component-per-file
export default {
  name: 'GenFormDemo',
  components: {
    InlineEditor,
    ElTableWrapper,
    FormItem,
    ElSelectWrapper,
    ElDatePickerWrapper,
    ElCheckboxGroupWrapper,
    ElRadioGroupWrapper,
    ElInputWrapper
  },
  setup (props, context) {
    const model = ref({
      name: null
    })
    const forms = ref([
      {
        label: '名字',
        name: 'name',
        // eslint-disable-next-line vue/one-component-per-file
        component: Vue.component('ElInputWrapper2', {
          render (h) {
            return h('el-input', {
              attrs: this.$attrs,
              on: this.$listeners
            }, [
              h('template', {
                slot: 'append'
              }, [h('div', {
                class: 'text-red-500 bg-blue-300'
              }, '圆')])
            ])
          }
        }),
        props: {
          placeholder: '请输入名字11',
          clearable: true,
          'suffix-icon': 'el-icon-date'
        }
      },
      {
        label: '性别',
        name: 'sex',
        component: 'el-select-wrapper',
        props: {
          placeholder: '请选择性别',
          options: [
            { key: '男', value: '男' },
            { key: '女', value: '女' },
            { key: '其它', value: '其它' }
          ]
        }
      },
      {
        label: '出生日期',
        name: 'birthday',
        component: 'el-date-picker-wrapper',
        props: {}
      },
      {
        label: '创建时间',
        name: 'createTime',
        component: 'el-time-picker',
        props: {}
      },
      {
        label: '是否好人',
        name: 'isGoodPerson',
        component: 'el-switch',
        props: {}
      },
      {
        label: '活动性质',
        name: 'type',
        component: 'ElCheckboxGroupWrapper',
        props: {
          name: 'type',
          options: [
            { key: '活动1', value: '活动1' },
            { key: '活动2', value: '活动2' },
            { key: '活动3', value: '活动3' },
            { key: '活动4', value: '活动4' },
            { key: '活动5', value: '活动5' },
            { key: '活动6', value: '活动6' }
          ]
        },
        layoutConfig: {
          lg: 12
        }
      },
      {
        label: '特殊资源',
        name: 'resource',
        component: 'el-radio-group-wrapper',
        props: {
          options: [
            { key: '线上', value: '线上' },
            { key: '线下', value: '线下' }
          ]
        }
      },
      {
        label: '备注',
        name: 'remark',
        component: 'el-input',
        props: {
          type: 'textarea',
          placeholder: '请输入备注',
          autosize: {
            minRows: 1,
            maxRows: 4
          }
        }
      },
      {
        label: '附件',
        name: 'attachment',
        component: 'el-upload',
        props: {
          action: 'https://jsonplaceholder.typicode.com/posts/',
          multiple: true,
          listType: 'picture-card',
          'on-preview': (file) => {
            console.log(file)
          },
          'on-remove': (file) => {
            console.log(file)
          }
        }
      }
    ])

    const formConfig = ref([
      {
        component: 'el-card',
        props: {
          header: '基础信息'
        },
        fields: [
          {
            name: 'channel',
            component: 'ElFormItemWrapper',
            label: '名字',
            rules: {
              required: true
            }
          },
          {
            name: 'el-select',
            component: 'ElFormItemWrapper',
            label: '下拉选择',
            extend: {
              component: 'el-select'
            },
            items: [
              {
                label: '选项1',
                value: 1
              },
              {
                label: '选项2',
                value: 2
              }
            ]
          },
          {
            name: 'comment',
            component: 'ElFormItemWrapper',
            label: '评语',
            tip: '一句话评价',
            tooltip: '精彩点评',
            rules: {
              required: true,
              max: 50,
              min: 10
            },
            props: {
              placeholder: '不超过 20 个字'
            }
          }
        ]
      }
    ])

    const formShares = ref({
      size: 'mini',
      props: {
        clearable: true
      }
    })

    const metadata = ref({
      channels: [
        {
          id: 1,
          code: 'dy',
          name: '电影'
        },
        {
          id: 2,
          code: 'dm',
          name: '动漫'
        }
      ]
    })

    const testData = ref([
      {
        id: 1,
        a: 'test1',
        b: 'test1b'
      },
      {
        id: 2,
        a: 'test2',
        b: 'test2b'
      }
    ])

    const test = (v, scope) => {
      console.log(v, scope)
      scope.row.a = v
    }

    return {
      model,
      forms,
      testData,

      formConfig,
      formShares,
      metadata,
      test
    }
  }
}
</script>

<style>
.el-table__row .el-input .el-input__inner{
  border-style:none;
}
.hover-row .el-input .el-input__inner{
  border-style:solid;
}
</style>
