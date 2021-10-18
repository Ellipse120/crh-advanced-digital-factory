<template>
  <div />
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'OrganizationData',
  async created () {
    await this.getAllOrganizations()
  },
  methods: {
    ...mapActions('permission', ['getAllOrganizations'])
  }

}
</script>

<style scoped>

</style>
