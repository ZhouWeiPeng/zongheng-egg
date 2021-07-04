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
		const is_overflow = query.p > (count || 1)
		return {
			page,
			count,
			total,
			title: $('.rank_i_title_name').text().replace(/\s/g, ''),
			list: is_overflow ? [] : $('.rank_d_list').map(function () {
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

	/**
	 * 获取读者消费榜详情
	 * @returns {Promise<Array>}
	 */
	async get_reader_rank_detail() {
		const $ = await this.ctx.service.cheerio.fetch(`${this.#detail_url}?rt=11`)
		return {
			title: $('.c_sub_header').text(),
			list: $('.c_rank_list tbody tr').map(function () {
				const td_el = $('td', this)
				const user_el = td_el.eq(1)
				const user_id = $('a', user_el).attr('href').match(/\d+(?=\.html$)/)?.[0]
				const { src, alt } = $('img', user_el).attr()
				const int_el = td_el.eq(2).children('.JuserLevel')
				return {
					user_id,
					user_avatar: src,
					user_name: alt,
					int_level: int_el.data('level'),
					int_alias: int_el.next().text().replace(/[\uff08\uff09]/g, ''),
					vip_level: td_el.eq(3).children('em').attr('class'),
					total_point: td_el.eq(4).text(),
					praise_works: $('a', td_el.eq(5)).map(function () {
						const { href, title } = $(this).attr()
						return {
							book_id: href.match(/\d+(?=\.html$)/)?.[0],
							book_name: title
						}
					}).get()
				}
			}).get()
		}
	}

	/**
	 * 获取作者人气榜详情
	 * @returns {Promise<Array>}
	 */
	async get_writer_rank_detail() {
		const $ = await this.ctx.service.cheerio.fetch(`${this.#detail_url}?rt=12`)
		return {
			title: $('.c_sub_header').text(),
			list: $('.c_rank_list tbody tr').map(function () {
				const td_el = $('td', this)
				const user_el = td_el.eq(1)
				const book_el = td_el.eq(3).children('a')
				return {
					user_id: $('a', user_el).attr('href').match(/\d+(?=\.html$)/)?.[0],
					user_avatar: $('img', user_el).attr('src'),
					user_name: user_el.attr('title'),
					popular_num: td_el.eq(2).text(),
					latest_works: {
						book_name: book_el.text(),
						book_id: book_el.attr('href').match(/\d+(?=\.html$)/)?.[0]
					}
				}
			}).get()
		}
	}

	/**
	 * 获取新书榜的时间筛选项
	 * @returns {Promise<Array>}
	 */
	async get_newbook_time_options() {
		const $ = await this.ctx.service.cheerio.fetch(`${this.#detail_url}?rt=4&d=1`)
		return $('.select_item li').map(function () {
			const el = $(this)
			return {
				label: el.text(),
				value: el.data('val')
			}
		}).get()
	}

	/**
	 * 获取分类和时期的筛选项
	 * @returns {Promise<Array>}
	 */
	async get_cate_period_options() {
		const $ = await this.ctx.service.cheerio.fetch(`${this.#detail_url}?rt=5&d=1`)
		const periods = $('.rank_clicknum a').map(function () {
			const el = $(this)
			return {
				label: el.text(),
				value: el.attr('period')
			}
		}).get()
		const cates = $('.rankclass_nav a').map(function () {
			const el = $(this)
			return {
				label: el.text(),
				value: el.attr('catepid')
			}
		}).get()
		return { periods, cates }
	}
}