// request的二次封装
const install = (Vue, vm) => {
	Vue.prototype.$u.http.setConfig({
		baseUrl: 'https://gmall-prod.atguigu.cn/api',
		loadingText: '努力加载中~',
		loadingTime: 800,
	});

	// 请求拦截
	Vue.prototype.$u.http.interceptor.request = (config) => {
		config.header.token = uni.getStorageSync('token')
		return config;
	}

	// 响应拦截
	Vue.prototype.$u.http.interceptor.response = (res) => {
		// 对于后台返回的数据先要进行的是正确数据判断
		if (res.code === 200) {
			return res.data;
		} else if (res.code === 208) {
			// 未登录，token 未定义或者已过期
			uni.reLaunch({
				url: '/pages/login/login'
			})
			return false;
		} else {
			// 其它错误提示
			uni.showToast({
				title: res.message,
				icon: 'none'
			})
			return false;
		}

	}
}

export default {
	install
}
