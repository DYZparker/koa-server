const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

mongoose.connect('mongodb://localhost/itcast', {useNewUrlParser: true, useUnifiedTopology: true}, function(err){
  if(err) {
    console.log(err)
    return
  }
  console.log('数据库连接成功')
});

module.exports = mongoose