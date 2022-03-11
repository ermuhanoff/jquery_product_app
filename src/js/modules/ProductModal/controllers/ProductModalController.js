import ProductModalModel from '../models/ProductModalModel';
import ProductModalView from '../views/ProductModalView';

export default class ProductModalController {
  constructor(props) {
    this.productModalModel = props.initialState ? new ProductModalModel(props.initialState) : null;
    this.productModalView = new ProductModalView({
      type: props.type,
      handlers: {
        onSubmit: this.onSubmit.bind(this),
      },
      delivery: props.delivery,
      localeOptions: props.localeOptions,
    });
    this.handlers = props.handlers;
  }

  show() {
    this.productModalView.showModal(this.productModalModel);
  }

  onSubmit(productData) {
    this.handlers.onSubmit(this.productModalModel?.id, productData);
  }
}
