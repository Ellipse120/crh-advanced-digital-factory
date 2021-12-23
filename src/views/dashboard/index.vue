<template>
  <div class="m-4">
    <content-editable-with-validation />

    <el-divider />

    <gen-form-demo />

    <el-divider />

    <demo />
  </div>
</template>

<script>
import Demo from './demo'
import GenFormDemo from './genFormDemo'
import ContentEditableWithValidation from './content-editable-with-validation'

export default {
  name: 'Dashboard',
  components: {
    Demo,
    GenFormDemo,
    ContentEditableWithValidation
  }
}
</script>

