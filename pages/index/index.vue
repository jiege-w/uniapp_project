<template>
	<view class="gg" v-if="token">
		<u-navbar :is-back="false" :background="{ backgroundImage: 'linear-gradient(45deg, rgb(255,180,61), rgb(255, 101, 0))' }">
			<view class="gg-map-slot-wrap u-font-xs u-m-l-20 u-p-l-10 u-p-r-10 u-p-t-5 u-p-b-5" @click="pickUpLocation">
				<u-icon name="map" color="white"></u-icon>
				<text class="u-p-l-10 u-p-r-10">{{ leaderAddressVo.takeName ? leaderAddressVo.takeName : '请设置提货点' }}</text>
				<u-icon name="arrow-right" color="white"></u-icon>
			</view>
		</u-navbar>

		<!-- 主内容与搜索区域 -->
		<view class="gg-content">
			<view class="gg-header u-p-l-20 u-p-r-20">
				<view class="gg-notice-search-bar">
					<u-icon class="gg-notice-search-bar-left-icon" name="search"></u-icon>
					<u-notice-bar
						class="gg-notice-search-bar-u-notice-bar"
						:more-icon="false"
						:border-radius="30"
						:volume-icon="false"
						type="none"
						mode="vertical"
						:list="list"
					></u-notice-bar>
					<u-button class="u-p-r-20" type="error" shape="square" size="mini" :custom-style="ggNoticeSearchBarRightBtnCustomStyle">搜索</u-button>
				</view>
				<view class="gg-new-vip u-p-20 u-m-t-20">
					<view class="u-font-lg u-content-color">新人专享低价好物</view>
					<scroll-view scroll-x enable-flex class="gg-new-vip-sv">
						<view class="u-flex u-m-t-10">
							<view class="gg-new-vip-sv-item u-p-r-20" v-for="item in newPersonSkuInfoList" :key="item.id">
								<ListImgItem :src="item.imgUrl" width="200rpx" height="200rpx"></ListImgItem>
								<text class="u-type-error">￥ {{ item.price }}</text>
								<AddToCart></AddToCart>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>

			<view class="gg-header-bottom"></view>

			<!-- 硅谷优选 -->

			<view class="u-flex u-row-between u-p-20 u-m-20 gg-border" @click="showRulePopup = true">
				<u-image src="/static/logo.png" width="30rpx" height="30rpx"></u-image>
				<view>平台资质、法律条款、规则及投诉入口</view>
			</view>

			<!-- 分类 -->
			<view class="u-m-20 u-p-20 gg-border">
				<scroll-view enable-flex scroll-x @scroll="scrollMove">
					<view class="u-flex u-p-r-20 u-p-t-20">
						<!-- 循环滚动内容 -->
						<view class="u-p-l-20 u-p-r-20" v-for="item in categoryList" :key="item.id">
							<u-image :src="item.imgUrl" border-radius="30rpx" width="100rpx" height="100rpx"></u-image>
							<text class="u-font-xs">{{ item.name }}</text>
						</view>
					</view>
				</scroll-view>
				<view class="gg-category"><u-line-progress class="gg-category-progress" height="5" :show-percent="false" :percent="categorySVPercent"></u-line-progress></view>
			</view>

			<!-- 限时秒杀 -->
			<view class="gg-border">
				<view class="u-m-l-20 u-m-r-20 u-flex">
					<view class="u-flex u-flex-1">
						<view class="u-type-error u-font-lg">
							秒杀抢购：
							<text class="u-font-sm">08:00场 08:00-23:00</text>
						</view>
					</view>
					<u-button :plain="true" size="mini">查看全部 ></u-button>
				</view>
				<view class="u-m-20 u-p-20 gg-border">
					<scroll-view enable-flex scroll-x>
						<view class="u-flex u-p-r-20 u-p-t-20">
							<!-- 循环滚动内容 -->
							<view class="u-p-l-20 u-p-r-20 u-text-center" v-for="n in 10" :key="n">
								<text class="u-font-sm u-m-b-5">08:00</text>
								<u-image src="https://img0.baidu.com/it/u=1832250010,3404880111&fm=26&fmt=auto" border-radius="30rpx" width="200rpx" height="200rpx"></u-image>
								<text class="u-font-sm u-m-t-5">商品名称</text>
								<AddToCart></AddToCart>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>

			<!-- 如何购买商品 -->
			<view class="u-p-20 u-m-20 gg-border u-font-xs">
				<view class="u-m-b-20">如何在[硅谷优选]购买商品</view>

				<view class="u-flex">
					<view class="gg-number u-m-r-10">1</view>
					挑商品
					<u-icon name="arrow-right-double u-m-l-10 u-tips-color"></u-icon>
					<u-icon class="u-content-color" name="arrow-right-double"></u-icon>
					<view class="gg-number gg-number-gray u-m-r-10 u-m-l-10">2</view>
					选提货点
					<u-icon name="arrow-right-double u-m-l-10 u-tips-color"></u-icon>
					<u-icon class="u-content-color" name="arrow-right-double"></u-icon>
					<view class="gg-number gg-number-gray u-m-r-10 u-m-l-10">3</view>
					次日16点提货点取货
				</view>
			</view>

			<!-- 热销好货 -->
			<view class="u-font-xl u-type-error u-m-20">热销好货</view>
			<view class="u-p-20 u-m-20 gg-border" v-for="item in hotSkuList" :key="item.id">
				<view class="u-m-b-10 u-m-l-20 u-m-r-20 u-flex gg-product-item">
					<ListImgItem :src="item.imgUrl" width="200rpx" height="200rpx"></ListImgItem>
					<view class="gg-product-item-msg u-border-bottom u-p-b-20 u-m-l-20">
						<view class="gg-product-item-msg-title">
							<view class="u-font-lg">{{ item.title }}</view>
							<view class="u-type-info u-font-sm">已售 {{ item.sale }}/剩余 {{ item.stock }}</view>
							<view class="u-font-xs u-type-error-dark" v-for="(rule, index) in item.ruleList" :key="rule">{{ rule }}</view>
						</view>
						<view class="u-flex u-row-between">
							<view class="u-type-error gg-product-item-msg-price">
								<text>￥</text>
								<text class="gg-product-item-msg-price-value">{{ item.price }}</text>
							</view>
							<AddToCart></AddToCart>
						</view>
					</view>
				</view>
			</view>

			<!-- 弹出层内容 -->
			<u-popup v-model="showRulePopup" mode="bottom" border-radius="20" :closeable="true">
				<view class="u-p-t-20 u-p-b-20">
					<view class="u-m-20">
						<view class="u-font-xl u-m-b-10">
							<u-icon name="checkmark-circle" color="#dd6161" size="28" class="u-m-r-10"></u-icon>
							品质保障
						</view>
						<view class="u-light-color u-font-xs">全场商品均经过品质检验，若收货时发现商品有变质、腐烂、损坏等情况，可申请退款</view>
					</view>

					<view class="u-m-20">
						<view class="u-font-xl u-m-b-10">
							<u-icon name="kefu-ermai" color="#dd6161" size="28" class="u-m-r-10"></u-icon>
							极速退款
						</view>
						<view class="u-light-color u-font-xs">根据平台的规则，在一定条件下，可享受极速退款到账服务</view>
					</view>

					<view class="u-m-20">
						<view class="u-font-xl u-m-b-10">
							<u-icon name="bag" color="#dd6161" size="28" class="u-m-r-10"></u-icon>
							次日自提
						</view>
						<view class="u-light-color u-font-xs">每日23点前下单，次日16点可到下单门店自提</view>
					</view>

					<view class="u-m-20">
						<view class="u-font-xl u-m-b-10">
							<u-icon name="integral" color="#dd6161" size="28" class="u-m-r-10"></u-icon>
							资质规则
						</view>
						<view class="u-light-color u-font-xs">平台资质、法律条款、规则及投诉入口，点击查看详情</view>
					</view>
				</view>
			</u-popup>
		</view>
	</view>
	<view v-else class="emptyPage"><u-empty mode="page"></u-empty></view>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
