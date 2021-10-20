<template>
  <div id="app">
    <pre>
      x: {{ x }}
      y: {{ y }}
    </pre>
    <el-input v-model="tt" />
    <div class="bg-red-500 text-white m-2">{{ tt }}</div>
    <router-view />
  </div>
</template>

<script>
import { useMouse } from '@vueuse/core'
import { ref, onMounted } from '@vue/composition-api'

export default {
  name: 'App',
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
