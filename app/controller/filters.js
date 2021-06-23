'use strict'

const { Controller } = require('egg')

class FiltersController extends Controller {
	async get_male_filters() {
		const { ctx } = this
		const result = await ctx.service.filters.get_single_filters(0)
		ctx.body = result
	}

	async get_female_filters() {
		const { ctx } = this
		const result = await ctx.service.filters.get_single_filters(1)
		ctx.body = result
	}

	async get_all_filters() {
		const { ctx } = this
		const result = await ctx.service.filters.get_all_filters()
		ctx.body = result
	}

	async get_sort_modes() {
		const { ctx } = this
		const result = await ctx.service.filters.get_sort_modes()
		ctx.body = result
	}
}

module.exports = FiltersController
