<template>
  <div>
    <pre>{{ model }}</pre>
    lorem ipsum <edit-content v-model="model.a" /> Lorem ipsum dolor sit amet, <edit-content v-model="model.b" :content-editable="false" /> consectetur adipisicing elit. A beatae cum eaque facilis maxime minus nihil perspiciatis quibusdam reiciendis repellendus, <edit-content v-model="model.c" /> vero voluptas <edit-content v-model="model.d" /> voluptatum! Dignissimos, et, recusandae. Aliquid corporis excepturi reprehenderit?
  </div>
</template>

<script>
import EditContent from './edit-content'

export default {
  name: 'ContentEditableWithValidation',
  components: {
    EditContent
  },
  data () {
    return {
      model: {
        a: '1',
        b: '2',
        c: '中国🇨🇳',
        d: ''
      }
    }
  },
  methods: {
    checkValid ({ element, validators = [] }, setErrors, errorClass) {
      return async () => {
        element.setCustomValidity('')
        element.checkValidity()
        let message = element.validationMessage
        if (!message) {
          for (const validator of validators) {
            const text = await validator(element)
            if (text) {
              element.setCustomValidity(text)
              break
            }
          }
          message = element.validationMessage
        }
        if (message) {
          errorClass && element.classList.toggle(errorClass, true)
          setErrors({ [element.name]: message })
        }
      }
    },

    useForm ({ errorClass }) {
      const fields = {}
      let errors = []
      const setErrors = (v) => {
        errors = v
      }

      const validate = (ref, accessor) => {
        const validators = accessor() || []
        let config
        fields[ref.name] = config = { element: ref, validators }
        ref.onblur = this.checkValid(config, setErrors, errorClass)
        ref.oninput = () => {
          if (!errors[ref.name]) return
          setErrors({ [ref.name]: undefined })
          errorClass && ref.classList.toggle(errorClass, false)
        }
      }

      const formSubmit = (ref, accessor) => {
        const callback = accessor() || (() => {
        })
        ref.setAttribute('novalidate', '')
        ref.onsubmit = async (e) => {
          e.preventDefault()
          let errored = false

          for (const k in fields) {
            const field = fields[k]
            await this.checkValid(field, setErrors, errorClass)()
            if (!errored && field.element.validationMessage) {
              field.element.focus()
              errored = true
            }
          }
          !errored && callback(ref)
        }
      }

      return { validate, formSubmit, errors }
    }

  }
}
</script>

