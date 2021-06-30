const { Service } = require('egg')
const qs = require('querystring')

module.exports = class extends Service {
	#server_url = 'http://book.zongheng.com/rank.html'

	#detail_url = 'http://book.zongheng.com/rank/details.html'

	/**
	 * 获取人气榜单（榜单概览）
	 * @returns {Promise<Array>}
	 */
	async get_overview_list() {
		const $ = await this.ctx.service.cheerio.fetch(this.#server_url)
		return $('.rank_i_lists .rank_i_p_list').map(function () {
			return {
				title: $('.rank_i_p_tit', this).text(),
				list: $('.rank_i_li', this).map(function (i) {
					if (i) {
						const book_el = $('.rank_i_bname a', this)
						return {
							book_name: book_el.text(),
							book_id: book_el.attr('href').match(/\d+(?=\.html$)/)?.[0],
							append_info: $('.rank_i_bcount', this).text().replace(/\s/g, '')
						}
					}
					const text_el = $('.rank_i_bname', this)
					const book_el = text_el.children('.rank_i_l_a_book')
					const author_el = text_el.children('.rank_i_l_a_author')
					const cate_el = text_el.children('.rank_i_l_a_category')
					return {
						book_name: book_el.text(),
						book_id: book_el.attr('href').match(/\d+(?=\.html$)/)?.[0],
						author_name: author_el.text(),
						author_id: author_el.attr('href').match(/\d+(?=\.html$)/)?.[0],
						cate_name: cate_el.text().replace(/[\[\]]/g, ''),
						cate_id: cate_el.attr('href').match(/\d+(?=\.html$)/)?.[0],
						append_info: text_el.children('.rank_i_l_font').text().replace(/\s/g, ''),
						img_url: $('.rank_i_bcount img', this).attr('src')
					}
				}).get()
			}
		}).get()
	}

	/**
	 * 获取所有榜单信息
	 * @returns {Promise<Array>}
	 */
	async get_all_ranks() {
		const $ = await this.ctx.service.cheerio.fetch(this.#server_url)
		return $('.rank_side p a').map(function () {
			const el = $(this)
			const querystring = el.attr('href').split('?')[1]
			return {
				title: el.text(),
				query: qs.parse(querystring),
				querystring
			}
		}).get()
	}

	/**
	 * 获取作品榜单详情
	 * @returns {Promise<Array>}
	 */
	async get_works_rank_detail(query) {
		const $ = await this.ctx.service.cheerio.fetch(`${this.#detail_url}?${qs.stringify(query)}`)
		const { page, count, total } = $('.pagebar')?.attr() || {}
		return {
			page,
			count,
			total,
			title: $('.rank_i_title_name').text().replace(/\s/g, ''),
			list: $('.rank_d_list').map(function () {
				const { bookname, bookid } = $(this).attr()
				const a_els = $('.rank_d_b_cate a', this)
				const last_el = $('.rank_d_b_last', this)
				return {
					img_url: $('.rank_d_book_img img', this).attr('src'),
					book_name: bookname,
					book_id: bookid,
					author_name: $(a_els[0]).text(),
					author_id: $(a_els[0]).attr('href').match(/\d+(?=\.html$)/)?.[0],
					cate_name: $(a_els[1]).text(),
					is_end: $(a_els[2]).text() === '完结',
					book_desc: $('.rank_d_b_info', this).text(),
					last_chapter_name: last_el.attr('title'),
					last_chapter_id: last_el.children('a').attr('href').match(/\d+(?=\.html$)/)?.[0],
					update_time: last_el.children('.rank_d_b_time').text()
				}
			}).get()
		}
	}
}