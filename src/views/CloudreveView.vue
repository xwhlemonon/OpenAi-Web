<template>
  <div>
    <el-button link size="large" style="margin-top: 50px;" @click="goto">点击进入</el-button>
  </div>
</template>


<script setup>

const goto = () => {
  window.location.href = BASE_URL + ":5212/";
};

</script>


<style scoped>

</style>
