'use strict'

const { Service } = require('egg')
const cheerio = require('cheerio')

class RankService extends Service {
  #server_url = 'http://book.zongheng.com/rank.html'

  /**
   * 获取人气榜单（榜单概览）
   * @returns {Promise<Array>}
   */
  async get_overview_list() {
    const res = this.ctx.curl(this.#server_url, {
      dataType: 'text'
    })
    const $ = cheerio.load(res.data)
    return $('.rank_i_lists .rank_i_p_list').map(function () {
      return {
        title: '',
        list: []
      }
    }).get()
  }
}

module.exports = RankService
