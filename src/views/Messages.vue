<template>
  <div class="h-screen flex bg-gray-100">
    <!-- Left sidebar - Contact list -->
    <div class="w-1/3 bg-white border-r">
      <div class="p-4 border-b">
        <h2 class="text-xl font-semibold">Messages</h2>
      </div>
      <div class="overflow-y-auto h-[calc(100vh-4rem)]">
        <div
          v-for="contact in contacts"
          :key="contact.id"
          @click="selectContact(contact)"
          :class="[
            'p-4 hover:bg-gray-50 cursor-pointer',
            selectedContact?.id === contact.id ? 'bg-gray-50' : '',
          ]"
        >
          <div class="flex items-start space-x-3">
            <el-avatar :src="contact.avatar" />
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {{ contact.name }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ contact.lastMessageTime }}
                </p>
              </div>
              <p class="text-sm text-gray-500 truncate text-left">
                {{ contact.lastMessage }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right side - Chat window -->
    <div class="flex-1 flex flex-col">
      <!-- Chat header -->
      <div class="p-4 bg-white border-b flex items-center">
        <el-avatar
          v-if="selectedContact"
          :src="selectedContact.avatar"
          class="mr-3"
        />
        <h3 class="text-lg font-semibold">
          {{ selectedContact ? selectedContact.name : "Select a contact" }}
        </h3>
      </div>

      <!-- Messages area -->
      <div class="flex-1 overflow-y-auto p-4" ref="messagesContainer">
        <template v-if="selectedContact">
          <div
            v-for="message in currentChat"
            :key="message.id"
            :class="[
              'mb-4 flex',
              message.isSelf ? 'justify-end' : 'justify-start',
            ]"
          >
            <div
              :class="[
                'max-w-[70%] rounded-lg p-3',
                message.isSelf ? 'bg-blue-500 text-white' : 'bg-white',
              ]"
            >
              <div v-if="!message.isSelf" class="text-xs text-gray-500 mb-1 text-left">
                {{ message.senderName }}
              </div>
              <p v-if="message.type === 'text'" :class="message.isSelf ? 'text-white text-left' : 'text-black text-left'">
                {{ message.content }}
              </p>
              <div
                v-else-if="message.type === 'task'"
                class="cursor-pointer hover:opacity-90 transition-all duration-200"
                @click="router.push(`/task/${message.content.split(':')[1]}`)"
              >
                <div
                  class="bg-gray-50 hover:bg-gray-100 rounded p-2 border border-gray-200"
                >
                  <div class="flex items-center gap-2 mb-1">
                    <el-icon class="text-blue-500"><Tickets /></el-icon>
                    <span class="font-medium text-black">{{
                      loadedTasks.find(
                        (task) =>
                          String(task.id) === message.content.split(":")[1]
                      )?.title
                    }}</span>
                  </div>
                  <div class="flex justify-end gap-2">
                    <p class="text-sm text-blue-500">
                      ¥
                      {{
                        loadedTasks.find(
                          (task) =>
                            String(task.id) === message.content.split(":")[1]
                        )?.reward
                      }}
                    </p>
                  </div>
                </div>
              </div>
              <div
                v-else-if="message.type === 'product'"
                class="cursor-pointer hover:opacity-90 transition-all duration-200"
                @click="
                  router.push(`/product/${message.content.split(':')[1]}`)
                "
              >
                <div
                  class="bg-gray-50 hover:bg-gray-100 rounded p-2 border border-gray-200"
                >
                  <div class="flex items-center gap-2 mb-1">
                    <el-icon class="text-red-500"><Goods /></el-icon>
                    <span class="font-medium text-black">{{
                      loadedProducts.find(
                        (product) =>
                          String(product.id) === message.content.split(":")[1]
                      )?.title
                    }}</span>
                  </div>
                  <div class="flex justify-end gap-2">
                    <p class="text-sm text-red-500">
                      ¥
                      {{
                        loadedProducts.find(
                          (product) =>
                            String(product.id) === message.content.split(":")[1]
                        )?.price
                      }}
                    </p>
                  </div>
                </div>
              </div>
              <p
                class="text-xs mt-1"
                :class="
                  message.isSelf
                    ? 'text-blue-100 text-right'
                    : 'text-gray-500 text-left'
                "
              >
                {{ message.time }}
              </p>
            </div>
          </div>
        </template>
        <div
          v-else
          class="h-full flex items-center justify-center text-gray-500"
        >
          Select a contact to start chatting
        </div>
      </div>
      <!-- 浮窗 -->
      <div class="p-4 bg-white border-t" v-if="productDetail || taskDetail">
        <div
          v-if="productDetail || taskDetail"
          class="mb-4 p-3 bg-gray-50 rounded-lg"
        >
          <div class="flex justify-between">
            <div class="flex">
              <img
                :src="imageUrls[0]"
                class="w-16 h-16 object-cover rounded mr-3"
                alt="图片"
              />
              <div>
                <h4 class="font-medium text-black">
                  {{ productDetail?.title || taskDetail?.title }}
                </h4>
                <p class="text-red-500 text-sm text-left">
                  报酬：¥{{ productDetail?.reward || taskDetail?.reward }}
                </p>
              </div>
            </div>
            <div class="flex mt-2 items-center">
              <p class="text-sm text-gray-600 mr-3">
                <el-button type="primary" v-if="productDetail">购买</el-button>
                <el-button type="primary" v-if="taskDetail">接单</el-button>
              </p>
              <p class="text-sm text-gray-600">
                <el-button type="primary" @click="sendInfo">发送</el-button>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Message input -->
      <div class="p-4 bg-white border-t" v-if="selectedContact">
        <div class="flex space-x-2">
          <el-input
            v-model="newMessage"
            placeholder="请输入要发送的消息"
            @keyup.enter="sendMessage"
            class="flex-1"
          />
          <el-button
            type="primary"
            @click="sendMessage"
            :disabled="!newMessage.trim()"
          >
            发送
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  watch,
  nextTick,
  onMounted,
  onBeforeUnmount,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { rocketChat } from "../services/rocketChat";
