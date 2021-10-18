<template>
  <div>
    <div class="mb-2">
      <div class="text-center text-2xl font-bold mb-2">{{ model.title }}</div>
      <div class="text-right text-gray-400 flex justify-between">
        <div />
        <div class="flex w-1/6">
          <el-date-picker v-model="model.periodStartDate" class="mr-2" type="month" />
          <el-select-wrapper v-if="model.conclusionPeriodType === mapper.WEEK[0]" v-model="model.week" :options="weeksOfCurrentMonth" />
          <!--<el-date-picker v-model="model.periodStartDate" :type="type.toLowerCase()" :format="getFormatter" :placeholder="`选择${setTitle}`" />-->
        </div>
      </div>
    </div>

    <el-card shadow="hover" class="mb-2">
      <rich-text-editor v-model="model.content" v-bind="$attrs" :height="editorHeight" />
    </el-card>
  </div>
</template>

<script>
import RichTextEditor from '@/components/RichTextEditor'
import ElSelectWrapper from '@/components/ElSelectWrapper'
import { mapper } from '@/views/department-work/const'
import { getWeeksInMonth } from 'date-fns'

export default {
  name: 'BriefSummary',
  components: {
    ElSelectWrapper,
    RichTextEditor
  },
  props: {
    type: {
      type: String,
      default: ''
    },
    detail: {
      type: Object,
      default: () => ({
        conclusionPeriod: null,
        conclusionPeriodType: null,
        conclusionType: null,
        content: null,
        createBy: null,
        createTime: null,
        deleted: null,
        id: null,
        ownerDept: null,
        ownerId: null,
        remark: null,
        title: null,
        updateBy: null,
        updateTime: null,
        periodStartDate: null,
        workPlanIds: [],
        week: null
      })
    },
    editorHeight: {
      type: [String, Number],
      default: '50vh'
    }
  },
  data () {
    return {
      mapper,
      model: {
        conclusionPeriod: new Date(),
        conclusionPeriodType: null,
        conclusionType: null,
        content: null,
        createBy: null,
        createTime: null,
        deleted: null,
        id: null,
        ownerDept: null,
        ownerId: null,
        remark: null,
        title: null,
        updateBy: null,
        updateTime: null,
        periodStartDate: null,
        workPlanIds: [],
        week: null
      }
    }
  },
  computed: {
    // setTitle () {
    //   const mapper = {
    //     WEEK: '周',
    //     MONTH: '月'
    //   }
    //
    //   return mapper[this.type]
    // },
    // getFormatter () {
    //   const mapper = {
    //     WEEK: 'yyyy年第WW周',
    //     MONTH: 'yyyy年MM月'
    //   }
    //
    //   return mapper[this.type]
    // },
    weeksOfCurrentMonth () {
      if (this.detail.periodStartDate === null) {
        return []
      }
      const weeks = getWeeksInMonth(new Date(this.detail.periodStartDate))
      return Array.from({ length: weeks }, (_, index) => {
        return {
          key: `W${index + 1}`,
          value: `第${index + 1}周`
        }
      })
    }
  },
  watch: {
    type: {
      handler: function (v) {
        this.model.conclusionType = v
      },
      immediate: true
    },
    detail: {
      handler: function (v) {
        this.model = v
      },
      immediate: true
    }
  }
}
</script>
