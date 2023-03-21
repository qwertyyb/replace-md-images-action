const fs = require('fs')
const getMarkdownUrls = require('gh-md-urls')
const fetch = require('node-fetch')
const { upload } = require('./cos')

const readFile = (path) => fs.readFileSync(path, 'utf8')

const getImages = (content) => {
  var urls = getMarkdownUrls(content, {
    repository: 'https://github.com/mattdesl/gh-md-urls'
  })

  const images = urls.filter(item => item.type === 'image')
  return images
}

const uploadImagesToCos = async (images) => {
  const replaceInfos = await Promise.all(images.map(async item => {
    const res = await fetch(item.url)
    const fileName = item.url.split('/').reverse()[0]
    if (!fileName) throw new Error('获取文件名失败: ' + item.url)
    if (res.headers.get('content-type').startsWith('image/')) {
      const buffer = await res.arrayBuffer()
      const url = await upload({ buffer: Buffer.from(buffer), fileName })
      return { oldVal: item.url, newVal: url}
    }
  }))
  return replaceInfos;
}
const replaceMarkdownImageUrls = (content, replaceInfos) => {
  replaceInfos.forEach(({ oldVal, newVal }) => {
    content = content.replaceAll(oldVal, newVal)
  })
  return content;
}

const start = async (fileName) => {
  const content = readFile()
  const images = getImages(content)
  console.log('文件中包含如下图片: ', JSON.stringify(images, undefined, 2))
  const replaceInfos = await uploadImagesToCos(images)
  console.log('上传cos后的图片地址: ', JSON.stringify(replaceInfos, undefined, 2))
  const newContent = replaceMarkdownImageUrls(content, replaceInfos)
  return newContent
}

module.exports = {
  start
}