import { ElMessage } from "element-plus";
import axios from "axios";
import { Tickets, Goods } from "@element-plus/icons-vue";

const route = useRoute();
const router = useRouter();
const contacts = ref([]);
const selectedContact = ref(null);
const newMessage = ref("");
const messagesContainer = ref(null);
const chatMessages = ref({});
const productDetail = ref(null);
const taskDetail = ref(null);
const imageUrls = ref([]);
const loadedTasks = ref([]);
const loadedProducts = ref([]);

// Initialize chat connection
const initializeChat = async () => {
  try {
    await rocketChat.connect();

    // Try to login with stored token first
    try {
      await rocketChat.loginWithToken();
    } catch (error) {
      const username = localStorage.getItem("username");
      const password = localStorage.getItem("password");
      if (username && password) {
        await rocketChat.login(username, password);
      } else {
        console.error("No credentials available");
        return;
      }
    }

    // Store current user ID and username
    const currentUserId = rocketChat.userId;
    const currentUsername = localStorage.getItem("username");
    console.log("Current user:", {
      id: currentUserId,
      username: currentUsername,
    });


    // Load direct messages (contacts)
    const directMessages = await rocketChat.loadDirectMessages();
    contacts.value = directMessages
      .filter((room) => room.t === "d") // only direct messages
      .map((room) => {
        // In DMs, the room name is the other user's username
        const otherUsername = room.usernames.filter((u) => u !== currentUsername)[0];
        return {
          id: room._id,
          name: room.fname || otherUsername,
          username: otherUsername,
          avatar: `https://chat.swu.social/avatar/${otherUsername}`,
          lastMessage: room.lastMessage?.msg || "",
          lastMessageTime: room.lastMessage
            ? new Date(
                room.lastMessage.ts.$date || room.lastMessage.ts
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "",
        };
      });


// 订阅用户列表
    contacts.value.forEach((contact) => {
      console.log("Subscribing to room:", contact.id);
      rocketChat.subscribeToRoom(contact.id)
    });
    // Handle route parameter
    const toUsername = route.query.to;
    const productId = route.query.productId;
    const taskId = route.query.taskId;
    if (toUsername) {
      try {
        // Create direct message first
        const result = await rocketChat.createDirectMessage(toUsername);
        const contact = contacts.value.find((c) => c.id === result.rid);
        if (contact) {
          selectContact(contact);
        } else {
          // Create new contact if it doesn't exist
          const newContact = {
            id: result.rid,
            name: toUsername,
            username: toUsername,
            avatar: `https://chat.swu.social/avatar/${toUsername}`,
            lastMessage: "",
            lastMessageTime: "",
          };
          contacts.value.push(newContact);
          chatMessages.value[newContact.id] = [];
          selectContact(newContact);
        }
      } catch (error) {
        console.error("Failed to create direct message:", error);
        ElMessage.error("创建聊天失败：" + error.message);
      }
    }

    if (productId) {
      try {
        const token =
          document.cookie
            .split("; ")
            .find((row) => row.startsWith("DoorKey="))
            ?.split("=")[1] || "";
        const response = await axios.get(`/secondhand/detail/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        productDetail.value = response.data.data;
        // 处理图片URL
        if (
          productDetail.value.imageUrl &&
          productDetail.value.imageUrl.trim() !== ""
        ) {
          imageUrls.value = productDetail.value.imageUrl
            .split(",")
            .filter((url) => url.trim() !== "");
        } else {
          imageUrls.value = [defaultGoodsImg];
        }
      } catch (error) {
        console.error("获取商品详情失败:", error);
        ElMessage.error("获取商品详情失败，请稍后重试");
      }
    }

    if (taskId) {
      try {
        const token =
          document.cookie
            .split("; ")
            .find((row) => row.startsWith("DoorKey="))
            ?.split("=")[1] || "";
        const response = await axios.get(`/task/${taskId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        taskDetail.value = response.data.data;
      } catch (error) {
        console.error("获取任务详情失败:", error);
        ElMessage.error("获取任务详情失败，请稍后重试");
      }
    }

    // Set up message listener
    rocketChat.onNewMessage((data) => {
      if (data.msg === "newMessage") {
        const message = data.message;
        const contactId = message.rid;
        let type = "text";
        if (message.msg.startsWith("<<PRODUCT>>:")) {
          type = "product";
        } else if (message.msg.startsWith("<<TASK>>:")) {
          type = "task";
        }
        if (type === "product") {
          const productId = message.msg.split(":")[1];
          if (
            !loadedProducts.value.find((product) => product.id === productId)
          ) {
            const token =
              document.cookie
                .split("; ")
                .find((row) => row.startsWith("DoorKey="))
                ?.split("=")[1] || "";
            axios
              .get(`/secondhand/detail/${productId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
              .then((response) => {
                loadedProducts.value.push(response.data.data);
              })
              .catch((error) => {
                console.error("获取商品详情失败:", error);
                ElMessage.error("获取商品详情失败，请稍后重试");
              });
          }
        } else if (type === "task") {
          const taskId = message.msg.split(":")[1];
          if (!loadedTasks.value.find((task) => task.id === taskId)) {
            const token =
                document.cookie
                    .split("; ")
                    .find((row) => row.startsWith("DoorKey="))
                    ?.split("=")[1] || "";
            axios
              .get(`/task/${taskId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
              .then((response) => {
                loadedTasks.value.push(response.data.data);
              })
              .catch((error) => {
                console.error("获取任务详情失败:", error);
                ElMessage.error("获取任务详情失败，请稍后重试");
              });
          }
        }

        // Update chat messages
        if (!chatMessages.value[contactId]) {
          chatMessages.value[contactId] = [];
        }

        chatMessages.value[contactId].push({
          id: message._id,
          content: message.msg,
          type: type,
          time: new Date(message.ts.$date || message.ts).toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          ),
          isSelf: message.u.username === currentUsername,
          senderName: message.u.name || message.u.username,
        });

        // Update contact's last message
        const contact = contacts.value.find((c) => c.id === contactId);
        if (contact) {
          contact.lastMessage = message.msg;
          contact.lastMessageTime = new Date(
            message.ts.$date || message.ts
          ).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
        }

        // Scroll to bottom if this is the current chat
        if (selectedContact.value?.id === contactId) {
          scrollToBottom();
        }
      }
    });
  } catch (error) {
    console.error("Failed to initialize chat:", error);
  }
};

const selectContact = async (contact) => {
  selectedContact.value = contact;

  taskDetail.value = null;
  productDetail.value = null;
  imageUrls.value = [];

  // Load message history
  try {
    const messages = await rocketChat.loadMessages(contact.id);
    if (Array.isArray(messages)) {
      const currentUsername = localStorage.getItem("username");
      // Sort messages by timestamp in ascending order (oldest first)
      const sortedMessages = [...messages].sort((a, b) => {
        const timeA = a.ts.$date || a.ts;
        const timeB = b.ts.$date || b.ts;
        return new Date(timeA) - new Date(timeB);
      });
      const products = [];
      const tasks = [];
      chatMessages.value[contact.id] = sortedMessages.map((msg) => {
        let type = "text";
        if (msg.msg.startsWith("<<PRODUCT>>:")) {
          type = "product";
          products.push(msg.msg.split(":")[1]);
        } else if (msg.msg.startsWith("<<TASK>>:")) {
          type = "task";
          tasks.push(msg.msg.split(":")[1]);
        }

        return {
          id: msg._id,
          content: msg.msg,
          type: type,
          time: new Date(msg.ts.$date || msg.ts).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isSelf: msg.u.username === currentUsername,
          senderName: msg.u.name || msg.u.username,
        };
      });
      // 加载商品详情
      for (const productId of products) {
        const token =
          document.cookie
            .split("; ")
            .find((row) => row.startsWith("DoorKey="))
            ?.split("=")[1] || "";
        const response = await axios.get(`/secondhand/detail/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const product = response.data.data;
        if (product.imageUrl && product.imageUrl.trim() !== "") {
          product.imageUrl = product.imageUrl
            .split(",")
            .filter((url) => url.trim() !== "");
        } else {
          product.imageUrl = [defaultGoodsImg];
        }
        loadedProducts.value.push(product);
      }
      // 加载任务详情
      for (const taskId of tasks) {
        const token =
          document.cookie
            .split("; ")
            .find((row) => row.startsWith("DoorKey="))
            ?.split("=")[1] || "";
        const response = await axios.get(`/task/${taskId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const task = response.data.data;
        loadedTasks.value.push(task);
      }
      scrollToBottom();
    }
  } catch (error) {
    console.error("Failed to load messages:", error);
  }
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedContact.value) return;

  const messageContent = newMessage.value.trim();
  newMessage.value = ""; // Clear input immediately for better UX

  try {
    await rocketChat.sendMessage(selectedContact.value.id, messageContent);
    // The UI will be updated through the onNewMessage handler
  } catch (error) {
    console.error("Failed to send message:", error);
    // Optionally show error to user
  }
};

const sendInfo = async () => {
  if (!productDetail.value && !taskDetail.value) {
    ElMessage.warning("请先选择商品或任务");
    return;
  }
  if (productDetail.value) {
    const productId = productDetail.value.id;
    try {
      await rocketChat.sendMessage(
        selectedContact.value.id,
        "<<PRODUCT>>:" + productId
      );
      // The UI will be updated through the onNewMessage handler
    } catch (error) {
      console.error("Failed to send message:", error);
      // Optionally show error to user
    }
  }
  if (taskDetail.value) {
    const taskId = taskDetail.value.id;
    try {
      await rocketChat.sendMessage(
        selectedContact.value.id,
        "<<TASK>>:" + taskId
      );
      // The UI will be updated through the onNewMessage handler
    } catch (error) {
      console.error("Failed to send message:", error);
      // Optionally show error to user
    }
  }
};

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

onMounted(() => {
  initializeChat();
});

onBeforeUnmount(() => {
  rocketChat.disconnect();
});

watch(selectedContact, scrollToBottom);

const currentChat = computed(() => {
  return selectedContact.value
    ? chatMessages.value[selectedContact.value.id] || []
    : [];
});
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
