<template>
  <div class="m-4">
    <demo />
  </div>
</template>

<script>
import Demo from './demo'
import { useMouse } from '@vueuse/core'
import { onMounted, ref } from '@vue/composition-api'

export default {
  name: 'Dashboard',
  components: {
    Demo
  },
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

