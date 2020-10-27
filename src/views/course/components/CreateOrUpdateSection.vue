<template>
  <el-dialog
    class="section-update"
    title="章节信息"
    :visible.sync="sectionDialogVisible"
    width="70%"
    :before-close="handleClose"
  >
    <el-form label-width="80px" :model="section">
      <el-form-item label="课程名称">
        <el-input v-model="section.courseName"></el-input>
      </el-form-item>
      <el-form-item label="章节名称">
        <el-input v-model="section.sectionName"></el-input>
      </el-form-item>
      <el-form-item label="章节描述">
        <el-input v-model="section.description"></el-input>
      </el-form-item>
      <el-form-item label="章节排序">
        <el-input type="number" v-model="section.orderNum">
          <template slot="append">
            <span>数字控制排序，数字越大越靠后</span>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </span>
  </el-dialog>

</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'CreateOrUpdateSection',
  props: {
    section: {
      type: Object
    }
  },
  data () {
    return {
      sectionDialogVisible: false
    }
  },
  methods: {
    handleCancel () {
      console.log('cancel')
      this.sectionDialogVisible = false
    },
    handleSubmit () {
      console.log('submit')
      this.sectionDialogVisible = false
    },
    handleClose () {
      // this.$emit('close')
      this.sectionDialogVisible = false
    },
    showDialog () {
      this.sectionDialogVisible = true
    }
  },
  watch: {
    sectionDialogVisible (val) {
      if (!val) {
        this.$emit('sectionDialogHide')
      }
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
