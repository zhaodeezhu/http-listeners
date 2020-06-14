import uuidv1 from 'uuid/v1';
import clientInfoBar from './clientInfo';
(function(window){
  function RequestListener() {
    /** 上报的借口前缀 规则 /api/系统名 */
    this.sysApiPrefix = '';
    /** 上报的接口前缀数据 */
    this.sysApiPrefixs = [];
    /** 上报的地址 */
    this.reportUrl = '';
    /** 过滤掉的地址 */
    this.filterApiPrefix = '';
    /** 要过滤掉的前缀数组 */
    this.excludeApiPrefixs = []
    /** 地址记录 */
    this.sendApiRecord = {};
    // 回调函数
    this.intercept = function(data) {
      // console.log(data)
    }
    // 解析query参数
    this.queryExplain = (url) => {
      let queryString = url.split('?')[1]
      if (!queryString) {
        return {}
      }
      let queryArr = queryString.split('&')
      let query = {}
      queryArr.forEach((item) => {
        let itemQueryArr = item.split('=')
        query[itemQueryArr[0]] = itemQueryArr[1]
      })
      return {
        query,
        url: url.split('?')[0]
      }
    }

    /** 是否要执行监听 */
    this.isListener = (api) => {
      // 是否排除
      let exc = this.excludeApiPrefixs.some(item => {
        return api.search(item) > -1
      });
      let fix = api.search(this.filterApiPrefix) > -1;

      // 是否请求
      let inc = api.search(this.sysApiPrefix) > -1;
      let incs = this.sysApiPrefixs.some(item => {
        return api.search(item) > -1
      })

      return !exc && !fix && (inc || incs)
    }

    // 监听AJAX请求
    let listenerAjax = () => {
      let _open = window.XMLHttpRequest.prototype.open
      let _send = window.XMLHttpRequest.prototype.send
      let _that = this
      let uuid = ''
      // let _onload = window.XMLHttpRequest.prototype.onload
      window.XMLHttpRequest.prototype.open = function() {
        // console.log('我是请求')
        let args = [...arguments]
        let {query, url} = _that.queryExplain(args[1])
        uuid = uuidv1()
        _that.sendApiRecord[uuid] = {
          querys: query,
          url,
          path: args[1]
        }
        let startTime = new Date().getTime()
        this.addEventListener('readystatechange', function() {
          if(this.readyState === 4) {
            if(_that.isListener(args[1])) {
              let endTime = new Date().getTime()
              let all = {}
              Object.keys(_that.sendApiRecord).forEach(item => {
                if(_that.sendApiRecord[item].path === args[1]) {
                  all = _that.sendApiRecord[item]
                }
              })
              // 执行监听器

              _that.intercept(Object.assign(all, {
                os: clientInfoBar.os,
                browser: clientInfoBar.browser,
                responseText: this.responseText,
                resTime: endTime - startTime,
                startTimeStep: startTime
              }))
            }
          }
        })
        return _open.apply(this, arguments)
      }

      window.XMLHttpRequest.prototype.send = function() {
        // 根据uuid查找对应的数据
        _that.sendApiRecord[uuid].data = [...arguments].length > 0 && [...arguments][0] ? [...arguments][0] : ''
        return _send.apply(this, arguments)
      }
    } 

    // 监听Fetch请求 
    let listenerFetch = () => {
      let _fetch = window.fetch
      let _that = this
      window.fetch = async function() {
        let args = [...arguments]
        let {query, url} = _that.queryExplain(args[0])
        let startTime = new Date().getTime()
        let res  = await _fetch.apply(this, arguments)
        let endTime = new Date().getTime()
        let data = await res.json()
        _that.intercept({
          querys: query,
          url,
          path: args[0],
          os: clientInfoBar.os,
          browser: clientInfoBar.browser,
          responseText: data,
          resTime: endTime - startTime,
          startTimeStep: startTime
        })
        return res
      }
    }

    this.init = ({
      sysApiPrefix,
      filterApiPrefix,
      excludeApiPrefixs,
      sysApiPrefixs,
      reportUrl
    }) => {
      if(!sysApiPrefix) {
        console.log('前缀不能为空')
        return false
      }
      this.sysApiPrefix = sysApiPrefix;
      this.sysApiPrefixs = sysApiPrefixs ? sysApiPrefixs : []
      this.filterApiPrefix = filterApiPrefix
      this.excludeApiPrefixs = excludeApiPrefixs ? excludeApiPrefixs : []
      listenerAjax()
      listenerFetch()
    }
  }

  window.ajaxListener = new RequestListener()
})(window)
export default window.ajaxListener