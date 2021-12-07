<template>
  <div class="">
    <el-button type="success" @click="doAdd">{{ val }}</el-button>
    <el-menu :default-active="activeIndex" class="" mode="horizontal" @select="handleSelect">
      <el-submenu index="2">
        <template slot="title">
          <span class="text-red-500">部件</span>
        </template>
        <el-menu-item index="2-1">部件1</el-menu-item>
        <el-menu-item index="2-2">部件2</el-menu-item>
        <el-menu-item index="2-3">部件3</el-menu-item>
        <el-submenu index="2-4">
          <template slot="title">部件4</template>
          <el-menu-item index="2-4-1">部件4-1</el-menu-item>
          <el-menu-item index="2-4-2">部件4-2</el-menu-item>
          <el-menu-item index="2-4-3">部件4-3</el-menu-item>
        </el-submenu>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'FlowCell',
  inject: ['getGraph', 'getNode'],
  props: {
    name: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      activeIndex: '1',
      val: '1'
    }
  },
  watch: {
    name: {
      handler (newVal) {
        this.val = newVal
      },
      immediate: true
    }
  },
  mounted () {
    const node = this.getNode()
    const { name } = node.getData()

    this.val = name
    // const graph = this.getGraph()
    //
    // graph.on('cell:change:data', (n) => {
    //   console.log(n)
    //   this.val = n.current.val
    //
    //   // graph.addCell([member, createEdge(node, member)])
    // })
  },
  methods: {
    handleSelect (key, keyPath) {
      const node = this.getNode()

      this.$emit('add:cell', node, key, keyPath)
    },

    doAdd () {
      // const node = this.getNode()
      // const { val } = node.getData()
      //
      // this.$emit('add:cell', node, val)
    }
  }
}
</script>
