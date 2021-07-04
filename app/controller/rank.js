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

	async get_works_rank_detail() {
		const { ctx } = this
		const result = await ctx.service.rank.get_works_rank_detail(ctx.query)
		ctx.body = result
	}

	async get_reader_rank_detail() {
		const { ctx } = this
		const result = await ctx.service.rank.get_reader_rank_detail()
		ctx.body = result
	}

	async get_writer_rank_detail() {
		const { ctx } = this
		const result = await ctx.service.rank.get_writer_rank_detail()
		ctx.body = result
	}

	async get_newbook_time_options() {
		const { ctx } = this
		const result = await ctx.service.rank.get_newbook_time_options()
		ctx.body = result
	}
	
	async get_cate_period_options() {
		const { ctx } = this
		const result = await ctx.service.rank.get_cate_period_options()
		ctx.body = result
	}
}