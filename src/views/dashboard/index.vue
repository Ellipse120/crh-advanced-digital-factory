<template>
  <div class="m-4">
    <pre>
      x: {{ x }}
      y: {{ y }}
    </pre>
    <el-row :gutter="8">
      <el-col :span="24">
        <el-input v-model="tt" clearable />
      </el-col>
      <el-col :span="24">
        <pre class="bg-red-500 text-white p-4 rounded">{{ tt }}</pre>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import { useMouse } from '@vueuse/core'
import { onMounted, ref } from '@vue/composition-api'

export default {
  name: 'Dashboard',
  setup () {
    // tracks mouse position
    const { x, y } = useMouse()
    const tt = ref(null)

    onMounted(() => {
      console.log('MOUNTED')
    })
    return { x, y, tt }
  }
}
</script>

