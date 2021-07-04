const { Controller } = require('egg')

module.exports = class extends Controller {
	async get_male_options() {
		const { ctx } = this
		const result = await ctx.service.store.get_single_options(0)
		ctx.body = result
	}

	async get_female_options() {
		const { ctx } = this
		const result = await ctx.service.store.get_single_options(1)
		ctx.body = result
	}

	async get_all_options() {
		const { ctx } = this
		const result = await ctx.service.store.get_all_options()
		ctx.body = result
	}

	async get_sort_options() {
		const { ctx } = this
		const result = await ctx.service.store.get_sort_options()
		ctx.body = result
	}
	
	async get_book_list() {
		const { ctx } = this
		const result = await ctx.service.store.get_book_list(ctx.query)
		ctx.body = result
	}
}