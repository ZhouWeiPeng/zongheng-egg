const { Controller } = require('egg')

module.exports = class extends Controller {
	async get_chapter_list() {
		const { ctx } = this
		const result = await ctx.service.book.get_chapter_list(ctx.query)
		ctx.body = result
	}

	async get_chapter_content() {
		const { ctx } = this
		const result = await ctx.service.book.get_chapter_content(ctx.query)
		ctx.body = result
	}
}