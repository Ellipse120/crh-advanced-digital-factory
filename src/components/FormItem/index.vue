<script>
import layout from './layout'

export default {
  name: 'FormItem',
  components: {
    layout
  },
  props: {
    layoutConfig: {
      type: Object,
      default: () => ({})
    }
  },
  render (h) {
    return h(
      layout,
      {
        props: this.layoutConfig
      },
      this.$slots.default
    )
  }
}
</script>
