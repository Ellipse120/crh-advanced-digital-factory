<template>
  <div>
    <component
      :is="group.component"
      v-for="group in config"
      :key="group._key"
      v-bind="group.props"
    >
      <component
        v-bind="comp.props"
        :is="comp.component"
        v-for="comp in group.fields"
        :key="comp.name"
        v-model="formValues[comp.name]"
        :tip="comp.tip"
        :tooltip="comp.tooltip"
        :name="comp.name"
        :hide="comp.hide"
        :rules="comp.rules"
        :label="comp.label"
        :items="comp.items"
        :props="comp.props"
        :extend="comp.extend"
        :metadata="metadata"
        :form-values="formValues"
        @command="handleCommand"
      />
    </component>
  </div>
</template>

<script>
import ElFormItemWrapper from './ElFormItemWrapper'

export default {
  name: 'FormBuilder',
  components: {
    ElFormItemWrapper
  },
  props: {
    form: {
      type: Object,
      required: true
    },
    shares: {
      type: Object,
      default: () => ({})
    },
    config: {
      type: Array,
      default: () => [],
      required: true
    },
    metadata: {
      type: Object,
      default: () => ({})
    }
  },
  setup (props, { emit }) {
    const { formValues, updateFormValues } = props.form

    const prepare = () => {
      const { config, shares, formValues } = props

      const initialValues = {}
      config.forEach((group, index) => {
        group._key = `group_${index}`
        group.fields = group.fields || []
        group.component = group.component || 'div'
        group.fields = group.fields.map(comp => {
          if (!comp.name) {
            throw new Error(
              `Form Builder: name is required, config - ${JSON.stringify(comp, null, 2)}`
            )
          }
          if (comp.defaultValue != null) {
            if (formValues[comp.name] == null) {
              initialValues[comp.name] = comp.defaultValue
            }
          }
          return {
            ...shares,
            ...comp
          }
        })
      })

      updateFormValues(initialValues)
    }

    prepare()

    const handleCommand = (...args) => {
      emit('command', ...args)
    }

    return {
      formValues,
      updateFormValues,
      handleCommand
    }
  }
}
</script>
