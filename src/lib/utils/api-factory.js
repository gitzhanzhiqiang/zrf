/* eslint-disable no-invalid-this */
import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import axios from 'axios';
import _ from 'underscore';
import Cookies from 'js-cookie';
import Deferred from './deferred';
import loginout from '@src/utils/loginout';
const ajax = axios.create({
  timeout: 30000,
});

ajax.defaults.withCredentials = true;  

export class Descriptor {
  constructor(desc) {
    this._url = _.isFunction(desc.url) ? desc.url : function () { return desc.url; };
    this._paramsValidator = _.chain(desc.params)
      .omit(v => !_.isFunction(v.validate))
      .mapObject(v => v.validate)
      .value();
    this._defaultParams = _.mapObject(desc.params, v => v.defaultValue);
    this._headers = desc.headers || {};
    this._optionParams = desc.optionParams;
    this._responseType = desc.responseType || 'json';
    this._contentType = `${desc.contentType || 'application/json'}; charset=UTF-8`;
  }

  makeParams(paramsFns) {
    return _.chain(paramsFns)
      .reduce((acc, v) => {
        const p = _.isFunction(v) ? v.call(acc) : v;
        return _.extend({}, acc, _.omit(p, value => _.isUndefined(value)));
      }, this._defaultParams)
      .mapObject((v, k, a) => _.isFunction(v) ? v.call(a) : v, this)
      .value();
  }

  makeRequest(method, params) {
    var newParams = JSON.parse(JSON.stringify(params));
     // console.log(newParams);
    if(params.optionParams&&params.optionParams.pageIndex&&params.optionParams.pageSize){ //添加是否有参数pageIndex  pageSize
      newParams.optionParams.pageIndex = (newParams.optionParams.pageIndex-1)*newParams.optionParams.pageSize;
    }
    const data = _.omit.apply(_, [newParams].concat(this._optionParams))
      , headers = _.extend({
        'Content-Type': this._contentType,
      }, this._headers);

    return {
      data: data.optionParams,
      method,
      headers,
      cancelToken: null,
      url: this._url(params),
      responseType: this._responseType,
    };
  }
}

export default (descriptor) => {
  const desc = new Descriptor(descriptor);

  return function () {
    const paramsFns = [].slice.call(arguments, 0)
      , exec = function (method, preFilter) {
        const params = desc.makeParams(paramsFns);
        let ajaxOption = desc.makeRequest(method, params);

        if (this._token) {
          this._token.cancel('Cancel ajax request.');
          this._token = null;
        }
        this._token = axios.CancelToken.source();

        if (preFilter) {
          ajaxOption = preFilter(ajaxOption);
        }
        ajaxOption.cancelToken = this._token.token;

        const deferred = Deferred();
        ajax(ajaxOption)
          .then(v => {
            this._token = null;
            // console.log(v);
            if (v.data.code === 200) {
              // window.alert('200')
            } else if (v.data.code === 102) {
                // loginout登录会话超时
                // window.alert('会话超时')
                loginout();
            } else {
              // window.alert('其他')
            }
            
            deferred.resolve(v.data, params);
          })
          .then(null, err => {
            if (!axios.isCancel(err)) {
              this._token = null;

              deferred.reject(err, params);
            }
          });

        return deferred.promise;
      };

    return {
      fetch(preFilter) {
        return exec.call(this, 'GET', preFilter);
      },
      post(preFilter) {
        return exec.call(this, 'POST', preFilter);
      },
      put(preFilter) {
        return exec.call(this, 'PUT', preFilter);
      },
      del(preFilter) {
        return exec.call(this, 'DELETE', preFilter);
      },
    };
  };
};
