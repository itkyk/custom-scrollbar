#@itkyk/ Custom Scrollbar

## Install
```shell
$ npm i @itkyk/custom-scrollbar
```

## initialize

```typescript
import {CustomScrollbar} from "@itkyk/custom-scrollbar";

const customScrolbar = new CustomScrollbar(".target", {options});
```

## Option
| key | value | description |
|------|---------|----------------|
| contsnts | ".custom-scroll-contents" | The className of dom given `overflow: scroll` or `overflow: auto` |
| wrap | ".custom-scroll-wrap" |　The className of the wrap in the range of motion of the scrollbar |
| bar | ".custom-scroll-bar" | The className of scrollbar |
| direction | "vertical" | Scroll direction. This params contains `vertical` or `horizontal` |

## methods
| method | description |
|-----------|----------------|
| needScrollBar() | Determine if the content can be scrolled. If you can't scroll, append class wrap an `is-noScroll`. |
| getBarSize() | Get the size of the scroll bar in px units. If "vertical", then get `height`, but if "horizontal", then get `width` |

## Sample code
[Sample Site](https://itkyk-mymodules.netlify.app/custom-scrollbar/)