export default {
	data() {
		return {
			list: ['寒雨连江夜入吴', '平明送客楚山孤', '洛阳亲友如相问', '一片冰心在玉壶'],
			token: '',
			ggNoticeSearchBarRightBtnCustomStyle: {
				borderRadius: '30rpx'
			},
			showRulePopup: false,
			windowWidth: '',
			categorySVPercent: 0
		};
	},
	onLoad() {
		uni.getSystemInfo({
			success: res => {
				this.windowWidth = res.windowWidth;
			}
		});
	},
	computed: {
		...mapState('indexModule', ['home']),
		...mapGetters('indexModule', ['categoryList', 'hotSkuList', 'newPersonSkuInfoList', 'seckillTime', 'seckillSkuVoList', 'leaderAddressVo'])
	},
	methods: {
		...mapActions('indexModule', ['getHomeIndexAction']),
		scrollMove(e) {
			let scrollWidth = e.detail.scrollWidth;
			let scrollLeft = e.target.scrollLeft;
			let percent = parseInt((scrollLeft / (scrollWidth - this.windowWidth)) * 100);

			this.$u.debounce(() => {
				this.categorySVPercent = percent;
			}, 100);
		},
		pickUpLocation(){
			this.$u.route({
				url:'/pagesLocation/myPickUpLocation/myPickUpLocation',
			})
		}
	},
	watch: {
		'leaderAddressVo.userId': {
			handler(newVal) {
				if (!newVal) {
					uni.redirectTo({
						url: '/pagesLocation/myPickUpLocation/myPickUpLocation'
					});
					console.log('asdasdasdasd');
				}
			},
			deep: true
		}
	},
	mounted() {
		const token = uni.getStorageSync('token');
		this.token = token;
		if (this.$u.test.isEmpty(token)) {
			uni.reLaunch({
				url: '/pages/login/login'
			});
			return;
		}
		this.getHomeIndexAction();
	}
};
</script>

