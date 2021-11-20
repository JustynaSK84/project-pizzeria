/* global Flickity */

import { select, templates } from '../settings.js'; // eslint-disable-line

class Home {
  constructor(element){
    const thisHome = this;

    thisHome.render(element);
    thisHome.jumpToSubpage();
    thisHome.initWidgets();

  }

  render(element) {
    const thisHome = this;
    const generatedHTML = templates.homeWidget();

    console.log (generatedHTML);

    thisHome.dom = {};
    thisHome.dom.wrapper= element;
    thisHome.dom.wrapper.innerHTML = generatedHTML;
    thisHome.dom.order = element.querySelector(select.home.order);
    thisHome.dom.book = element.querySelector(select.home.book);
  }

  initWidgets() {

    const element = document.querySelector(select.widgets.carousel);

    new Flickity (element, {
      // options
      autoPlay: 2500,
      prevNextButtons: false,
      imagesLoaded: true,
    });

  }
  jumpToSubpage() {
    const thisHome = this;

    thisHome.dom.order.addEventListener('click', function(){
      thisHome.activatePage('order');
    });

    thisHome.dom.book.addEventListener('click', function(){
      thisHome.activatePage('booking');
    });
  }
}

export default Home;
