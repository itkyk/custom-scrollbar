import Util from "./util";

interface optionInterface {
  contents: string;
  wrap: string;
  bar: string;
  direction: "horizontal" | "vertical"
}

interface optionProps {
  contents?: string;
  wrap?: string;
  bar?: string;
  direction?: "horizontal" | "vertical"
}

const defaultOption: optionInterface = {
  contents: ".custom-scroll-contents",
  wrap: ".custom-scroll-wrap",
  bar: ".custom-scroll-bar",
  direction: "vertical"
}

export class CustomScrollbar {
  private readonly target: HTMLElement | Element;
  private option: optionInterface;
  private contents: HTMLElement;
  private readonly bar: HTMLElement;
  private readonly wrap: HTMLElement;
  private contentsInner: HTMLDivElement;
  private clickFlag: boolean;
  private moveScrollbar: ()=>void;
  private followScrollBarFunc: (e:MouseEvent)=>void
  constructor(target: string | HTMLElement | Element, option:optionProps = {}) {
    this.target = typeof target === "string" ? document.querySelector(target) as HTMLElement : target;
    this.option = Object.assign(defaultOption, option);
    this.contents = this.target.querySelector(this.option.contents) as HTMLElement;
    this.bar = this.target.querySelector(this.option.bar) as HTMLElement;
    this.wrap = this.target.querySelector(this.option.wrap) as HTMLElement;
    this.clickFlag = false;
    this.moveScrollbar = ()=>{}
    this.followScrollBarFunc = () => {};
    const contentsHTML = this.contents.innerHTML;
    this.contents.innerHTML = `<div class="custom-scrollbar-content-wrapper">${contentsHTML}</div>`
    this.contentsInner = this.target.querySelector(".custom-scrollbar-content-wrapper") as HTMLDivElement;
    this.setFunction();
    this.followScrollBar();
    this.addEvent();
    this.needScrollBar();
  }


  setFunction = () => {
    switch (this.option.direction) {
      case "horizontal":

        this.moveScrollbar = () => {
          const scrollVal = this.contents.scrollLeft;
          const contentsWidth = this.contents.clientWidth;
          let scrollRange = 0;
          if (this.contentsInner) {
            scrollRange = this.contentsInner.clientWidth - contentsWidth;
          }
          const barWidth = this.bar.clientWidth;
          const range = this.wrap.clientWidth - barWidth;
          const barPosition = Util.mapping(scrollVal, 0, scrollRange,0, range)
          this.bar.style.left = `${Math.abs(barPosition)}px`
        }
        break;
      case "vertical":
        this.moveScrollbar = () => {
          const scrollVal = this.contents.scrollTop;
          const contentsHeight = this.contents.clientHeight;
          let scrollRange = 0;
          if (this.contentsInner) {
            scrollRange = this.contentsInner.clientHeight - contentsHeight;
          }
          const barHeight = this.bar.clientHeight;
          const range = this.wrap.clientHeight - barHeight;
          const barPosition = Util.mapping(scrollVal, 0, scrollRange,0, range)
          this.bar.style.top = `${Math.abs(barPosition)}px`
        }
        break;
    }
  }

  getBarSize = () => {
    switch (this.option.direction) {
      case "horizontal":
        const scrollbarWrapWidth = this.wrap.getBoundingClientRect().width;
        const contentsWrapWidth = this.contents.getBoundingClientRect().width;
        const contentsInnerWidth = this.contentsInner.getBoundingClientRect().width;
        const widthRatio = contentsWrapWidth / contentsInnerWidth;
        return scrollbarWrapWidth * widthRatio;
      case "vertical":
        const scrollbarWrapHeight = this.wrap.getBoundingClientRect().height;
        const contentsWrapHeight = this.contents.getBoundingClientRect().height;
        const contentsInnerHeight = this.contentsInner.getBoundingClientRect().height;
        const heightRatio = contentsWrapHeight / contentsInnerHeight;
        return scrollbarWrapHeight * heightRatio;
    }
  }


  needScrollBar = () => {
    switch(this.option.direction) {
      case "horizontal":
        if (this.contents.getBoundingClientRect().width >= this.contentsInner?.getBoundingClientRect().width) {
          this.wrap.classList.add("is-noScroll");
        } else {
          this.wrap.classList.remove("is-noScroll");
        }
        break;
      case "vertical":
        if (this.contents.getBoundingClientRect().height >= this.contentsInner?.getBoundingClientRect().height) {
          this.wrap.classList.add("is-noScroll");
        } else {
          this.wrap.classList.remove("is-noScroll");
        }
        break;
    }
  }

  onBarClick = () => {
    this.clickFlag = true;
    this.contents.style.userSelect = "none"
    this.bar.classList.add("is-grabbing")
  }

  onBarUnClick = () => {
    this.clickFlag = false;
    this.contents.style.userSelect = ""
    this.bar.classList.remove("is-grabbing")
  }

  followScrollBar = () => {
    switch(this.option.direction) {
      case "horizontal":
        this.followScrollBarFunc = (e:MouseEvent) => {
          if (this.clickFlag) {
            const mouseX = e.pageX;
            const scrollWrapPosX = this.wrap.getBoundingClientRect().left;
            const mouseToBarDiff = mouseX - this.bar.getBoundingClientRect().left;
            const barPos = mouseX - scrollWrapPosX - mouseToBarDiff;
            const range = this.wrap.clientHeight - this.bar.clientHeight;
            const contentsWidth = this.contents.clientWidth;
            const scrollRange =this.contentsInner ?  this.contentsInner.clientHeight - contentsWidth : 0;
            if (barPos >= 0 && barPos <= range) {
              this.bar.style.left = `${barPos}px`;
              const scrollPos = Util.mapping(barPos, 0, range, 0 , scrollRange);
              this.contents.scrollTo(scrollPos, 0)
            }
          }
        }
        break;
      case "vertical":
        this.followScrollBarFunc = (e: MouseEvent) => {
          if (this.clickFlag) {
            const mouseY = e.pageY;
            const scrollWrapPosY = this.wrap.getBoundingClientRect().top;
            const mouseToBarDiff = mouseY - this.bar.getBoundingClientRect().top;
            const barPos = mouseY - scrollWrapPosY - mouseToBarDiff;
            const range = this.wrap.clientHeight - this.bar.clientHeight;
            const contentsHeight = this.contents.clientHeight;
            const scrollRange =this.contentsInner ?  this.contentsInner.clientHeight - contentsHeight : 0;
            if (barPos >= 0 && barPos <= range) {
              this.bar.style.top = `${barPos}px`;
              const scrollPos = Util.mapping(barPos, 0, range, 0 , scrollRange);
              this.contents.scrollTo(0, scrollPos)
            }
          }
        }
        break;
    }
  }

  addEvent = () => {
    this.contents.addEventListener("scroll", this.moveScrollbar)
    this.bar.addEventListener("mousedown", this.onBarClick);
    window.addEventListener("mouseup", this.onBarUnClick);
    window.addEventListener("mousemove", this.followScrollBarFunc)
  }

  destroy = () => {
    this.contents.removeEventListener("scroll", this.moveScrollbar);
    this.bar.removeEventListener("click", this.onBarClick);
    window.removeEventListener("mouseup", this.onBarUnClick);
    window.removeEventListener("mousemove", this.followScrollBarFunc)
  }
}
