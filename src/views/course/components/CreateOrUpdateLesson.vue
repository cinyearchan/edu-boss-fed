<template>
  <el-dialog
    class="lesson-update"
    title="课时基本信息"
    :visible.sync="lessonDialogVisible"
    width="70%"
    :before-close="handleClose"
  >
    <el-form label-width="80px" :model="lesson">
      <el-form-item label="课程名称" prop="courseName">
        <el-input v-model="course.courseName" disabled></el-input>
      </el-form-item>
      <el-form-item label="章节名称" prop="sectionName">
        <el-input v-model="lesson.sectionName" disabled></el-input>
      </el-form-item>
      <el-form-item label="课时名称" prop="lessonName">
        <el-input v-model="lesson.theme"></el-input>
      </el-form-item>
      <el-form-item label="时长" prop="duration">
        <el-input type="number" v-model="lesson.duration">
          <template slot="append">
            <span>分钟</span>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="是否开放试听" prop="isFree">
        <el-switch v-model="lesson.isFree"></el-switch>
      </el-form-item>
      <el-form-item label="课时排序" prop="orderNum">
        <el-input type="number" v-model="lesson.orderNum">
          <template slot="append">
            <span>数字控制排序，数字越大越靠后</span>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <span class="dialog-footer" slot="footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'CreateOrUpdateLesson', // 创建或编辑课时
  props: {
    lesson: {
      type: Object
    },
    course: {
      type: Object
    }
  },
  data () {
    return {
      lessonDialogVisible: false
    }
  },
  methods: {
    handleCancel () {
      this.lessonDialogVisible = false
    },
    handleSubmit () {
      // this.lessonDialogVisible = false
      this.$emit('submitLessonData', this.lesson)
    },
    handleClose () {
      this.lessonDialogVisible = false
    },
    showDialog () {
      this.lessonDialogVisible = true
    }
  },
  watch: {
    lessonDialogVisible (val) {
      if (!val) {
        this.$emit('lessonDialogHide')
      }
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
