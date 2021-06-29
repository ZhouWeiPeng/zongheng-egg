const { Service } = require('egg')
const cheerio = require('cheerio')

module.exports = class extends Service {
  // 获取cheerio对象
  async fetch(url, { isSetCache, isGetCache } = {}) {
    const res = await this.ctx.curl(url, {
			dataType: 'text'
		})
		return cheerio.load(res.data)
  }
}