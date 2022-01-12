<template>
  <component
    :is="tag"
    ref="editorContent"
    class="text-decoration"
    :class="errorClass"
    :placeholder="placeholder"
    :contenteditable="contentEditable"
    v-bind="$attrs"
    @input="handleInput"
    @blur="handleBlur"
  />
</template>

<script>
// import debounce from 'lodash/debounce'

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
    },
    validator: {
      type: Function,
      default: () => false
    }
  },
  data () {
    return {
      hasError: false
    }
  },
  computed: {
    placeholder () {
      if (this.$refs && !this.$refs?.editorContent?.textContent && this.validator()) {
        return '不能为空'
      }
      return '请输入'
    },
    errorClass () {
      return [
        this.hasError ? 'underline-red-500 transition animate-pulse' : 'underline-green-500',
        this.contentEditable ? 'cursor-text' : 'cursor-not-allowed'
      ]
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

    // handleInput: debounce(function (event) {
    //   this.checkValid()
    //   this.emitData(event.target.textContent)
    // }, 400),
    handleInput (event) {
      this.checkValid()
      this.emitData(event.target.textContent)
    },

    handleBlur (e) {
      this.checkValid()
    },

    checkValid () {
      this.hasError = this.validator ? this.validator() : false
    },

    emitData (v) {
      this.$emit('update', v)
    }
  }
}
</script>

<style scoped>
.text-decoration {
  @apply inline-block outline-none underline underline-0.3em underline-offset-2 text-shadow-lg caret-pink-500 opacity-60;
}

.text-decoration:empty::before {
  content: attr(placeholder);
  opacity: 0.5;
}
</style>
