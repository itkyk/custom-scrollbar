#@itkyk/ Custom Scrollbar

## Install
```shell
$ npm i @itkyk/custom-scrollbar
```

## initialize

```typescript
import { createScrollbar, ScrollbarOptions } from "@itkyk/custom-scrollbar";

const options: ScrollbarOptions = {
  // ...something
}

const customScrolbar = createScrollbar(".target", options);
```

## Option
| key       | default                   | type                      | description                                 |
|-----------|---------------------------|---------------------------|---------------------------------------------|
| contsnts  | ".custom-scroll-contents" | `string` or `HTMLElement` | The className of dom given `overflow: scroll` or `overflow: auto` |
| barWrap      | ".custom-scroll-wrap"     | `string` or `HTMLElement` | 　The className of the wrap in the range of motion of the scrollbar |
| bar       | ".custom-scroll-bar"      | `string` or `HTMLElement` | The className of scrollbar                  |
| direction | "vertical"                | `vertical` or `horizontal` | Scroll direction. This params contains `vertical` or `horizontal` |
| resize    | true                     | `boolean`                  | Optimize when resizing.(Scrollbar height calculation and `setScrollbarStatus`)                   |

## methods
| method          | description                                                                                                         |
|-----------------|:--------------------------------------------------------------------------------------------------------------------|
| destroy()       | Return to initial state and remove all EventListener.                                                               |
| reload() | Initialize again.                                                                                                   |
| isNeedScrollbar() | Returns a boolean whether a scroll bar is required.                                                                 |
| setScrollbarStatus() | If you do not need a scrollbar, add `disable-scrollbar` to the wrap Element class.Remove it if necessary.           |
| getBarSize()    | Get the size of the scroll bar in px units. If "vertical", then get `height`, but if "horizontal", then get `width` |
| options | Returns final `ScrollbarOptions` information.                                                                                                                    |
| elements.target |Stores the final `target` element.                                                                                                                     |
| elements.contents | Stores the final `contents` element.                                                                                                                    |
| elements.contentsInner | Stores the final `contentsInner` element.                                                                                                                    |
| elements.wrap | Stores the final `wrap` element.                                                                                                                    |
| elements.bar |Stores the final `bar` element.                                                                                                                     |


## Sample code
[Sample Site](https://itkyk-mymodules.netlify.app/custom-scrollbar/)