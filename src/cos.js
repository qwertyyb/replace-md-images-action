const COS = require('cos-nodejs-sdk-v5');
const cos = new COS({
});

module.exports = {
  async upload({ buffer, fileName}) {
    const params = {
      Bucket: 'person-1253524658',
      Region: 'ap-beijing',
      Key: '/tmp/md/' + fileName,
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