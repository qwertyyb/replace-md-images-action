const COS = require('cos-nodejs-sdk-v5');
const path = require('path');

let cos = null

module.exports = {
  initClient({ secretId, secretKey }) {
    cos = new COS({
      SecretId: secretId,
      SecretKey: secretKey
    })
  },
  async upload({ buffer, fileName}, cosOptions = {}) {
    if (!cos) {
      throw new Error('initClient is not called')
    }
    const params = {
      Bucket: cosOptions.bucket,
      Region: cosOptions.Region,
      Key: path.join(cosOptions.prefix || 'md/', fileName)
    }
    await new Promise((resolve, reject) => cos.putObject({
      ...params,
      Body: buffer
    }, (err, data) => {
      if (err) {
        reject(new Error('上传cos失败: ' + err.message))
      } else {
        resolve(data)
      }
    }))
    const res = await new Promise((resolve, reject) => cos.getObjectUrl({
      ...params,
      Sign: false
    }, (err, data) => {
      if (err) {
        reject(new Error('获取cos地址失败: ' + err.message))
      } else {
        resolve(data)
      }
    }))
    return res.Url
  }
}