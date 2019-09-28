/**
 * Check each method in the shopping cart controller and add code to implement
 * the functionality or fix any bug.
 * The static methods and their function include:
 *
 * - generateUniqueCart - To generate a unique cart id
 * - addItemToCart - To add new product to the cart
 * - getCart - method to get list of items in a cart
 * - updateCartItem - Update the quantity of a product in the shopping cart
 * - emptyCart - should be able to clear shopping cart
 * - removeItemFromCart - should delete a product from the shopping cart
 * - createOrder - Create an order
 * - getCustomerOrders - get all orders of a customer
 * - getOrderSummary - get the details of an order
 * - processStripePayment - process stripe payment
 *
 *  NB: Check the BACKEND CHALLENGE TEMPLATE DOCUMENTATION in the readme of this repository to see our recommended
 *  endpoints, request body/param, and response object for each of these method
 */

/**
 *
 *
 * @class shoppingCartController
 */
const uniqid = require('uniqid');
const { ShoppingCart, Product, Order } = require('../database/models');
class ShoppingCartController {
  /**
   * generate random unique id for cart identifier
   *
   * @static
   * @param {obj} req express request object
   * @param {obj} res express response object
   * @returns {json} returns json response with cart_id
   * @memberof shoppingCartController
   */
  static generateUniqueCart(req, res) {
    // implement method to generate unique cart Id
    const cart_id = uniqid();

    return res.status(200).json({ message: 'this works', cart_id });
  }

  /**
   * adds item to a cart with cart_id
   *
   * @static
   * @param {obj} req express request object
   * @param {obj} res express response object
   * @returns {json} returns json response with cart
   * @memberof ShoppingCartController
   */
  static async addItemToCart(req, res, next) {
    // implement function to add item to cart
    let { cart_id, product_id, attributes, quantity } = req.body;
    let shoppingCart = new ShoppingCart();
    try {
      shoppingCart.cart_id = cart_id;
      shoppingCart.product_id = product_id;
      shoppingCart.attributes = attributes;
      shoppingCart.quantity = quantity;
      let response = await shoppingCart.save();
      return res.status(200).json({
        item_id: response.item_id,
        cart_id: response.cart_id,
        attributes: response.attributes,
        product_id: response.product_id,
        quantity: response.quantity,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * get shopping cart using the cart_id
   *
   * @static
   * @param {obj} req express request object
   * @param {obj} res express response object
   * @returns {json} returns json response with cart
   * @memberof ShoppingCartController
   */
  static async getCart(req, res, next) {
    // implement method to get cart items
    try {
      let { cart_id } = req.params;
      let rows = await ShoppingCart.findAll({
        where: { cart_id },
        attributes: ['item_id', 'cart_id', 'product_id', 'attributes', 'quantity'],
        include: {
          model: Product,
          attributes: ['name', 'image', 'price', 'discounted_price'],
        },
      });
      return res.status(200).json({
        message: 'this works',
        response: rows.map(item => {
          return {
            item_id: item.item_id,
            cart_id: item.cart_id,
            product_id: item.product_id,
            attributes: item.attributes,
            image: item.Product.image,
            price: item.Product.price,
            discounted_price: item.Product.discounted_price,
            name: item.Product.name,
            quantity: item.quantity,
            subtotal:
              parseFloat(item.quantity) *
              (parseFloat(item.Product.price) - parseFloat(item.Product.discounted_price)),
          };
        }),
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * update cart item quantity using the item_id in the request param
   *
   * @static
   * @param {obj} req express request object
   * @param {obj} res express response object
   * @returns {json} returns json response with cart
   * @memberof ShoppingCartController
   */
  static async updateCartItem(req, res, next) {
    const { item_id } = req.params; // eslint-disable-line
    const { quantity } = req.body;
    try {
      let response = await ShoppingCart.update({ quantity }, { plain: true, where: { item_id } });
      if (!response) throw new Error('Error while updating');
      let rows = await ShoppingCart.findOne({
        item_id,
        attributes: ['item_id', 'cart_id', 'attributes', 'product_id', 'quantity'],
      });
      if (!rows) throw new Error('Error while fetching');
      return res.status(200).json({
        item_id: rows.item_id,
        cart_id: rows.cart_id,
        attributes: rows.attributes,
        product_id: rows.product_id,
        quantity: rows.quantity,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * removes all items in a cart
   *
   * @static
   * @param {obj} req express request object
   * @param {obj} res express response object
   * @returns {json} returns json response with cart
   * @memberof ShoppingCartController
   */
  static async emptyCart(req, res, next) {
    // implement method to empty cart
    let { cart_id } = req.params;
    try {
      await ShoppingCart.destroy({ where: { cart_id } });
      return res.status(200).send([]);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * remove single item from cart
   * cart id is obtained from current session
   *
   * @static
   * @param {obj} req express request object
   * @param {obj} res express response object
   * @returns {json} returns json response with message
   * @memberof ShoppingCartController
   */
  static async removeItemFromCart(req, res, next) {
    try {
      // implement code to remove item from cart here
      let { item_id } = req.params;
      await ShoppingCart.destroy({ where: { item_id } });
      return res.status(200).json({ message: 'Deleted' });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * create an order from a cart
   *
   * @static
   * @param {obj} req express request object
   * @param {obj} res express response object
   * @returns {json} returns json response with created order
   * @memberof ShoppingCartController
   */
  static async createOrder(req, res, next) {
    try {
      // implement code for creating order here
      let { cart_id, shipping_id, tax_id } = req.body;
      let order = new Order();
      order.cart_id = cart_id;
      order.shipping_id = shipping_id;
      order.tax_id = tax_id;
      let response = await order.save();
      if (!response) throw new Error('Error while saving');
      res.status(200).json({ order_id: response.order_id });
    } catch (error) {
      return next(error);
    }
  }

  /**
   *
   *
   * @static
   * @param {obj} req express request object
   * @param {obj} res express response object
   * @returns {json} returns json response with customer's orders
   * @memberof ShoppingCartController
   */
  static async getCustomerOrders(req, res, next) {
    const { customer_id } = req; // eslint-disable-line
    try {
      // implement code to get customer order
    } catch (error) {
      return next(error);
    }
  }

  /**
   *
   *
   * @static
   * @param {obj} req express request object
   * @param {obj} res express response object
   * @returns {json} returns json response with order summary
   * @memberof ShoppingCartController
   */
  static async getOrderSummary(req, res, next) {
    const { order_id } = req.params; // eslint-disable-line
    const { customer_id } = req; // eslint-disable-line
    try {
      // write code to get order summary
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async processStripePayment(req, res, next) {
    const { email, stripeToken, order_id } = req.body; // eslint-disable-line
    const { customer_id } = req; // eslint-disable-line
    try {
      // implement code to process payment and send order confirmation email here
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = ShoppingCartController;
