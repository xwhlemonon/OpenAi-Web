<template>
  <div style="width: 50%; margin: 30px auto 0;">
    <el-form>
      <el-form-item label="API-KEY">
        <el-input v-model="formData.key"></el-input>
      </el-form-item>
    </el-form>
    <el-button @click="handleSave">保存</el-button>
  </div>
</template>


<script setup>
import {ref} from "vue";
import {ElMessage} from "element-plus";

const formData = ref({key: ""});

const handleSave = () => {
  if (localStorage.apiKey) {
    localStorage.removeItem("apiKey");
  }
  localStorage.apiKey = formData.value.key;
  ElMessage.success("key保存成功！");
};

</script>


<style scoped>

</style>
