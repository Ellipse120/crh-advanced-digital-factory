<template>
  <component
    :is="tag"
    ref="editorContent"
    class="text-decoration"
    :placeholder="placeholder"
    :contenteditable="contentEditable"
    v-bind="$attrs"
    @input="handleInput"
  />
</template>

<script>
import debounce from 'lodash/debounce'

export default {
  name: 'EditContent',
  model: {
    prop: 'value',
    event: 'update'
  },
  props: {
    tag: {
      type: String,
      default: 'span'
    },
    value: {
      type: String,
      default: ''
    },
    contentEditable: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    placeholder () {
      if (this.$refs && !this.$refs?.editorContent?.textContent) {
        return '不能为空'
      }
      if (this.contentEditable) {
        return '请输入'
      }
      return ''
    }
  },
  watch: {
    value: {
      handler: function (newVal) {
        this.updateContent(newVal)
      },
      immediate: true
    }
  },
  methods: {
    updateContent (newVal) {
      this.$nextTick(() => {
        if (this.$refs.editorContent) {
          this.$refs.editorContent.textContent = newVal
        }
      })
    },

    handleInput: debounce(function (event) {
      this.emitData(event.target.textContent)
    }, 400),

    emitData (v) {
      this.$emit('update', v)
    }
  }
}
</script>

<style scoped>
.text-decoration {
  @apply outline-none underline decoration-wavy underline-0.3em underline-offset-2 underline-green-500 text-shadow-lg cursor-text p-2 caret-pink-500 opacity-60;
}

.text-decoration:empty::before {
  content: attr(placeholder);
  opacity: 0.5;
}
</style>
