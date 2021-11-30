<template>
  <el-radio-group
    v-model="val"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <el-radio v-for="item in options" :key="item.key" :label="item.value" />
  </el-radio-group>
</template>

<script>
/**
 * @description **选择框组件**
 */
export default {
  name: 'ElRadioGroupWrapper',
  props: {
    value: {
      type: [Array, String, Number],
      default () {
        return null
      }
    },
    /**
     * @description Key Value 对象数组
     * @example [{ key: 'x', value: 'xxx' }, { key: 'y', value: 'yyy' }]
     */
    options: {
      type: [Array, String],
      default () {
        return []
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
