<template>
  <el-input
    v-model="val"
    clearable
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot name="slot" />
  </el-input>
</template>

<script>
export default {
  name: 'ElInputWrapper',
  props: {
    slotName: {
      type: String,
      default: 'default'
    },
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
