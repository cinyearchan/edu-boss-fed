<template>
  <div class="alloc-resource">
    <el-card class="clearfix">
      <div slot="header">
        <span>分配资源</span>
        <el-button @click="$router.push({ name: 'role' })" type="primary">返回</el-button>
      </div>
      <el-tree
        v-loading="isLoading"
        ref="resource-tree"
        node-key="id"
        :data="resources"
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
// import { getMenuNodeList, allocRoleMenus, getRoleMenus } from '@/services/menu'
import { getAllResource, allocRoleResources, getRoleResources } from '@/services/resource'
import { Tree } from 'element-ui'

export default Vue.extend({
  name: 'AllocResource',
  props: {
    roleId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      isLoading: false,
      resources: [],
      defaultProps: {
        children: 'subResourceList',
        label: 'name'
      },
      checkedKeys: []
    }
  },
  created () {
    this.loadResources()
    this.laodRoleResources()
  },
  methods: {
    async laodRoleResources () {
      const { data } = await getRoleResources(this.roleId)
      this.getCheckedKeys(data.data)
    },
    getCheckedKeys (resources: any) {
      resources.forEach((resource: any) => {
        if (resource.selected) {
          this.checkedKeys = [...this.checkedKeys, resource.id] as any
        }
        if (resource.subResourceList) {
          this.getCheckedKeys(resource.subResourceList)
        }
      })
    },
    async loadResources () {
      this.isLoading = true
      const { data } = await getAllResource()
      this.resources = data.data
      this.isLoading = false
    },
    async onSave () {
      // console.log('save')
      const menuIdList = (this.$refs['menu-tree'] as Tree).getCheckedKeys()
      try {
        const { data } = await allocRoleResources({
          roleId: this.roleId,
          menuIdList
        })
        // console.log(data)
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
