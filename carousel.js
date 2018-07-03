(function(){
  const defaultArg = {
    imgContent: ".banner-content",
    bul: ".bullet",
    item: ".item",
    screenWidth: screen.width,
  }
  function Carousel(opt){
    this.init(opt);
  }
  Carousel.prototype.init = function(opt){
    this.params = {
      ...defaultArg,
      ...opt,
    };
    this.pos = 1;
    this.items = document.querySelectorAll(this.params.item);
    this.imgContent = document.querySelector(this.params.imgContent);
    this.buls = document.querySelectorAll(this.params.bul); 
    this.itemlens = this.items.length;
    const relContentWidth = `${this.params.screenWidth * this.itemlens}px`;
    this.imgContent.style.width = relContentWidth;
    this.imgContent.style.transform = `translateX(${-this.params.screenWidth * this.pos}px)`;
    for (let i = 0; i < this.itemlens; i++) {
      const item = this.items[i];
      item.style.width = `${this.params.screenWidth}px`;
    }
    this.addEvent();
    this.intPlay();
  }
  Carousel.prototype.addEvent = function(){
    let startX = startY = 0;
    const that = this;
    const {screenWidth} = that.params;
    this.imgContent.addEventListener("touchstart", function(e){
      const touch = e.changedTouches[0];
      that.removePlay();
      that.isClick = true;
      startX = touch.clientX;
      startY = touch.clientY;
    })
    this.imgContent.addEventListener("touchmove", function(e){
      const move = e.changedTouches[0];
      const moveX = move.clientX;
      const moveY = move.clientY;
      const movedX = moveX - startX;
      const movedY = moveY - startY;
      
      if (Math.abs(movedX) > (Math.abs(movedY) * 2)) {
        that.imgContent.style.transitionDuration = "0ms";
        that.imgContent.style.transform = `translateX(${-screenWidth*that.pos + movedX}px)`; 
        e.preventDefault();
      } 
    })
    this.imgContent.addEventListener("touchend", function(e){
      that.isClick = false;
      const moveEnd = e.changedTouches[0];
      const endX = moveEnd.clientX;
      const endY = moveEnd.clientY;
      const distanceX = endX - startX;
      const distanceY = endY - startY;
      if (Math.abs(distanceX) > 80 && Math.abs(distanceX) > (Math.abs(distanceY) * 2)) {
        that.play(distanceX < 0 ? 1 : -1);
        return;
      }
      if (Math.abs(distanceX) <= (Math.abs(distanceY) * 2)){
        that.intPlay();
      }
      that.imgContent.style.transitionDuration = "300ms";
      that.imgContent.style.transform = `translateX(${-screenWidth * that.pos}px)`;
    })
    this.imgContent.addEventListener("transitionend", function(e){
      that.imgContent.style.transitionDuration = "0ms";
      that.imgContent.style.transform = `translateX(${-screenWidth * that.pos }px)`;
      if(!that.isHasInterval && !that.isClick){
        that.intPlay();
      }
    })
  }
  Carousel.prototype.intPlay = function(){
    const that = this;
    this.intePlay = setInterval(function(){
      that.play(1);
    }, 2000);
    that.isHasInterval = true;
  }
  Carousel.prototype.removePlay = function(){
    clearInterval(this.intePlay);
    this.isHasInterval = false;
  }
  Carousel.prototype.play = function(change){
    const target = this.pos + change;
    this.buls[this.pos-1].classList.remove("active");
    this.pos = target;
    if (this.pos === 0) {
      this.pos = this.itemlens - 2;
    }else if (this.pos === this.itemlens - 1) {
      this.pos = 1
    }
    this.buls[this.pos -1].classList.add("active");
    this.imgContent.style.transitionDuration = "900ms";
    this.imgContent.style.transform = `translateX(${-this.params.screenWidth * target}px)`;
   }
  window.Carousel = function(opt){
    return new Carousel(opt);
  }
})()
