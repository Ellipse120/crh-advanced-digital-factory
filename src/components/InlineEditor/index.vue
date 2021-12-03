<template>
  <div>
    <span v-if="!status" class="cursor-pointer trainsion-all hover:(text-red-500)" @dblclick="toggle">{{ val }}</span>
    <el-input-wrapper v-if="status" v-model="val" />
    <el-button-wrapper v-if="status" @click="terminate">terminate</el-button-wrapper>
  </div>
</template>

<script>
import { ref, watch } from '@vue/composition-api'
import ElInputWrapper from '@/components/ElInputWrapper'
import ElButtonWrapper from '@/components/ElButtonWrapper'

export default {
  name: 'InlineEditor',
  components: { ElInputWrapper, ElButtonWrapper },
  props: {
    valData: {
      type: [String, Number],
      default: null
    }
  },
  setup (props, { emit }) {
    const status = ref(false)
    const val = ref(null)

    const toggle = () => {
      status.value = !status.value
    }

    const terminate = () => {
      toggle()
      emit('update:valData', val.value)
    }

    watch(
      () => props.valData,
      (newVal) => {
        val.value = newVal
      },
      {
        immediate: true,
        deep: true
      }
    )

    return {
      status,
      val,
      toggle,
      terminate
    }
  }
}
</script>
