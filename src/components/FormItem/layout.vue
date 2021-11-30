<template>
  <el-col :xs="xs" :sm="sm" :md="md" :lg="lg" :xl="xl">
    <slot />
  </el-col>
</template>

<script>
export default {
  name: 'Layout',
  props: {
    xs: {
      type: Number,
      default: 24
    },
    sm: {
      type: Number,
      default: 12
    },
    md: {
      type: Number,
      default: 8
    },
    lg: {
      type: Number,
      default: 6
    },
    xl: {
      type: Number,
      default: 4
    }
  }
}
</script>
