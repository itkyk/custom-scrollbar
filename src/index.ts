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
  private contentsInner: HTMLDivElement | null;
  private clickFlag: boolean;
  constructor(target: string | HTMLElement | Element, option:optionProps = {}) {
    this.target = typeof target === "string" ? document.querySelector(target) as HTMLElement : target;
    this.option = Object.assign(defaultOption, option);
    this.contents = this.target.querySelector(this.option.contents) as HTMLElement;
    this.bar = this.target.querySelector(this.option.bar) as HTMLElement;
    this.wrap = this.target.querySelector(this.option.wrap) as HTMLElement;
    this.contentsInner = null;
    this.clickFlag = false;
    this.createWrapper();
    this.addEvent();
  }

  watchScroll = () => {
    switch (this.option.direction) {
      case "horizontal":
        return this.contents.scrollLeft;
      case "vertical":
        return this.contents.scrollTop
    }
  }

  createWrapper = () => {
    const contentsHTML = this.contents.innerHTML;
    this.contents.innerHTML = `<div class="custom-scrollbar-content-wrapper">${contentsHTML}</div>`
    this.contentsInner = this.target.querySelector(".custom-scrollbar-content-wrapper") as HTMLDivElement;
  }

  moveScrollbar = () => {
    const scrollVal = this.watchScroll();
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

  followScrollBar = (e:MouseEvent) => {
    if (this.clickFlag) {
      const mouseY = e.pageY;
      const scrollWrapPosY = this.wrap.getBoundingClientRect().top;
      const barPos = mouseY - scrollWrapPosY;
      const range = this.wrap.clientHeight - this.bar.clientHeight;
      const contentsHeight = this.contents.clientHeight;
      const scrollRange =this.contentsInner ?  this.contentsInner.clientHeight - contentsHeight : 0;
      if (barPos >= 0 && barPos <= range) {
        this.bar.style.top = `${barPos}px`;
        const scrollPos = Util.mapping(barPos, 0, range, 0 , scrollRange);
        this.contents.scrollTo(0, scrollPos)
      }
      console.log(mouseY - scrollWrapPosY)
    }
  }

  addEvent = () => {
    this.contents.addEventListener("scroll", this.moveScrollbar)
    this.bar.addEventListener("mousedown", this.onBarClick);
    window.addEventListener("mouseup", this.onBarUnClick);
    window.addEventListener("mousemove", this.followScrollBar)
  }

  destroy = () => {
    this.contents.removeEventListener("scroll", this.moveScrollbar);
    this.bar.removeEventListener("click", this.onBarClick);
    window.removeEventListener("mouseup", this.onBarUnClick);
  }
}
