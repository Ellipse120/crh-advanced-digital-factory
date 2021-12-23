<template>
  <div>
    <pre>{{ model }}</pre>
    lorem ipsum <edit-content v-model.trim="model.a" :validator="() => !model.a" /> Lorem ipsum dolor sit amet, <edit-content v-model="model.b" :content-editable="false" /> consectetur adipisicing elit. A beatae cum eaque facilis maxime minus nihil perspiciatis quibusdam reiciendis repellendus, <edit-content v-model="model.c" /> vero voluptas <edit-content v-model="model.d" :validator="() => !model.d" /> voluptatum! Dignissimos, et, recusandae. Aliquid corporis excepturi reprehenderit?
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
  }
}
</script>

