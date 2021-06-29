const { Service } = require('egg')
const cheerio = require('cheerio')

module.exports = class extends Service {
	#server_url = 'http://book.zongheng.com/'

	/**
	 * 获取首页顶部大轮播图
	 * @returns {Promise<Array>}
	 */
	async get_main_banner() {
		const $ = await this.ctx.service.cheerio.fetch(this.#server_url)
		return $('#index_tpic li a').map(function () {
			const el = $(this)
			const img_el = $('img', this)
			const { src, alt } = img_el.attr()
			return {
				img_url: src,
				book_name: alt,
				href: el.attr('href'),
				book_id: el.data('sa-d').book_id,
				scrtxt: img_el.next().text()
			}
		}).get()
	}

	/**
	 * 获取品书试读
	 * @returns {Promise<Array>}
	 */
	async get_try_read_books() {
		const $ = await this.ctx.service.cheerio.fetch(this.#server_url)
		return $('.mind-showbook .mind-book').map(function () {
			const a_el = $('a', this)
			const { src, alt } = $('.img-book img', this).attr()
			const author_el = $('.author a', this)
			const cate_el = $('.cate', this)
			return {
				img_url: src,
				book_name: alt,
				book_href: a_el.attr('href'),
				book_id: a_el.data('sa-d').book_id,
				book_desc: $('.book-info .info', this).text(),
				author_name: author_el.text(),
				author_id: author_el.attr('href').match(/\d+(?=\.html$)/)?.[0],
				cate_name: cate_el.text(),
				cate_id: cate_el.attr('href').match(/\d+(?=\.html$)/)?.[0]
			}
		}).get()
	}

	/**
	 * 获取经典完本轮播图
	 * @returns {Promise<Array>}
	 */
	async get_classic_end_books() {
		const $ = await this.ctx.service.cheerio.fetch(this.#server_url)
		const img_el = $('.overbook .swiper-item img')
		const info_el = $('.overbook .itemInfo')
		return info_el.map(function (i) {
			const book_el = $('a.name', this)
			const author_el = book_el.next()
			const cate_el = author_el.next().children('a')
			return {
				img_url: img_el.eq(i).attr('src'),
				book_id: book_el.data('sa-d').book_id,
				book_name: book_el.text(),
				author_id: author_el.attr('href').match(/\d+(?=\.html$)/)?.[0],
				author_name: author_el.text(),
				cate_id: cate_el.attr('href').match(/\d+(?=\.html$)/)?.[0],
				cate_name: cate_el.text(),
				word_num: cate_el.next().text().replace(/\s字/, ''),
				book_desc: $('.intr-text', this).text()
			}
		}).get()
	}
}