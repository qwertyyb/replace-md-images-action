const fetch = require('node-fetch')

const notify = async (infos, webhookUrl) => {
  let links = infos.map(info => `[${info.previewUrl}](${info.previewUrl})`)
  if (links.length > 0) {
    links = links.map((link, index) => `${index+1}. ${link}`)
  }
  const content = `
    ### 新的文章已就绪
    ${links.join('\n')}
    > 可进入[排版页面](https://markdown.com.cn/editor/)查看效果
  `
  const res = await fetch(webhookUrl, {
    method: 'POST',
    body: JSON.stringify({
      msgtype: 'markdown',
      markdown: { content },
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const json = await res.json()
  console.log(`notify response: ${JSON.stringify(json)}`)
}

module.exports = {
  notify
}
