const { Service } = require('egg')
const qs = require('querystring')

module.exports = class extends Service {
	#server_url = `http://book.zongheng.com/store`

	#search_url = 'http://search.zongheng.com/s'

	#gender_map = new Map([
		[0, '男生频道'],
		[1, '女生频道']
	])

	#key_map = new Map([
		['作品分类', 'categoryid'],
		['写作进度', 'serialstatus'],
		['作品字数', 'totalword'],
		['更新时间', 'updatetime'],
		['书名首字母', 'firstchar'],
		['其他', 'vip']
	])

	/**
	 * 获取单性别筛选项
	 * @param {0|1} type 0男频 1女频
	 * @returns {Promise<Array>}
	 */
	async get_single_options(type = 0) {
		const url = `${this.#server_url}/c0/c0/b${type}/u0/p1/v9/s9/t0/u0/i1/ALL`
		const $ = await this.ctx.service.cheerio.fetch(url)
		const key_map = this.#key_map
		return $('div.select_con div.kind div.bz').map(function () {
			const el = $(this)
			const title = el.text().replace('：', '')
			const key = key_map.get(title)
			const options = el.next().children().map(function () {
				const item = $(this)
				const label = item.text()
				const value = item.attr(key)
				return { label, value }
			}).get()
			return { title, options }
		}).get()
	}

	/**
	 * 获取全部书籍筛选条件
	 * @returns {Promise<Array>}
	 */
	async get_all_options() {
		const genders = [...this.#gender_map.keys()]
		const res = await Promise.allSettled(genders.map(type => this.get_single_options(type)))
		const is_err = res.some(item => item.status != 'fulfilled')
		if (is_err) return null
		return genders.map((type, i) => ({
			title: this.#gender_map.get(type),
			options: res[i].value
		}))
	}

	/**
	 * 获取排序方式
	 * @returns {Promise<Array>}
	 */
	async get_sort_options() {
		const $ = await this.ctx.service.cheerio.fetch(this.#server_url)
		return $('div.sort div.kind div.nr div.sort_form').map(function () {
			const is_multiple = $(this).hasClass('dropdown')
			const el = $('a.store', this)
			if (!is_multiple)
				return {
					label: el.text(),
					value: el.attr('order')
				}
			const options = el.map(function () {
				const item = $(this)
				return {
					label: item.text(),
					value: item.attr('order')
				}
			}).get()
			return { options }
		}).get()
	}

	/**
	 * 获取书本列表
	 * @returns {Promise<Array>}
	 */
	async get_book_list(query) {
		const key_map = [
			['cate_id', 'c', '0'], // 分类
			['c_cate_id', 'c', '0'], // 子分类
			['gender', 'b', '0'], // 性别
			['order', 'u', '0'], // 排序方式
			['page', 'p', '1'], // 页码
			['other', 'v', '9'], // 其他
			['progress', 's', '9'], // 写作进度
			['total_word', 't', '0'], // 总字数
			['update_time', 'u', '0'], // 更新时间
			['style_type', 'i', '1'], // 排版样式
			['first_char', '', 'ALL'] // 首字母
		]
		const queryStr = key_map.reduce((total, [key, prefix, defVal]) => `${total}/${prefix}${query[key] || defVal}`, '')
		const url = this.#server_url + queryStr
		const $ = await this.ctx.service.cheerio.fetch(url)
		const { page, count, total } = $('.pagebar')?.attr() || {}
		const is_overflow = query.page > (count || 1)
		return {
			page,
			count,
			total,
			list: is_overflow ? [] : $('.bookbox').map(function () {
				const book_el = $('.bookimg a', this)
				const { src, alt } = book_el.children('img').attr()
				const bookilnk_el = $('.bookilnk', this).children()
				const author_el = bookilnk_el.eq(0)
				const cate_el = bookilnk_el.eq(1)
				const chapter_el = $('.bookupdate a', this)
				return {
					img_url: src,
					book_name: alt,
					book_id: book_el.attr('href').match(/\d+(?=\.html$)/)?.[0],
					author_name: author_el.text(),
					author_id: author_el.attr('href').match(/\d+(?=\.html$)/)?.[0],
					cate_name: cate_el.text(),
					cate_id: cate_el.attr('href').match(/\d+(?=\.html$)/)?.[0],
					is_end: bookilnk_el.eq(2).text().includes('已完结'),
					update_time: bookilnk_el.eq(3).text().match(/\d{2}-\d{2}\s\d{2}:\d{2}/)?.[0],
					last_chapter_name: chapter_el.text().replace('最新章节：', ''),
					last_chapter_id: chapter_el.attr('href').match(/\d+(?=\.html$)/)?.[0],
					book_desc: $('.bookintro', this).text()
				}
			}).get()
		}
	}

	/**
	 * 搜索关键词
	 * @returns {Promise<Array>}
	 */
	async search_books(query) {
		const url = `${this.#search_url}?${qs.stringify(query)}`
		const $ = await this.ctx.service.cheerio.fetch(url)
		const result = {}
		const page_el = $('.search_d_pagesize')
		if (!page_el) {
			result.page = 1
			result.count = 1
		} else {
			result.page = page_el.children('.active').text()
			result.count = page_el.children('#totalPage').text()
		}
		const is_overflow = query.pageNo > result.count
		result.list = is_overflow ? [] : $('.search-result-list').map(function () {
			const infos_el = $('.se-result-infos', this)
			const book_el = $('.tit a', infos_el)
			const info_el = $('.bookinfo', infos_el)
			const a_el = info_el.children('a')
			const span_el = info_el.children('span')
			const author_el = a_el.eq(0)
			const cate_el = a_el.eq(1)
			return {
				img_url: $('.imgbox img', this).attr('src'),
				book_id: book_el.attr('href').match(/\d+(?=\.html$)/)?.[0],
				book_name: book_el.text(),
				author_name: author_el.text(),
				author_id: author_el.attr('href').match(/\d+(?=\.html$)/)?.[0],
				cate_name: cate_el.text(),
				cate_id: cate_el.attr('href').match(/\d+(?=\.html$)/)?.[0],
				is_end: span_el.eq(0).text().includes('完结'),
				total_word: span_el.eq(1).text().replace('字', ''),
				book_desc: info_el.next().text(),
				keywords: infos_el.children('.key-word').text().replace('关键词：', '').trim().split(/\s/)
			}
		}).get()
		return result
	}
}