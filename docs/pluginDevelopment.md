# 插件开发指南

## 说明
mdReverse可以粗略地分为两部分，一部分是解析HTML文本，生成虚拟DOM树，
另一部分是根据[配置文件](../src/lib/config.js)对HTML标签进行转换。

插件开发要做的就是修改[配置文件](../src/lib/config.js)改变mdReverse对HTML标签的转换行为。

## 示例

### [StrikethroughPlugin](../src/lib/plugins/strikethrough.js)

```javascript
function StrikethroughPlugin(addToken, EL_TYPE, DEFAULT_RULE) {
    addToken('del', true, {
        filterRule: {
            children: [EL_TYPE['all_element']]
        },
        convertRule: function (node) {
            return ' ~~';
        },
        endRule: function (node) {
            return `~~ `;
        }
    })
}
```
#### `mdReverse.use()`
`mdReverse.use()` 方法会传入三个参数

| 参数 | 描述 |
| ---- | ---- |
| addToken(name, allowNest, rule) | 添加HTML标签的方法 |
| EL_TYPE | 保存了HTML标签对应的id |
| DEFAULT_RULE | 默认的转换规则 |

###### addToken

| 参数 | 描述 |
| ---- | ---- |
| name | HTML元素标签名 |
| allowNest | 元素是否允许嵌套标签，即是否为空标签 |
| rule | 默认使用DEFAULT_RULE |

返回值: Error | Boolean

###### EL_TYPE
见[配置文件](../src/lib/config.js)

###### DEFAULT_RULE
见[配置文件](../src/lib/config.js)
