<template>

  <div style="position: fixed; text-align: left; z-index: 100;">
    <el-affix :offset="50">
      <div v-for="(item, index) in menu">
        <el-button :style="item.style" link @click="router.push(item.url); indexChange(index)">{{
            item.name
          }}
        </el-button>
      </div>
    </el-affix>
  </div>
  <router-view/>
</template>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>


<script setup>
import router from "@/router";
import {ref} from "vue";

const select = "border-radius: 0; background-color: red; color: #0080FF;";

const menu = ref(sessionStorage.index ? JSON.parse(sessionStorage.index) : [
  {url: "/", name: "首页", style: select},
  {url: "/pic", name: "图库", style: ""},
  {url: "/cloudreve", name: "网盘", style: ""},
  {url: "/setting", name: "设置", style: ""},
]);

const indexChange = (index) => {
  for (let item of menu.value) {
    item.style = "";
  }
  menu.value[index].style = select;
  sessionStorage.index = JSON.stringify(menu.value);
};

</script>
