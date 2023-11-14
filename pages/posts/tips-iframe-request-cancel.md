---
title: iframe request cancel
date: 2023-04-07 17:40
category: Tips-Work
comment: hidden
---


## 问题阐述

公司弹窗是以 iframe 的形式嵌入系统，点击弹窗的确认按钮，会执行回调函数，弹窗也会关闭。


回调函数是异步函数，会触发多个请求，在弹窗关闭后，请求未执行完，这些请求会被浏览器拦截，导致功能异常。

<Image src="https://s3.bmp.ovh/imgs/2023/04/18/2abf01b6fa08821a.png"></Image>


## 原因分析

[参考文章](https://stackoverflow.com/questions/12009423/what-does-status-canceled-for-a-resource-mean-in-chrome-developer-tools)，
这篇文章的高赞回答，解释了为什么会出现这种情况。


这种情况，大多出现在 Chrome 浏览器，Firefox 浏览器不会出现这种情况。而且也取决于网络连接速度。大致有以下几种情况：

- The DOM element that caused the request to be made got deleted (i.e. an IMG is being loaded, but before the load happened, you deleted the IMG node) - 移除了发送请求的 DOM 元素
- You did something that made loading the data unnecessary. (i.e. you started loading a iframe, then changed the src or overwrite the contents) - 改变了 iframe 的 src 或者覆盖了 iframe 的内容
- There are lots of requests going to the same server, and a network problem on earlier requests showed that subsequent requests weren't going to work (DNS lookup error, earlier (same) request resulted e.g. HTTP 400 error code, etc) - 有许多请求发往同一台服务器，早期请求的网络问题表明后续请求不会起作用


目前公司的情况是第二种，改变了 iframe 的 src，请求未执行完毕就关闭了 iframe。

## 解决方案

判断异步函数是否执行完毕，执行完毕后才关闭 iframe 弹窗。

```js
cdkc.layerForm({
    id: 'form',
    title: '新增',
    url: 'cdkc_pipe_widgets/kyzgpipe_device/Form.html?areaId=' + areaId,
    width: 900,
    height: 600,
    callBack: function (id) {
        return top[id].acceptClick(refreshGirdData);
    }
});
```

```js
// Form.js
acceptClick = async function (cb) {
// ...
    await Promise.all([this.save(), this.save1(), this.save2()]);
    cb && cb();
};
```

```js
// lr-layer.js
layerForm: function (op) {
    var dfop = {
        id: null,
        title: '系统窗口',
        width: 550,
        height: 400,
        url: 'error',
        btn: ['确认', '关闭'],
        callBack: false,
        maxmin: false,
        end: false,
    };
    $.extend(dfop, op || {});

    /*适应窗口大小*/
    dfop.width = dfop.width > $(window).width() ? $(window).width() - 10 : dfop.width;
    dfop.height = dfop.height > $(window).height() ? $(window).height() - 10 : dfop.height;
    var r = top.layer.open({
        id: dfop.id,
        maxmin: dfop.maxmin,
        type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        title: dfop.title,
        area: [dfop.width + 'px', dfop.height + 'px'],
        btn: dfop.btn,
        content: op.url,
        skin: dfop.btn == null ? 'lr-layer-nobtn' : 'lr-layer',
        success: function (layero, index) {
            top['layer_' + dfop.id] = cdkc.iframe($(layero).find('iframe').attr('id'), top.frames);
            layero[0].learun_layerid = 'layer_' + dfop.id;
            //如果底部有按钮添加-确认并关闭窗口勾选按钮
            if (!!dfop.btn && layero.find('.lr-layer-btn-cb').length == 0) {
                layero.find('.layui-layer-btn').append('<div class="checkbox lr-layer-btn-cb" myIframeId="layer_' + dfop.id + '" ><label><input checked="checked" type="checkbox" >确认并关闭窗口</label></div>');
            }

        },
        yes: function (index) {
            var flag = true;
            if (dfop.callBack) {
                flag = dfop.callBack('layer_' + dfop.id);
            }
            if (typeof flag?.then === 'function') {
                // we can't use instanceof Promise here because it's from another realm
                flag.then(() => cdkc.layerClose('', index))
            } else if (flag) {
                cdkc.layerClose('', index);
            }
        },
        end: function () {
            top['layer_' + dfop.id] = null;
            if (!!dfop.end) {
                dfop.end();
            }
        }
    });
},
```

layerForm 函数是弹窗函数，点击确认会执行 yes 函数，yes 函数会执行回调函数，回调函数是 acceptClick 函数，acceptClick 执行完毕后，会关闭弹窗。但是，因为原来没有判断 acceptClick 的返回值是 Promise ，还没有等待这些请求执行完毕，弹窗就关闭了。


所以需要在 lr-layer.js 中，修改 layerForm 函数，判断 acceptClick 的返回值是否是 Promise，[参考](https://stackoverflow.com/questions/27746304/how-to-check-if-an-object-is-a-promise)


```js
// ...
yes: function (index) {
    var flag = true;
    if (dfop.callBack) {
        flag = dfop.callBack('layer_' + dfop.id);
    }
    // 判断 flag 是否是 Promise
    if (typeof flag?.then === 'function') {
        // we can't use instanceof Promise here because it's from another realm
        flag.then(() => cdkc.layerClose('', index))
    } else if (flag) {
        cdkc.layerClose('', index);
    }
},
// ...
```





