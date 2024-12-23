<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
    <!-- 返回按钮 -->
    <div class="mb-4">
      <el-button type="default" @click="goBack" class="flex items-center gap-2">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
    </div>
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <!-- 商品图片展示区 -->
      <div class="flex flex-col md:flex-row">
        <div class="md:w-1/2 p-4">
          <el-carousel
            height="400px"
            indicator-position="outside"
            class="rounded-lg overflow-hidden mb-2"
          >
            <el-carousel-item v-for="(url, index) in imageUrls" :key="index">
              <img
                :src="url"
                :alt="product.title"
                class="w-full h-full object-cover"
              />
            </el-carousel-item>
          </el-carousel>
        </div>

        <!-- 商品信息区 -->
        <div class="md:w-1/2 p-6">
          <div class="flex justify-between items-start">
            <h1 class="text-2xl font-bold text-gray-900">
              {{ product.title }}
            </h1>
            <el-tag :type="getStatusType(product.status)" class="ml-4">
              {{ getStatusText(product.status) }}
            </el-tag>
          </div>

          <div class="mb-6">
            <p class="text-3xl font-bold text-red-600">¥{{ product.price }}</p>
          </div>

          <div class="mb-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-2">商品详情</h2>
            <p class="text-gray-600">{{ product.description }}</p>
          </div>

          <div class="mb-6">
            <div class="flex items-center gap-4">
              <span class="text-gray-600">库存：{{ product.stock }}</span>
            </div>
          </div>

          <!-- 购买按钮 -->
          <!-- <div class="mt-6">
            <el-button
              type="primary"
              class="w-full !bg-[#7269ef] hover:!bg-[#8982f1] border-none"
              :disabled="!canBuyProduct(product)"
            >
              {{ getActionButtonText(product?.status) }}
            </el-button>
          </div> -->
          <div class="mt-6">
            <el-button
              type="primary"
              class="w-full !bg-[#1469ef] hover:!bg-[#1482f1] border-none mt-2"
              @click="
                router.push(
                  `/messages?to=${product?.seller?.username}&productId=${product?.id}`
                )
              "
            >
              聊天
            </el-button>
          </div>
        </div>
      </div>

      <!-- 卖家信息区
      <div class="border-t border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">卖家信息</h2>
        <div class="flex items-center">
          <el-avatar :size="50" :src="sellerAvatar" />
          <div class="ml-4">
            <p class="font-semibold">{{ sellerName }}</p>
            <p class="text-sm text-gray-500">信用评分：{{ sellerRating }}</p>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { ArrowLeft } from "@element-plus/icons-vue";
import axios from "axios";
import defaultGoodsImg from "@/assets/goods/default-goods-img.png";

const router = useRouter();
const route = useRoute();
const product = ref({});
const imageUrls = ref([defaultGoodsImg]); // 默认使用默认图片
const sellerName = ref("加载中...");
const sellerRating = ref("--");
const sellerAvatar = ref("");

// 获取状态类型
const getStatusType = (status) => {
  const typeMap = {
    ON_SALE: "success",
    SOLD: "info",
    OFF_SHELF: "danger",
  };
  return typeMap[status] || "info";
};

// 获取状态文本
const getStatusText = (status) => {
  const textMap = {
    ON_SALE: "在售",
    SOLD: "已售出",
    OFF_SHELF: "已下架",
  };
  return textMap[status] || status;
};

// 检查是否可以购买
const canBuyProduct = (product) => {
  return product && product.status === "ON_SALE" && product.stock > 0;
};

// 获取操作按钮文本
const getActionButtonText = (status) => {
  const textMap = {
    ON_SALE: "立即购买",
    SOLD: "已售罄",
    OFF_SHELF: "已下架",
  };
  return textMap[status] || "立即购买";
};

// 获取商品详情
const fetchProductDetail = async () => {
  try {
    // 从localStorage获取商品列表
    const token =
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("DoorKey="))
        ?.split("=")[1] || "";
    const response = await axios.get(`/secondhand/detail/${route.params.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data?.success) {
      ElMessage.warning(response.data?.message || "获取商品详情失败");
      return;
    }

    product.value = response.data.data;

    // 处理图片URL
    if (product.value.imageUrl && product.value.imageUrl.trim() !== "") {
      imageUrls.value = product.value.imageUrl
        .split(",")
        .filter((url) => url.trim() !== "");
    } else {
      imageUrls.value = [defaultGoodsImg];
    }
  } catch (error) {
    console.error("获取商品详情失败:", error);
    ElMessage.error("获取商品详情失败");
  }
};

// 联系卖家
const contactSeller = () => {
  // TODO: 实现联系卖家功能
  ElMessage.info("联系卖家功能开发中...");
};

// 返回上一页
const goBack = () => {
  const lastPage = localStorage.getItem("lastMarketPage") || 1;
  router.push(`/market?page=${lastPage}`);
};

onMounted(() => {
  fetchProductDetail();
});
</script>

<style scoped>
.el-carousel__item {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
}
</style>
