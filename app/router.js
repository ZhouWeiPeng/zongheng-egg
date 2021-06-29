module.exports = app => {
	const { router, controller } = app
	// 获取男频书籍筛选条件
	router.get('/store/filters/get_male_filters', controller.filters.get_male_filters)
	// 获取女频书籍筛选条件
	router.get('/store/filters/get_female_filters', controller.filters.get_female_filters)
	// 获取全部书籍筛选条件（男女一起）
	router.get('/store/filters/get_all_filters', controller.filters.get_all_filters)
	// 获取排序方式
	router.get('/store/filters/get_sort_modes', controller.filters.get_sort_modes)

	// 获取首页大轮播图
	router.get('/home/get_main_banner', controller.home.get_main_banner)
	// 获取品书试读
	router.get('/home/get_try_read_books', controller.home.get_try_read_books)
	// 获取经典完本轮播
	router.get('/home/get_classic_end_books', controller.home.get_classic_end_books)

	// 获取人气榜单（榜单概览）
	router.get('/rank/get_overview_list', controller.rank.get_overview_list)
	// 获取所有榜单信息
	router.get('/rank/get_all_ranks', controller.rank.get_all_ranks)
}
