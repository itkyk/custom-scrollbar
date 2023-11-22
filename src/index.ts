import Util from "./util";

interface optionInterface {
  contents: string;
  wrap: string;
  bar: string;
  direction: "horizontal" | "vertical",
  resize: boolean;
}


const defaultOption: optionInterface = {
  contents: ".custom-scroll-contents",
  wrap: ".custom-scroll-wrap",
  bar: ".custom-scroll-bar",
  direction: "vertical",
  resize: true
}

const getElements = (root: HTMLElement | Document, target: string | HTMLElement) => {
  return typeof target === "string" ? root.querySelector(target) as HTMLElement : target;
}

const switchDirection = <T>(directions: {horizontal: T, vertical: T}, direction: "horizontal" | "vertical"): T => {
  if (direction === "horizontal") {
    return  directions.horizontal;
  } else {
    return  directions.vertical
  }
}

const createScrollBar = (target: string | HTMLElement, scrollbarOption: Partial<optionInterface> = {}) => {
  const targetEle =getElements(document, target)
  const targetInitialInner = targetEle.innerHTML.toString();
  const option = Object.assign(defaultOption, scrollbarOption);
  let contents = getElements(targetEle, option.contents);
  let bar = getElements(targetEle, option.bar);
  let wrap = getElements(targetEle, option.wrap);
  let clickFlag = false;
  let contentsHTML = contents.innerHTML;
  contents.innerHTML = `<div class="custom-scrollbar-content-wrapper">${contentsHTML}</div>`;
  let contentsInner = targetEle.querySelector(".custom-scrollbar-content-wrapper") as HTMLDivElement;

  // Reload
  const reload = () => {
    destroy();
    contents = getElements(targetEle, option.contents);
    bar = getElements(targetEle, option.bar);
    wrap = getElements(targetEle, option.wrap);
    clickFlag = false;
    contentsHTML = contents.innerHTML;
    contents.innerHTML = `<div class="custom-scrollbar-content-wrapper">${contentsHTML}</div>`;
    contentsInner = targetEle.querySelector(".custom-scrollbar-content-wrapper") as HTMLDivElement;
    addEvents();
  }

  // getBarSize
  const getBarSize = switchDirection({
    horizontal: () => {
      const scrollbarWrapWidth = wrap.getBoundingClientRect().width;
      const contentsWrapWidth = contents.getBoundingClientRect().width;
      const contentsInnerWidth = contentsInner.getBoundingClientRect().width;
      const widthRatio = contentsWrapWidth / contentsInnerWidth;
      return scrollbarWrapWidth * widthRatio;
    },
    vertical: () => {
      const scrollbarWrapHeight = wrap.getBoundingClientRect().height;
      const contentsWrapHeight = contents.getBoundingClientRect().height;
      const contentsInnerHeight = contentsInner.getBoundingClientRect().height;
      const heightRatio = contentsWrapHeight / contentsInnerHeight;
      return scrollbarWrapHeight * heightRatio;
    }
  }, option.direction)

  // moveScrollbar
  const moveScrollbar = switchDirection({
    horizontal: () => {
      const scrollVal = contents.scrollLeft;
      const contentsWidth = contents.clientWidth;
      let scrollRange = contentsInner.clientWidth - contentsWidth;
      const barWidth = bar.clientWidth;
      const range = wrap.clientWidth - barWidth;
      const barPosition = Util.mapping(scrollVal, 0, scrollRange, 0, range)
      bar.style.left = `${Math.abs(barPosition)}px`;
    },
    vertical: () => {
      const scrollVal = contents.scrollTop;
      const contentsHeight = contents.clientHeight;
      let scrollRange = contentsInner.clientHeight - contentsHeight;
      const barHeight = bar.clientHeight;
      const range = wrap.clientHeight - barHeight;
      const barPosition = Util.mapping(scrollVal, 0, scrollRange,0, range)
      bar.style.top = `${Math.abs(barPosition)}px`
    }
  }, option.direction);

  //needScrollbar
  const isNeedScrollbar = switchDirection({
    horizontal: () => {
      if (contents.getBoundingClientRect().width >= contentsInner?.getBoundingClientRect().width) {
        wrap.classList.add("disable-scrollbar");
        return false
      } else {
        wrap.classList.remove("disable-scrollbar");
        return false;
      }
    },
    vertical: () => {
      if (contents.getBoundingClientRect().height >= contentsInner?.getBoundingClientRect().height) {
        wrap.classList.add("disable-scrollbar");
        return false;
      } else {
        wrap.classList.remove("disable-scrollbar");
        return true;
      }
    }
  }, option.direction);

  const setScrollbarStatus = () => {
    if (isNeedScrollbar()) {
      wrap.classList.remove("disable-scrollbar");
    } else {
      wrap.classList.add("disable-scrollbar");
    }
  }

  // followScrollBarFunc
  const followScrollBarFunc = switchDirection({
    horizontal: (e:MouseEvent) => {
      if (clickFlag) {
        const mouseX = e.pageX;
        const scrollWrapPosX = wrap.getBoundingClientRect().left;
        const mouseToBarDiff = mouseX - bar.getBoundingClientRect().left;
        const barPos = mouseX - scrollWrapPosX - mouseToBarDiff;
        const range = wrap.clientHeight - bar.clientHeight;
        const contentsWidth = contents.clientWidth;
        const scrollRange =contentsInner ?  contentsInner.clientHeight - contentsWidth : 0;
        if (barPos >= 0 && barPos <= range) {
          bar.style.left = `${barPos}px`;
          const scrollPos = Util.mapping(barPos, 0, range, 0 , scrollRange);
          contents.scrollTo(scrollPos, 0)
        }
      }
    },
    vertical: (e: MouseEvent) => {
      if (clickFlag) {
        const mouseY = e.pageY;
        const scrollWrapPosY = wrap.getBoundingClientRect().top;
        const mouseToBarDiff = mouseY - bar.getBoundingClientRect().top;
        const barPos = mouseY - scrollWrapPosY - mouseToBarDiff;
        const range = wrap.clientHeight - bar.clientHeight;
        const contentsHeight = contents.clientHeight;
        const scrollRange =contentsInner ?  contentsInner.clientHeight - contentsHeight : 0;
        if (barPos >= 0 && barPos <= range) {
          bar.style.top = `${barPos}px`;
          const scrollPos = Util.mapping(barPos, 0, range, 0 , scrollRange);
          contents.scrollTo(0, scrollPos)
        }
      }
    }
  }, option.direction)

  // onBarClick
  const onBarClick = () => {
    clickFlag = true;
    contents.style.userSelect = "none"
    bar.classList.add("is-grabbing")
  };

  // onBarUnClick
  const onBarUnClick = () => {
    clickFlag = false;
    contents.style.userSelect = ""
    bar.classList.remove("is-grabbing")
  }

  // Resize Events
  const resizeEvents = () => {
    isNeedScrollbar();
    bar.style.height = `${getBarSize()}px`;
  }

  const addEvents = () => {
    contents.addEventListener("scroll", moveScrollbar)
    bar.addEventListener("mousedown", onBarClick);
    window.addEventListener("mouseup", onBarUnClick);
    window.addEventListener("mousemove", followScrollBarFunc)
    if (option.resize) {
      window.addEventListener("resize", resizeEvents)
    }
  }

  const destroy = () => {
    contents.removeEventListener("scroll", moveScrollbar)
    bar.removeEventListener("mousedown", onBarClick);
    window.removeEventListener("mouseup", onBarUnClick);
    window.removeEventListener("mousemove", followScrollBarFunc)
    if (option.resize) {
      window.removeEventListener("resize", resizeEvents);
    }
    targetEle.innerHTML = targetInitialInner;
  }

  addEvents();
  return {
    destroy,
    getBarSize,
    isNeedScrollbar,
    setScrollbarStatus,
    options: option,
    elements: {
      target: targetEle,
      contents,
      bar,
      wrap,
      contentsInner
    }
  }
}

export default createScrollBar;