export default class ProductModalModel {
  constructor(product) {
    this.id = product.id;
    this.name = product.name;
    this.count = product.count;
    this.price = product.price;
    this.email = product.email;
    this.delivery = product.delivery;
  }
}