<style lang="scss">
.gg {
	&-map-slot-wrap {
		display: flex;
		align-items: center;
		background-color: rgba(240, 240, 240, 0.35);
		color: #fff;
		border-radius: 100rpx;
	}

	&-content {
		background-color: $u-bg-color;
	}

	/*
		notice-bar头部滚动信息搜索区域
		利用background-image的linear-gradient保持与导航一致的线形渐变色彩
	*/
	&-header {
		background-image: linear-gradient(to right, rgb(255, 180, 61), rgb(255, 101, 0));
		height: 500rpx;
	}

	/* 滚动信息搜索框 */
	&-notice-search-bar {
		display: flex;
		align-items: center;
		background-color: white;
		border-radius: 30rpx;

		/* 滚动信息搜索框左侧图标 */
		&-left-icon {
			position: relative;
			left: 20rpx;
			color: $u-light-color;
		}

		/* 滚动信息搜索框中的字体设置 */
		&-u-notice-bar {
			flex: 1;
			/* 深层穿透修改子组件字体颜色样式 */
			::v-deep .u-news-item {
				color: $u-light-color !important;
			}
		}
	}

	/* 头部区域底部左右圆角区域 */
	&-header-bottom {
		background-image: linear-gradient(to right, rgb(255, 180, 61), rgb(255, 101, 0));
		height: 25rpx;
		border-bottom-left-radius: 25rpx;
		border-bottom-right-radius: 25rpx;
	}

	&-new-vip {
		background-color: white;
		border-radius: 20rpx;
		&-sv {
			height: 320rpx;
			&-item {
				display: flex;
				flex-direction: column;
			}
		}
	}

	&-border {
		border-radius: 20rpx;
		border-bottom: 1rpx solid #f5f5f5;
		box-shadow: 0px 1px 20px 0px rgba(0, 0, 0, 0.1); /*下边阴影 */
	}

	&-category {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 5rpx;
		&-progress {
			width: 10vw;
		}
	}

	&-product-item {
		height: 250rpx;
		&-msg {
			height: 100%;
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			&-price {
				&-value {
					font-size: 50rpx;
				}
			}
		}
	}
}
.emptyPage {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	height: 100vh;
}
</style>
