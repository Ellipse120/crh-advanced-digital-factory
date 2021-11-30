<template>
  <validation-provider v-slot="{ errors }" :rules="rules">
    <el-form-item :size="size" :required="isRequired" :error="errors[0]">
      <template #label>
        <span>{{ label }}</span>
        <span v-if="tooltip">
          <el-tooltip :content="tooltip" placement="top">
            <i class="el-icon-question" />
          </el-tooltip>
        </span>
      </template>

      <component
        :is="component"
        v-if="isSelect"
        v-bind="props"
        :value="localValue"
        @input="updateLocalValue"
      >
        <el-option v-for="item in items" :key="item.value" :value="item.value">
          {{ item.label }}
        </el-option>
      </component>

      <component
        :is="component"
        v-else-if="isRadio"
        v-bind="props"
        :value="localValue"
        @input="updateLocalValue"
      >
        <el-radio v-for="item in items" :key="item.value" :label="item.value">
          {{ item.label }}
        </el-radio>
      </component>

      <component
        :is="component"
        v-else-if="isCheckbox"
        v-bind="props"
        :value="localValue"
        @input="updateLocalValue"
      >
        <el-checkbox
          v-for="item in items"
          :key="item.value"
          :label="item.value"
        >
          {{ item.label }}
        </el-checkbox>
      </component>

      <component
        :is="component"
        v-else
        v-bind="props"
        :value="localValue"
        @input="updateLocalValue"
      />
      <div v-if="tip" class="el-form-item__tip">{{ tip }}</div>
    </el-form-item>
  </validation-provider>
</template>

<script>
import { computed } from '@vue/composition-api'
import { ValidationProvider } from 'vee-validate'
import { useFormElement } from '@/components/FormBuilder/form'

export default {
  name: 'ElFormItemWrapper',
  components: {
    ValidationProvider
  },
  props: {
    tip: String,
    tooltip: String,
    name: String,
    size: {
      type: String,
      default: 'medium'
    },
    label: String,
    rules: {
      type: [String, Object]
    },
    value: {
      type: Boolean,
      required: false
    },
    props: {
      type: Object,
      default () {
        return {}
      },
      required: false
    },
    items: {
      type: Array,
      default () {
        return []
      },
      required: false
    },
    extend: {
      type: Object,
      default () {
        return {}
      }
    },
    metadata: {
      type: Object,
      default () {
        return {}
      }
    },
    formValues: {
      type: Object,
      default: () => ({}),
      required: false
    }
  },
  setup (props, context) {
    const { dirty, isRequired, localValue, setInitialValue, updateLocalValue } = useFormElement(props, context)

    const component = computed(() => props.extend.component || 'el-input')

    const isSelect = computed(() => component === 'el-select')
    const isMultipleSelect = computed(() => isSelect && props.props.multiple)
    const isRadio = computed(() => component === 'el-radio-group')
    const isCheckbox = computed(() => component === 'el-checkbox-group')

    return {
      dirty,
      isRequired,
      localValue,
      setInitialValue,
      updateLocalValue,
      component,
      isSelect,
      isMultipleSelect,
      isRadio,
      isCheckbox
    }
  }
}
</script>
