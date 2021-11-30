<template>
  <el-checkbox-group
    v-model="val"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <el-checkbox
      v-for="item in options"
      :key="item.key"
      :label="item.value"
      :name="name"
    />
  </el-checkbox-group>
</template>

<script>
/**
 * @description **复选框组件**
 */
export default {
  name: 'ElCheckboxGroupWrapper',
  props: {
    name: {
      type: String,
      default: ''
    },
    value: {
      type: Array,
      default () {
        return []
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
