'use strict'

const { Service } = require('egg')
const cheerio = require('cheerio')

class FiltersService extends Service {
	#server_url = `http://book.zongheng.com/store`

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
	async get_single_filters(type = 0) {
		const url = `${this.#server_url}/c0/c0/b${type}/u0/p1/v9/s9/t0/u0/i1/ALL`
		const res = await this.ctx.curl(url, {
			dataType: 'text'
		})
		const $ = cheerio.load(res.data)
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
	async get_all_filters() {
		const genders = [...this.#gender_map.keys()]
		const res = await Promise.allSettled(genders.map(type => this.get_single_filters(type)))
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
	async get_sort_modes() {
		const res = await this.ctx.curl(this.#server_url, {
			dataType: 'text'
		})
		const $ = cheerio.load(res.data)
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
}

module.exports = FiltersService