<template>
  <el-cascader
    v-model="val"
    clearable
    filterable
    class="full-width"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script>
/**
 * @description **下拉框组件**
 */
export default {
  name: 'ElCascaderWrapper',
  props: {
    value: {
      type: [Array, String, Number],
      default () {
        return null
      }
    }
  },
  data () {
    return {
      val: null
    }
  },
  watch: {
    value: {
      handler: function (val) {
        this.val = val
      },
      immediate: true
    }
  }
}
</script>
