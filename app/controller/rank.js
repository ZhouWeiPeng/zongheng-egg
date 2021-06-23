'use strict'

const { Controller } = require('egg')

class RankController extends Controller {
  async get_overview_list() {
    const { ctx } = this
    const result = await ctx.service.rank.get_overview_list()
    ctx.body = result
  }
}

module.exports = RankController
