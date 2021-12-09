<template>
  <div class="m-4">
    <details>
      <summary>
        <el-button-wrapper class="mb-2" type="success" @click="getGraphData">获取数据</el-button-wrapper>
      </summary>
      <pre>{{ flowData }}</pre>
    </details>

    <div id="container" class="flex border-2 border-red-300">
      <div id="stencil" class="w-1/5 h-screen relative" />
      <div id="graph-container" class="w-4/5 h-screen" />
    </div>
  </div>
</template>

<script>
import { Addon, Graph, Color, Dom } from '@antv/x6'
import '@antv/x6-vue-shape'
// import { DagreLayout } from '@antv/layout'
import dagre from 'dagre'
import last from 'lodash/last'

// import initData from './initData.json'
import ElButtonWrapper from '@/components/ElButtonWrapper'
import FlowCell from '@/views/x6/flow-cell'

let graph

export default {
  name: 'FlowChart',
  components: { ElButtonWrapper },
  data () {
    return {
      flowData: null
    }
  },
  mounted () {
    graph = new Graph({
      container: document.getElementById('graph-container'),
      grid: true,
      mousewheel: {
        enabled: true,
        zoomAtMousePosition: true,
        modifiers: 'ctrl',
        minScale: 0.5,
        maxScale: 3
      },
      connecting: {
        // router: 'manhattan',
        // connector: {
        // name: 'jumpover',
        // args: {
        //   radius: 8
        // }
        // },
        // connectionPoint: 'anchor',
        allowBlank: false,
        // snap: {
        //   radius: 20
        // },
        // createEdge () {
        //   return new Shape.Edge({
        //     attrs: {
        //       line: {
        //         stroke: '#A2B1C3',
        //         strokeWidth: 2,
        //         sourceMarker: null,
        //         targetMarker: {
        //           name: 'block',
        //           width: 12,
        //           height: 8
        //         }
        //       }
        //     },
        //     zIndex: 0
        //   })
        // },
        validateConnection ({ targetMagnet }) {
          return !!targetMagnet
        }
      },
      highlighting: {
        magnetAdsorbed: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#5F95FF',
              stroke: '#5F95FF'
            }
          }
        }
      },
      resizing: true,
      rotating: true,
      selecting: {
        enabled: true,
        rubberband: true,
        showNodeSelectionBox: true
      },
      snapline: true,
      keyboard: true,
      clipboard: true,
      history: true,
      scroller: true
    })
    // <!--endregion-->

    // #region 初始化 stencil
    const stencil = new Addon.Stencil({
      title: '流程图',
      target: graph,
      stencilGraphWidth: 200,
      stencilGraphHeight: 300,
      collapsable: true,
      groups: [
        {
          title: '基础流程图',
          name: 'group1'
        },
        {
          title: '系统设计图',
          name: 'group2',
          graphHeight: 250,
          layoutOptions: {
            rowHeight: 70
          }
        }
      ],
      layoutOptions: {
        columns: 2,
        columnWidth: 80,
        rowHeight: 55
      }
    })
    document.getElementById('stencil')?.appendChild(stencil.container)
    // #endregion

    // #region 快捷键与事件

    // copy cut paste
    graph.bindKey(['meta+c', 'ctrl+c'], () => {
      const cells = graph.getSelectedCells()
      if (cells.length) {
        graph.copy(cells)
      }
      return false
    })
    graph.bindKey(['meta+x', 'ctrl+x'], () => {
      const cells = graph.getSelectedCells()
      if (cells.length) {
        graph.cut(cells)
      }
      return false
    })
    graph.bindKey(['meta+v', 'ctrl+v'], () => {
      if (!graph.isClipboardEmpty()) {
        const cells = graph.paste({ offset: 32 })
        graph.cleanSelection()
        graph.select(cells)
      }
      return false
    })

    // undo redo
    graph.bindKey(['meta+z', 'ctrl+z'], () => {
      if (graph.history.canUndo()) {
        graph.history.undo()
      }
      return false
    })
    graph.bindKey(['meta+shift+z', 'ctrl+shift+z'], () => {
      if (graph.history.canRedo()) {
        graph.history.redo()
      }
      return false
    })

    // select all
    graph.bindKey(['meta+a', 'ctrl+a'], () => {
      const nodes = graph.getNodes()
      if (nodes) {
        graph.select(nodes)
      }
    })

    // delete
    graph.bindKey('backspace', () => {
      const cells = graph.getSelectedCells()
      if (cells.length) {
        graph.removeCells(cells)
      }
    })

    // zoom
    graph.bindKey(['ctrl+1', 'meta+1'], () => {
      const zoom = graph.zoom()
      if (zoom < 1.5) {
        graph.zoom(0.1)
      }
    })
    graph.bindKey(['ctrl+2', 'meta+2'], () => {
      const zoom = graph.zoom()
      if (zoom > 0.5) {
        graph.zoom(-0.1)
      }
    })

    // 控制连接桩显示/隐藏
    const showPorts = (ports, show) => {
      for (let i = 0, len = ports.length; i < len; i = i + 1) {
        ports[i].style.visibility = show ? 'visible' : 'hidden'
      }
    }

    graph.on('node:mouseenter', () => {
      const container = document.getElementById('graph-container')
      const ports = container.querySelectorAll('.x6-port-body')
      showPorts(ports, true)
    })

    graph.on('node:mouseleave', () => {
      const container = document.getElementById('graph-container')
      const ports = container.querySelectorAll('.x6-port-body')
      showPorts(ports, false)
    })

    graph.on('cell:dblclick', ({ cell, e }) => {
      cell.addTools({
        name: cell.isEdge() ? 'edge-editor' : 'node-editor',
        args: {
          event: e
        }
      })
    })

    graph.on('edge:mouseenter', ({ cell }) => {
      cell.addTools(
        [
          { name: 'source-arrowhead' },
          {
            name: 'target-arrowhead',
            args: {
              attrs: {
                fill: 'red'
              }
            }
          },
          { name: 'vertices' },
          {
            name: 'button-remove',
            args: { distance: -40 }
          }
        ]
      )
    })

    graph.on('edge:mouseleave', ({ cell }) => {
      cell.removeTools()
    })

    // #endregion

    // #region 初始化图形
    const ports = {
      groups: {
        top: {
          position: 'top',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#5F95FF',
              strokeWidth: 1,
              fill: '#fff',
              style: {
                visibility: 'hidden'
              }
            }
          }
        },
        right: {
          position: 'right',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#5F95FF',
              strokeWidth: 1,
              fill: '#fff',
              style: {
                visibility: 'hidden'
              }
            }
          }
        },
        bottom: {
          position: 'bottom',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#5F95FF',
              strokeWidth: 1,
              fill: '#fff',
              style: {
                visibility: 'hidden'
              }
            }
          }
        },
        left: {
          position: 'left',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#5F95FF',
              strokeWidth: 1,
              fill: '#fff',
              style: {
                visibility: 'hidden'
              }
            }
          }
        }
      },
      items: [
        {
          group: 'top'
        },
        {
          group: 'right'
        },
        {
          group: 'bottom'
        },
        {
          group: 'left'
        }
      ]
    }

    Graph.registerNode(
      'custom-rect',
      {
        inherit: 'rect',
        width: 66,
        height: 36,
        attrs: {
          body: {
            strokeWidth: 1,
            stroke: '#5F95FF',
            fill: '#EFF4FF'
          },
          text: {
            fontSize: 12,
            color: '#262626',
            textWrap: {
              ellipsis: true,
              width: -10 // 文本换行
            }
          }
        },
        ports: { ...ports }
      },
      true
    )

    Graph.registerNode(
      'custom-polygon',
      {
        inherit: 'polygon',
        width: 66,
        height: 36,
        attrs: {
          body: {
            strokeWidth: 1,
            stroke: '#5F95FF',
            fill: '#EFF4FF'
          },
          text: {
            fontSize: 12,
            color: '#262626'
          }
        },
        ports: {
          ...ports,
          items: [
            {
              group: 'top'
            },
            {
              group: 'bottom'
            }
          ]
        }
      },
      true
    )

    Graph.registerNode(
      'custom-circle',
      {
        inherit: 'circle',
        width: 45,
        height: 45,
        attrs: {
          body: {
            strokeWidth: 1,
            stroke: '#5F95FF',
            fill: '#EFF4FF'
          },
          text: {
            fontSize: 12,
            color: '#262626'
          }
        },
        ports: { ...ports }
      },
      true
    )

    Graph.registerNode(
      'custom-image',
      {
        inherit: 'rect',
        width: 52,
        height: 52,
        markup: [
          {
            tagName: 'rect',
            selector: 'body'
          },
          {
            tagName: 'image'
          },
          {
            tagName: 'text',
            selector: 'label'
          }
        ],
        attrs: {
          body: {
            strokeWidth: 1,
            stroke: '#26C160',
            fill: '#26C160'
          },
          image: {
            width: 26,
            height: 26,
            refX: 13,
            refY: 16
          },
          label: {
            refX: 3,
            refY: 2,
            textAnchor: 'left',
            textVerticalAnchor: 'top',
            fontSize: 12,
            fill: '#fff'
          }
        },
        ports: { ...ports }
      },
      true
    )

    Graph.registerVueComponent(
      'FlowCell',
      {
        template: `<flow-cell :name="name" @add:cell="handleAdd" />`,
        components: {
          FlowCell
        },
        data () {
          return {
            name: null
          }
        },
        methods: {
          handleAdd (node, key, keyPath) {
            console.log(keyPath)
            this.name = keyPath[0]
            const bg = Color.randomHex()
            const member = createNode(
              `部件${last(keyPath)}`,
              last(keyPath),
              Math.random() < 0.5 ? male : female,
              bg,
              Color.invert(bg, true),
              'custom-vue',
              {
                name: last(keyPath)
              }
            )
            graph.addCell([member, createEdge(node, member)])
            layout()
          }
        }
      },
      true
    )

    Graph.registerNode(
      'custom-vue',
      {
        inherit: 'vue-shape',
        component: 'FlowCell',
        width: 260,
        height: 88,
        attrs: {
          body: {
            strokeWidth: 1,
            stroke: '#26C160',
            fill: 'white'
          },
          image: {
            width: 26,
            height: 26,
            refX: 13,
            refY: 16
          },
          label: {
            refX: 3,
            refY: 2,
            textAnchor: 'left',
            textVerticalAnchor: 'top',
            fontSize: 12,
            fill: '#fff'
          }
        },
        ports: { ...ports }
      },
      true
    )

    Graph.registerEdge(
      'plain-line',
      {
        zIndex: -1,
        attrs: {
          line: {
            fill: 'none',
            strokeLinejoin: 'round',
            strokeWidth: '2',
            stroke: 'green',
            sourceMarker: null,
            targetMarker: null
          }
        }
      },
      true
    )

    // 自定义节点
    Graph.registerNode(
      'org-node',
      {
        // ports: { ...ports },
        width: 260,
        height: 88,
        markup: [
          {
            tagName: 'rect',
            attrs: {
              class: 'card'
            }
          },
          {
            tagName: 'image',
            attrs: {
              class: 'image'
            }
          },
          {
            tagName: 'text',
            attrs: {
              class: 'rank'
            }
          },
          {
            tagName: 'text',
            attrs: {
              class: 'name'
            }
          },
          {
            tagName: 'g',
            attrs: {
              class: 'btn add'
            },
            children: [
              {
                tagName: 'circle',
                attrs: {
                  class: 'add'
                }
              },
              {
                tagName: 'text',
                attrs: {
                  class: 'add'
                }
              }
            ]
          },
          {
            tagName: 'g',
            attrs: {
              class: 'btn del'
            },
            children: [
              {
                tagName: 'circle',
                attrs: {
                  class: 'del'
                }
              },
              {
                tagName: 'text',
                attrs: {
                  class: 'del'
                }
              }
            ]
          }
        ],
        attrs: {
          '.card': {
            rx: 10,
            ry: 10,
            refWidth: '100%',
            refHeight: '100%',
            fill: '#FFF',
            stroke: '#000',
            strokeWidth: 0,
            pointerEvents: 'visiblePainted'
          },
          '.image': {
            x: 16,
            y: 16,
            width: 56,
            height: 56,
            opacity: 0.7
          },
          '.rank': {
            refX: 0.95,
            refY: 0.5,
            fontFamily: 'Courier New',
            fontSize: 13,
            textAnchor: 'end',
            textVerticalAnchor: 'middle'
          },
          '.name': {
            refX: 0.95,
            refY: 0.7,
            fontFamily: 'Arial',
            fontSize: 14,
            fontWeight: '600',
            textAnchor: 'end'
          },
          '.btn.add': {
            refDx: -16,
            refY: 16,
            event: 'node:add'
          },
          '.btn.del': {
            refDx: -44,
            refY: 16,
            event: 'node:delete'
          },
          '.btn > circle': {
            r: 10,
            fill: 'transparent',
            stroke: '#333',
            strokeWidth: 1
          },
          '.btn.add > text': {
            fontSize: 20,
            fontWeight: 800,
            stroke: '#000',
            x: -5.5,
            y: 7,
            fontFamily: 'Times New Roman',
            text: '+'
          },
          '.btn.del > text': {
            fontSize: 28,
            fontWeight: 500,
            stroke: '#000',
            x: -4.5,
            y: 6,
            fontFamily: 'Times New Roman',
            text: '-'
          }
        }
      },
      true
    )
    // 自定义边
    Graph.registerEdge(
      'org-edge',
      {
        zIndex: -1,
        attrs: {
          line: {
            stroke: '#A2B1C3',
            strokeWidth: 2,
            sourceMarker: null,
            targetMarker: null
          }
        }
      },
      true
    )

    const male =
      'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*kUy8SrEDp6YAAAAAAAAAAAAAARQnAQ'
    const female =
      'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*f6hhT75YjkIAAAAAAAAAAAAAARQnAQ'
    // 布局方向
    const dir = 'LR' // LR RL TB BT

    // 监听自定义事件
    function setup () {
      graph.on('node:add', ({ e, node }) => {
        e.stopPropagation()
        const bg = Color.randomHex()
        // const member = createNode(
        //   'Employee',
        //   'New Employee',
        //   Math.random() < 0.5 ? male : female,
        //   bg,
        //   Color.invert(bg, true)
        // )

        console.log(e, node)
        const member = createNode(
          'Senior Vice President Controller',
          'Steven P. Westly',
          male,
          bg,
          Color.invert(bg, true),
          'custom-vue',
          {
            val: '2'
          }
        )
        graph.freeze()
        graph.addCell([member, createEdge(node, member)])
        layout()
      })

      graph.on('node:delete', ({ e, node }) => {
        e.stopPropagation()
        graph.freeze()
        graph.removeCell(node)
        layout()
      })
    }

    // 自动布局
    const layout = () => {
      const nodes = graph.getNodes()
      const edges = graph.getEdges()
      const g = new dagre.graphlib.Graph()
      g.setGraph({ rankdir: dir, nodesep: 16, ranksep: 16 })
      g.setDefaultEdgeLabel(() => ({}))

      const width = 260
      const height = 90
      nodes.forEach((node) => {
        g.setNode(node.id, { width, height })
      })

      edges.forEach((edge) => {
        const source = edge.getSource()
        const target = edge.getTarget()
        g.setEdge(source.cell, target.cell)
      })

      dagre.layout(g)

      graph.freeze()

      g.nodes().forEach((id) => {
        const node = graph.getCell(id)
        if (node) {
          const pos = g.node(id)
          node.position(pos.x, pos.y)
        }
      })

      edges.forEach((edge) => {
        const source = edge.getSourceNode()
        const target = edge.getTargetNode()
        const sourceBBox = source.getBBox()
        const targetBBox = target.getBBox()

        if ((dir === 'LR' || dir === 'RL') && sourceBBox.y !== targetBBox.y) {
          const gap =
            dir === 'LR'
              ? targetBBox.x - sourceBBox.x - sourceBBox.width
              : -sourceBBox.x + targetBBox.x + targetBBox.width
          const fix = dir === 'LR' ? sourceBBox.width : 0
          const x = sourceBBox.x + fix + gap / 2
          edge.setVertices([
            { x, y: sourceBBox.center.y },
            { x, y: targetBBox.center.y }
          ])
        } else if (
          (dir === 'TB' || dir === 'BT') &&
          sourceBBox.x !== targetBBox.x
        ) {
          const gap =
            dir === 'TB'
              ? targetBBox.y - sourceBBox.y - sourceBBox.height
              : -sourceBBox.y + targetBBox.y + targetBBox.height
          const fix = dir === 'TB' ? sourceBBox.height : 0
          const y = sourceBBox.y + fix + gap / 2
          edge.setVertices([
            { x: sourceBBox.center.x, y },
            { x: targetBBox.center.x, y }
          ])
        } else {
          edge.setVertices([])
        }
      })

      graph.unfreeze()
    }

    const createNode = (rank, name, image, background, textColor = '#000', shape = 'org-node', data) => {
      return graph.createNode({
        shape: shape,
        attrs: {
          '.card': { fill: background },
          '.image': { xlinkHref: image },
          '.rank': {
            fill: textColor,
            text: Dom.breakText(rank, { width: 160, height: 45 })
          },
          '.name': {
            fill: textColor,
            text: Dom.breakText(name, { width: 160, height: 45 })
          },
          '.btn > circle': { stroke: textColor },
          '.btn > text': { fill: textColor, stroke: textColor }
        },
        data
      })
    }

    const createEdge = (source, target) => {
      return graph.createEdge({
        shape: 'org-edge',
        source: { cell: source.id },
        target: { cell: target.id }
      })
    }

    const nodes = [
      createNode('Founder & Chairman', 'Pierre Omidyar', male, '#31d0c6'),
      createNode('President & CEO', 'Margaret C. Whitman', female, '#31d0c6'),
      createNode('President, PayPal', 'Scott Thompson', male, '#7c68fc'),
      createNode(
        'President, Ebay Global Marketplaces',
        'Devin Wenig',
        male,
        '#7c68fc'
      ),
      createNode(
        'Senior Vice President Human Resources',
        'Jeffrey S. Skoll',
        male,
        '#fe854f'
      ),
      createNode(
        'Senior Vice President Controller',
        'Steven P. Westly',
        male,
        '#feb663'
      ),
      createNode(
        'Senior Vice President Controller',
        'Steven P. Westly',
        male,
        '#feb663',
        null,
        'custom-vue',
        {
          val: '2'
        }
      )
    ]

    const edges = [
      createEdge(nodes[0], nodes[1]),
      createEdge(nodes[1], nodes[2]),
      createEdge(nodes[1], nodes[3]),
      createEdge(nodes[1], nodes[4]),
      createEdge(nodes[1], nodes[5])
    ]

    graph.resetCells([...nodes, ...edges])
    layout()
    graph.zoomTo(0.8)
    graph.centerContent()
    setup()

    const r1 = graph.createNode({
      shape: 'custom-rect',
      label: '开始',
      attrs: {
        body: {
          rx: 20,
          ry: 26
        }
      }
    })
    const r2 = graph.createNode({
      shape: 'custom-rect',
      label: '过程'
    })
    const r3 = graph.createNode({
      shape: 'custom-rect',
      attrs: {
        body: {
          rx: 6,
          ry: 6
        }
      },
      label: '可选过程'
    })
    const r4 = graph.createNode({
      shape: 'custom-polygon',
      attrs: {
        body: {
          refPoints: '0,10 10,0 20,10 10,20'
        }
      },
      label: '决策'
    })
    const r5 = graph.createNode({
      shape: 'custom-polygon',
      attrs: {
        body: {
          refPoints: '10,0 40,0 30,20 0,20'
        }
      },
      label: '数据'
    })
    const r6 = graph.createNode({
      shape: 'custom-circle',
      label: '连接'
    })

    stencil.load([r1, r2, r3, r4, r5, r6], 'group1')

    const m1 = graph.createNode({
      shape: 'custom-image',
      label: 'Client',
      attrs: {
        body: {
          fill: 'rgba(59, 130, 246, 0.5)'
        },
        image: {
          'xlink:href': require('@/assets/unit/train.png')
        }
      }
    })
    const m2 = graph.createNode({
      shape: 'custom-image',
      label: 'Http',
      attrs: {
        body: {
          stroke: '#2CB9FF',
          fill: '#2CB9FF'
        },
        image: {
          'xlink:href':
            'https://gw.alipayobjects.com/zos/bmw-prod/dc1ced06-417d-466f-927b-b4a4d3265791.svg'
        }
      }
    })
    const m3 = graph.createNode({
      shape: 'custom-image',
      label: 'Api',
      attrs: {
        body: {
          stroke: '#5AB0BE',
          fill: '#5AB0BE'
        },
        image: {
          'xlink:href':
            'https://gw.alipayobjects.com/zos/bmw-prod/c55d7ae1-8d20-4585-bd8f-ca23653a4489.svg'
        }
      }
    })
    const m4 = graph.createNode({
      shape: 'custom-image',
      label: 'Sql',
      attrs: {
        body: {
          stroke: '#E6475B',
          fill: '#E6475B'
        },
        image: {
          'xlink:href':
            'https://gw.alipayobjects.com/zos/bmw-prod/6eb71764-18ed-4149-b868-53ad1542c405.svg'
        }
      }
    })
    const m5 = graph.createNode({
      shape: 'custom-image',
      label: 'Clound',
      attrs: {
        body: {
          stroke: '#DA2625',
          fill: '#DA2625'
        },
        image: {
          'xlink:href':
            'https://gw.alipayobjects.com/zos/bmw-prod/c36fe7cb-dc24-4854-aeb5-88d8dc36d52e.svg'
        }
      }
    })
    const m6 = graph.createNode({
      shape: 'custom-image',
      label: 'Mq',
      attrs: {
        body: {
          stroke: '#FFB15F',
          fill: '#FFB15F'
        },
        image: {
          'xlink:href':
            'https://gw.alipayobjects.com/zos/bmw-prod/2010ac9f-40e7-49d4-8c4a-4fcf2f83033b.svg'
        }
      }
    })

    stencil.load([m1, m2, m3, m4, m5, m6], 'group2')
    // #endregion

    // graph.fromJSON(initData)
  },
  methods: {
    getGraphData () {
      const d = graph.toJSON()
      console.log(d)
      this.flowData = d
    }
  }
}
</script>

<style scoped>

</style>
