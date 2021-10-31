import { settings, select, classNames, templates } from './../settings.js';
import { utils } from './../utils.js';
import CartProduct from './CartProduct.js';

class Cart {
  constructor(element) {
    const thisCart = this;

    thisCart.products = [];

    thisCart.getElements(element);

    thisCart.initActions();

    console.log('new Cart', thisCart);
  }
  getElements(element) {
    const thisCart = this;

    thisCart.dom = {};

    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
    thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(select.cart.deliveryFee);
    thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(select.cart.totalNumber);
    thisCart.dom.subtotalPrice = thisCart.dom.wrapper.querySelector(select.cart.subtotalPrice);
    thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelectorAll(select.cart.totalPrice);
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    thisCart.dom.address = thisCart.dom.form.querySelector(select.cart.address);
    thisCart.dom.phone = thisCart.dom.form.querySelector(select.cart.phone);
  }


  initActions() {
    const thisCart = this;
    thisCart.dom.toggleTrigger.addEventListener('click', function () {
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });
    thisCart.dom.productList.addEventListener('updated', function () {
      thisCart.update();
    });
    thisCart.dom.productList.addEventListener('remove', function (event) {
      thisCart.remove(event.detail.cartProduct);
    });
    thisCart.dom.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisCart.prepareOrder();
    });
  }
  add(menuProduct) {
    console.log('Cart.add: ', menuProduct);

    const thisCart = this;

    /* [DONE] generate HTML of added product */
    const generatedHTML = templates.cartProduct(menuProduct);

    /* [DONE] create DOM element based on HTML code */
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);

    /* [DONE] insert DOM element into container */
    thisCart.dom.productList.appendChild(generatedDOM);
    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    console.log('thisCart.products', thisCart.products);

    thisCart.update();
  }
  remove(removedProduct) {
    const thisCart = this;

    const indexOfRemovedProduct = thisCart.products.indexOf(removedProduct);

    removedProduct.dom.wrapper.remove();

    thisCart.products.splice(indexOfRemovedProduct, 1);

    thisCart.update();
  }


  update() {
    const thisCart = this;

    let deliveryFee;
    let totalNumber = 0;
    let subtotalPrice = 0;

    for (const product of thisCart.products) {
      totalNumber += product.amount;
      subtotalPrice += product.price;
    }

    /* shorthand if
     condition ? doThisIfTrue : doThisIfFalse*/
    totalNumber == 0 ? deliveryFee = 0 : deliveryFee = settings.cart.defaultDeliveryFee;

    thisCart.totalPrice = subtotalPrice + deliveryFee;

    thisCart.dom.totalNumber.innerHTML = totalNumber;
    thisCart.dom.subtotalPrice.innerHTML = subtotalPrice;
    thisCart.dom.deliveryFee.innerHTML = deliveryFee;

    for (const domTotalPrice of thisCart.dom.totalPrice) {
      domTotalPrice.innerHTML = thisCart.totalPrice;
    }
  }
  prepareOrder() {
    const thisCart = this;
    const url = settings.db.url + '/' + settings.db.orders;

    let payload = {};
    payload.address = thisCart.dom.address.value;
    payload.phone = thisCart.dom.phone.value;
    payload.totalPrice = thisCart.totalPrice;
    payload.subtotalPrice = thisCart.subtotalPrice;
    payload.totalNumber = thisCart.totalNumber;
    payload.deliveryFee = thisCart.deliveryFee;
    payload.products = [];
    for (let prod of thisCart.products) {
      payload.products.push(prod.getData());
    }
    thisCart.send(url, payload);
  }

  send (url, payload) {

    const options = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options);
  }
}
export default Cart;
