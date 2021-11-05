/* global Flickity */ // eslint-disable-line

import { select, templates } from '../settings.js'; // eslint-disable-line

class Home {
  constructor(element){
    const thisHome = this;

    thisHome.render(element);
    thisHome.initWidgets();

  }

  render(element) {
    const thisHome = this;
    const generatedHTML = templates.homeWidget();

    console.log (generatedHTML);

    thisHome.dom = {};
    thisHome.dom.wrapper= element;
    thisHome.dom.wrapper.innerHTML = generatedHTML;
  }

  initWidgets() {

    // const element = document.querySelector(select.widgets.carousel);

    //new Flickity (element, {
    // options
    //  autoPlay: 2500,
    //  prevNextButtons: false,
    //  imagesLoaded: true,
    //  });

  }
}

export default Home;
