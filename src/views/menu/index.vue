<template>
  <div class="menu">
    <el-card class="box-card">
      <div class="clearfix" slot="header">
        <el-button @click="$router.push({ name: 'menu-create' })">添加菜单</el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getAllMenus } from '@/services/menu'

export default Vue.extend({
  name: 'MenuIndex',
  data () {
    return {
      menuList: []
    }
  },
  methods: {
    async loadAllMenus () {
      const { data } = await getAllMenus()
      console.log(data)
    }
  },
  created () {
    this.loadAllMenus()
  }
})
</script>

<style lang="scss" scoped>

</style>
