import { ref, watch, reactive, toRefs } from '@vue/composition-api'
import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'
import isString from 'lodash/isString'

function useRequired (rules = ref({}), requiredKey = 'required') {
  const isRequired = ref(false)

  watch(
    rules,
    (rules = {}) => {
      isRequired.value = false
      requiredKey = isString(requiredKey)
        ? requiredKey.split('|')
        : requiredKey

      requiredKey.forEach(key => {
        if (rules[key]) {
          isRequired.value = true
        }
      })
    },
    {
      deep: true
    }
  )

  return { isRequired }
}

function useForm () {
  const state = reactive({
    initialFormValues: {},
    formValues: {}
  })

  const setInitialFormValues = function (formValues) {
    state.initialFormValues = cloneDeep(formValues)
    state.formValues = cloneDeep(formValues)
  }

  const updateFormValues = function (formValues) {
    state.formValues = formValues
  }

  const resetFormValues = function () {
    state.formValues = cloneDeep(state.initialFormValues)
  }

  return {
    ...toRefs(state),

    setInitialFormValues,
    updateFormValues,
    resetFormValues
  }
}

function useFormElement (props, context, options = {}) {
  const { requiredKey = 'required' } = options
  const rules = ref({})
  const dirty = ref(false)
  const localValue = ref(null)
  const initialValue = ref(null)
  const { isRequired } = useRequired(rules, requiredKey)

  const setInitialValue = function (value) {
    initialValue.value = cloneDeep(value)
    localValue.value = cloneDeep(value)

    context.emit('input', localValue.value)
  }

  const resetLocalValue = function () {
    localValue.value = cloneDeep(initialValue.value)

    context.emit('input', localValue.value)
  }

  const updateLocalValue = function (value) {
    if (!isEqual(value, localValue.value)) {
      dirty.value = true
      localValue.value = cloneDeep(value)

      context.emit('input', localValue.value)
    }
  }

  const watchPropValue = function (callback) {
    watch(
      () => props.value,
      value => {
        if (isEqual(value, localValue.value)) {
          return
        }

        callback(value)
      },
      {
        deep: true
      }
    )
  }

  watchPropValue(value => {
    if (!dirty.value) {
      initialValue.value = cloneDeep(value)
    }

    localValue.value = cloneDeep(value)
  })

  watch(
    () => props.rules,
    value => {
      rules.value = value
    }
  )

  return {
    dirty,
    isRequired,
    localValue,
    watchPropValue,
    setInitialValue,
    resetLocalValue,
    updateLocalValue
  }
}

export { useForm, useFormElement, useRequired }
