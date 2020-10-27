<template>
  <div class="alloc-menu">
    <el-card class="clearfix">
      <div slot="header">
        <span>分配权限</span>
        <el-button @click="$router.push({ name: 'role' })" type="primary">返回</el-button>
      </div>
      <el-tree
        v-loading="isLoading"
        ref="menu-tree"
        node-key="id"
        :data="menus"
        :props="defaultProps"
        :default-checked-keys="checkedKeys"
        show-checkbox
        default-expand-all
      ></el-tree>
      <div style="text-align:center;">
        <el-button @click="resetChecked">清空</el-button>
        <el-button type="primary" @click="onSave">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getMenuNodeList, allocRoleMenus, getRoleMenus } from '@/services/menu'
import { Tree } from 'element-ui'

export default Vue.extend({
  name: 'AllocMenu',
  props: {
    roleId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      isLoading: false,
      menus: [],
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      },
      checkedKeys: []
    }
  },
  created () {
    this.loadMenus()
    this.laodRoleMenus()
  },
  methods: {
    async laodRoleMenus () {
      const { data } = await getRoleMenus(this.roleId)
      this.getCheckedKeys(data.data)
    },
    getCheckedKeys (menus: any) {
      menus.forEach((menu: any) => {
        if (menu.selected) {
          this.checkedKeys = [...this.checkedKeys, menu.id] as any
        }
        if (menu.subMenuList) {
          this.getCheckedKeys(menu.subMenuList)
        }
      })
    },
    async loadMenus () {
      this.isLoading = true
      const { data } = await getMenuNodeList()
      this.menus = data.data
      this.isLoading = false
    },
    async onSave () {
      // console.log('save')
      const menuIdList = (this.$refs['menu-tree'] as Tree).getCheckedKeys()
      try {
        const { data } = await allocRoleMenus({
          roleId: this.roleId,
          menuIdList
        })
        console.log(data)
        if (data.code === '000000') {
          this.$message.success('操作成功')
          this.$router.push({ name: 'role' })
        } else {
          this.$message.error('操作失败')
        }
      } catch (err) {
        console.log(err)
        this.$message.error('操作失败')
      }
    },
    resetChecked () {
      (this.$refs['menu-tree'] as Tree).setCheckedKeys([])
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
