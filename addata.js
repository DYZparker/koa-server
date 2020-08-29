const LinkList = require('./model/linkList')

const data = 
[
  {
  name: 'javascript',
  key: '1',
  content: [
    {
      title: 'MDN Web文档',
      src: 'http://122.51.57.99:7777/image/mdn.jpg',
      href: 'https://developer.mozilla.org/zh-CN/'
    },
    {
      title: 'W3School',
      src: 'http://122.51.57.99:7777/image/w3s.jpg',
      href: 'https://www.w3school.com.cn/'
    }
  ]
  },{
  name: 'react',
  key: '2',
  content: [
    {
      title: 'React 中文网',
      src: 'http://122.51.57.99:7777/image/react.jpg',
      href: 'https://react.docschina.org/'
    },
    {
      title: 'React Native 中文网',
      src: 'http://122.51.57.99:7777/image/native.jpg',
      href: 'https://reactnative.cn/'
    },
    {
      title: 'Next.js',
      src: 'http://122.51.57.99:7777/image/next.jpg',
      href: 'https://nextjs.frontendx.cn/'
    }
  ]
  }
]


const addata = function() {
  for(let i=0; i<data.length; i++) {
    const content = data[i]
    new LinkList(content).save()
  }
  return console.log('生成完毕...')
}

addata()
