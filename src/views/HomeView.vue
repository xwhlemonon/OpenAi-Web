<template>
  <!--发送模块-->
  <div>
    <div
        style="display: inline-block; margin: 0 auto; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 30%;">
      <span style="font-size: 14px; user-select: none;">系统提示词：</span>{{ systemMessage.content[0].text }}
    </div>
    <el-button link size="large" style="margin-bottom: 10px; margin-left: 5px;" type="primary" @click="handleOpen">
      更改
    </el-button>
    <el-button link size="large" style="margin-bottom: 10px;" type="danger" @click="handleReset">
      重置
    </el-button>
    <el-input
        v-model="userMessage.content[0].text"
        v-loading="isSending"
        :autosize="{minRows: 4, maxRows: 12}"
        placeholder="请在此输入"
        resize="none"
        style="width: 50%; display: block; margin: 10px auto"
        type="textarea"
    />
    <div style="display: block; margin: 10px auto;">
      <el-button
          :disabled="isSending||userMessage.content[0].text.trim() === ''"
          size="large"
          type="primary"
          @click="main"
      >发送消息
      </el-button>
      <el-button link type="danger" @click="handleClear">清空历史记录</el-button>
    </div>
  </div>

  <!--消息块-->
  <div>
    <el-card
        v-for="item in messageLook"
        style="width: 50%; display: block; margin: 10px auto; box-shadow: none; border: 1px solid #000;"
    >
      <el-row :gutter="10">
        <el-col :span="3" style="text-align: right; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          {{ item.role }}
        </el-col>
        <el-col :span="21" style="text-align: left; overflow-wrap: break-word;">{{ item.content[0].text }}</el-col>
      </el-row>
    </el-card>
  </div>

  <!--弹窗-->
  <el-dialog v-model="dialogVisible" :before-close="handleClose" title="系统提示词" width="30%">
    <el-input v-model="dialogData" :autosize="{minRows: 4, maxRows: 12}" resize="none" type="textarea"/>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleDefine">保存</el-button>
    </template>
  </el-dialog>

</template>


<script setup>
import OpenAI from "openai";
import {onMounted, ref} from "vue";
import {ElMessage} from "element-plus";

const openai = new OpenAI({
  apiKey: "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",
  dangerouslyAllowBrowser: true
});

const messageArr = ref([])
const messageLook = ref([]);
const systemMessage = ref({role: "system", content: [{type: "text", text: "你是一只可爱的猫娘！"}]})
const userMessage = ref({role: "user", content: [{type: "text", text: ""}]});

const isSending = ref(false);

async function main() {
  isSending.value = true;
  var messages = [];
  messages.push(systemMessage.value);
  messageArr.value.length !== 0 ? Array.prototype.push.apply(messages, messageArr.value.slice(-20)) : null;
  userMessage.value.content[0].text = userMessage.value.content[0].text.trim();
  messages.push(userMessage.value);
  const completion = await openai.chat.completions.create({
    messages: messages,
    temperature: 1,
    max_tokens: 4095,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    seed: null,
    model: "gpt-4o",
    response_format: {
      type: "text"
    },
    stream: true,
    stream_options: {
      include_usage: true
    }
  });
  var text = "";
  for await (const chunk of completion) {
    if (chunk.choices[0].finish_reason === "stop") {
      messageArr.value.push(userMessage.value);
      messageArr.value.push({role: "assistant", content: [{type: "text", text: text}]})
      localStorage.message = JSON.stringify(messageArr.value);
      messageLook.value = messageArr.value.slice().reverse();
      userMessage.value = {role: "user", content: [{type: "text", text: ""}]};
      isSending.value = false;
      return;
    }
    text += chunk.choices[0].delta.content;
  }
}

// 读取消息记录
const loadMessage = () => {
  messageArr.value = localStorage.message ? JSON.parse(localStorage.message) : [];
  messageLook.value = messageArr.value.slice().reverse();
};

// 读取提示词
const loadSystemText = () => {
  systemMessage.value.content[0].text = localStorage.systemText ? JSON.parse(localStorage.systemText) : "你是一只可爱的猫娘！";
}

// 清空消息记录
const handleClear = () => {
  localStorage.removeItem("message");
  loadMessage();
};

// 弹窗全家桶
const dialogData = ref("");
const dialogVisible = ref(false);
const handleOpen = () => {
  dialogData.value = systemMessage.value.content[0].text;
  dialogVisible.value = true;
};
const handleClose = () => {
  dialogVisible.value = false;
  dialogData.value = "";
};
const handleDefine = () => {
  if (dialogData.value.trim() === "") {
    handleClose();
    ElMessage.warning("提示词不可为空");
    return;
  }
  systemMessage.value.content[0].text = dialogData.value.trim();
  localStorage.systemText = JSON.stringify(systemMessage.value.content[0].text);
  handleClose();
};

// 重置提示词
const handleReset = () => {
  localStorage.removeItem("systemText");
  loadSystemText();
};

// 默认加载
onMounted(() => {
  loadSystemText();
  loadMessage();
});

</script>


<style scoped>

</style>
