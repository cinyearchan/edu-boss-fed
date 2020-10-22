<template>
  <div class="menu">
    <el-card>
      <el-button @click="$router.push({ name: 'menu-create' })">添加菜单</el-button>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'menu'
})
</script>

<style lang="scss" scoped>

</style>
