'use strict'

const { Service } = require('egg')
const cheerio = require('cheerio')

class CommonService extends Service {
  async get_cheerio_obj(url) {
    const res = await this.ctx.curl(url, {
			dataType: 'text'
		})
		return cheerio.load(res.data)
  }
}

module.exports = CommonService
