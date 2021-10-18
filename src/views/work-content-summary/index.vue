<template>
  <div class="m-4">
    <el-form :inline="true" :model="query">
      <el-form-item label="单位">
        <el-select-wrapper v-model.trim="query.conclusionType" :options="typeList" />
      </el-form-item>
      <el-form-item label="周期">
        <el-select-wrapper v-model.trim="query.period" :options="periodList" />
      </el-form-item>
      <!--      <el-form-item :label="`选择${getTitle}`">-->
      <!--        <el-date-picker v-model="query.date" :type="query.period.toLowerCase()" :format="getFormatter" :placeholder="`选择${getTitle}`" />-->
      <!--      </el-form-item>-->
      <el-form-item label="选择月">
        <el-date-picker v-model="query.date" type="month" />
      </el-form-item>
      <el-form-item v-if="query.period === mapper.WEEK[0]" label="选择周">
        <el-select-wrapper v-model="query.week" :options="weeksOfCurrentMonth" />
      </el-form-item>
      <el-form-item>
        <el-button-wrapper icon="el-icon-close" @click="resetQuery">清空</el-button-wrapper>
        <el-button-wrapper type="primary" icon="el-icon-search" :loading="isLoading" @click="doSearch">查询</el-button-wrapper>
      </el-form-item>
    </el-form>

    <div v-loading="isLoading">
      <el-empty v-if="!detail || !detail.id" />
      <div v-else>
        <brief-summary :type="detail.conclusionPeriodType" :detail="detail" :disabled="true" :editor-height="'67vh'" />
      </div>
    </div>

  </div>
</template>

<script>
import { getWeeksInMonth, getWeekOfMonth } from 'date-fns'
import cloneDeep from 'lodash/cloneDeep'
import { getWorkSummary } from './api'
import ElButtonWrapper from '@/components/ElButtonWrapper'
import ElSelectWrapper from '@/components/ElSelectWrapper'
import { mapper } from '@/views/department-work/const'
import BriefSummary from '@/views/personal-work/brief-summary'

export default {
  name: 'WorkContentSummary',
  components: {
    ElButtonWrapper,
    ElSelectWrapper,
    BriefSummary
  },
  data () {
    return {
      mapper,
      typeList: [{ key: mapper.DEPT[0], value: mapper.DEPT[1] }, { key: mapper.PSN[0], value: mapper.PSN[1] }],
      periodList: [{ key: mapper.WEEK[0], value: `${mapper.WEEK[1]}${mapper.SUMMARY[1]}` }, { key: mapper.MONTH[0], value: `${mapper.MONTH[1]}${mapper.SUMMARY[1]}` }],
      isLoading: false,
      query: {
        conclusionType: mapper.DEPT[0],
        period: mapper.WEEK[0],
        date: new Date(),
        week: 'W1'
      },
      defaultQuery: {
        conclusionType: mapper.DEPT[0],
        period: mapper.WEEK[0],
        date: new Date(),
        week: 'W1'
      },
      detail: {
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
        workPlanIds: null
      }
    }
  },
  computed: {
    getTitle () {
      const mapper = {
        [mapper.WEEK[0]]: mapper.WEEK[1],
        [mapper.MONTH[0]]: mapper.MONTH[1]
      }

      return mapper[this.query.period]
    },
    getFormatter () {
      const mapper = {
        [mapper.WEEK[0]]: 'yyyy年第WW周',
        [mapper.MONTH[0]]: 'yyyy年MM月'
      }

      return mapper[this.query.period]
    },
    weeksOfCurrentMonth () {
      const weeks = getWeeksInMonth(this.query.date)
      return Array.from({ length: weeks }, (_, index) => {
        return {
          key: `W${index + 1}`,
          value: `第${index + 1}周`
        }
      })
    }
  },
  methods: {
    doSearch () {
      this.getReportData()
    },

    async getReportData () {
      this.isLoading = true
      const query = cloneDeep({ ...this.query })
      // const formatMapper = {
      //   WEEK: 'yyyy\'M\'MM\'W\'II',
      //   MONTH: 'yyyy\'M\'MM'
      // }
      const month = this.formatTimeMixin(query.date, 'yyyy\'M\'MM')

      if (!(query.conclusionType || query.period)) {
        return
      }

      const { data } = await getWorkSummary({
        conclusionType: query.conclusionType,
        period: this.query.period === this.mapper.WEEK[0] ? month + query.week : month
      }).finally(() => {
        this.isLoading = false
      })
      data && (data.week = 'W' + getWeekOfMonth(new Date(data?.periodStartDate)))
      this.detail = data
    },

    resetQuery () {
      this.query = cloneDeep(this.defaultQuery)
    }

  }
}
</script>
