const { Service } = require('egg')
const qs = require('querystring')

module.exports = class extends Service {
	#server_url = `http://book.zongheng.com/showchapter`

	/**
	 * 获取书籍的章节列表
	 * @returns {Promise<Array>}
	 */
	async get_chapter_list({ book_id }) {
		const url = `${this.#server_url}/${book_id}.html`
		const $ = await this.ctx.service.cheerio.fetch(url)
		return $('.volume-list > div').map(function () {
			const volume_el = $(this).children('.volume')
			const total_word = $('cite', volume_el).text()
			$('.subscri', volume_el).remove()
			$('.count', volume_el).remove()
			return {
				total_word,
				volume_name: volume_el.text().trim(),
				is_vip: volume_el.hasClass('vip-color'),
				chapters: $('.chapter-list li a', this).map(function () {
					const el = $(this)
					const { href, title } = el.attr()
					const total_word = title.match(/(?<=\u5b57\u6570\uff1a)\d*/)?.[0]
					const updata_time = title.match(/\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}/)?.[0]
					return {
						chapter_name: el.text(),
						chapter_id: href.match(/\d+(?=\.html$)/)?.[0],
						total_word,
						updata_time
					}
				}).get()
			}
		}).get()
	}

	/**
	 * 获取章节内容
	 * @returns {Promise<Array>}
	 */
	async get_chapter_content({ book_id, chapter_id }) {
		const url = `http://book.zongheng.com/chapter/${book_id}/${chapter_id}.html`
		const $ = await this.ctx.service.cheerio.fetch(url)
		const info_el = $('.bookinfo').children('a, span')
		const author_el = info_el.eq(0)
		return {
			chapter_name: $('.title').text().trim(),
			content: $('.content').html().trim(),
			is_vip: !!$('#reader-order-box').length,
			author_id: author_el.attr('href').match(/\d+(?=\.html$)/)?.[0],
			author_name: author_el.text(),
			total_word: info_el.eq(1).text(),
			update_time: info_el.eq(2).text()
		}
	}
}