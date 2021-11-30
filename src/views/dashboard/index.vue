<template>
  <div class="m-4">
    <gen-form-demo />

    <el-divider />

    <demo />
  </div>
</template>

<script>
import Demo from './demo'
import GenFormDemo from './genFormDemo'

export default {
  name: 'Dashboard',
  components: {
    Demo,
    GenFormDemo
  }
}
</script>

