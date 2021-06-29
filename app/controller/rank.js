const { Controller } = require('egg')

module.exports = class extends Controller {
	async get_overview_list() {
		const { ctx } = this
		const result = await ctx.service.rank.get_overview_list()
		ctx.body = result
	}

	async get_all_ranks() {
		const { ctx } = this
		const result = await ctx.service.rank.get_all_ranks()
		ctx.body = result
	}
}