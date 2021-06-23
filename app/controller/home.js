'use strict'

const { Controller } = require('egg')

class HomeController extends Controller {
	async get_main_banner() {
		const { ctx } = this
		const result = await ctx.service.home.get_main_banner()
		ctx.body = result
	}

	async get_try_read_books() {
		const { ctx } = this
		const result = await ctx.service.home.get_try_read_books()
		ctx.body = result
	}

	async get_classic_end_books() {
		const { ctx } = this
		const result = await ctx.service.home.get_classic_end_books()
		ctx.body = result
	}
}

module.exports = HomeController
