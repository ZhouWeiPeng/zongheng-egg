module.exports = app => {
	const { router, controller } = app
	// 获取男频书籍筛选项
	router.get('/store/get_male_options', controller.store.get_male_options)
	// 获取女频书籍筛选项
	router.get('/store/get_female_options', controller.store.get_female_options)
	// 获取全部书籍筛选项（男女一起）
	router.get('/store/get_all_options', controller.store.get_all_options)
	// 获取排序方式
	router.get('/store/get_sort_options', controller.store.get_sort_options)
	// 获取书本列表
	router.get('/store/get_book_list', controller.store.get_book_list)

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
	// 获取作品榜单详情
	router.get('/rank/get_works_rank_detail', controller.rank.get_works_rank_detail)
	// 获取读者消费榜详情
	router.get('/rank/get_reader_rank_detail', controller.rank.get_reader_rank_detail)
	// 获取作者人气榜详情
	router.get('/rank/get_writer_rank_detail', controller.rank.get_writer_rank_detail)
	// 获取新书榜的时间筛选项
	router.get('/rank/get_newbook_time_options', controller.rank.get_newbook_time_options)
	// 获取分类和时期的筛选项
	router.get('/rank/get_cate_period_options', controller.rank.get_cate_period_options)
}
