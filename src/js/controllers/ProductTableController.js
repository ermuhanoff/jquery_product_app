import ProductTableModel from '../models/ProductTableModel';
import LoadingView from '../views/LoadingView';
import ProductTableView from '../views/ProductTableView';
import ProductModal from '../modules/ProductModal/controllers/ProductModalController';

export default class ProductTableController {
  constructor() {
    this.productTableModel = new ProductTableModel();
    this.loadingView = new LoadingView();
    this.productTableView = new ProductTableView({
      handlers: {
        onAdd: this.onAddProduct.bind(this),
        onEdit: this.onEditProduct.bind(this),
        onRemove: this.onRemoveProduct.bind(this),
        onSort: this.onSortProduct.bind(this),
        onCloseAlert: this.onCloseAlert.bind(this),
        onSearch: this.onSearch.bind(this),
        onProductView: this.onViewProduct.bind(this),
      },
    });
  }

  renderView() {
    const state = {
      products: this.productTableModel.products,
      sortOptions: this.productTableModel.sortOptions,
      alerts: this.productTableModel.alerts,
      localeOptions: this.productTableModel.localeOptions,
    };

    this.productTableView.render(state);
  }

  async init() {
    this.loadingView.render();
    await this.productTableModel.getProducts();
    this.renderView();
    this.productTableView.initHandlers();
  }

  onAddProduct() {
    this.openModal(
      'add',
      null,
      {
        onSubmit: this.addProduct.bind(this),
      },
    );
  }

  onEditProduct(productId) {
    this.openModal(
      'edit',
      { productId },
      {
        onSubmit: this.editProduct.bind(this),
      },
    );
  }

  onViewProduct(productId) {
    this.openModal('info', { productId });
  }

  async onRemoveProduct(productId) {
    this.openModal(
      'delete',
      { productId },
      {
        onSubmit: this.removeProduct.bind(this),
      },
    );
  }

  onSortProduct(sortType, sortProperty) {
    this.productTableModel.products = this.sortProduct(sortType, sortProperty, this.productTableModel.products);
    this.productTableView.renderProductTable(
      this.productTableModel.products,
      this.productTableModel.sortOptions,
      this.productTableModel.localeOptions,
    );
  }

  onCloseAlert(alertId) {
    this.productTableModel.closeAlert(alertId);
    this.renderView();
  }

  onSearch(searchText) {
    if (!this.productTableModel.savedProducts) {
      this.productTableModel.savedProducts = this.productTableModel.products;
    }
    if (searchText.trim() !== '') {
      this.productTableModel.products = this.productTableModel.savedProducts.filter(
        (product) => product.name.toLowerCase().includes(searchText.toLowerCase()),
      );
    } else {
      this.productTableModel.products = this.productTableModel.savedProducts;
    }

    this.productTableView.renderProductTable(
      this.productTableModel.products,
      this.productTableModel.sortOptions,
      this.productTableModel.localeOptions,
    );
  }

  openAlert(type, message) {
    this.productTableModel.openAlert(type, message);
    this.renderView();
  }

  openModal(type, data, handlers) {
    let currentProduct = null;
    if (data) {
      currentProduct = this.productTableModel.products.find((product) => product.id === data.productId);
    }

    const modal = new ProductModal({
      initialState: currentProduct,
      type,
      handlers,
      delivery: this.productTableModel.delivery,
      localeOptions: this.productTableModel.localeOptions,
    });

    modal.show();
  }

  closeModal(modal) {
    this.productTableView.renderModal(modal);
  }

  sortProduct(sortType, sortProperty, products) {
    const sorted = products.sort((productA, productB) => {
      const propertyType = typeof productA[sortProperty] === 'string' ? -1 : 1;

      if (productA[sortProperty] < productB[sortProperty]) return propertyType * -1;
      else if (productA[sortProperty] > productB[sortProperty]) return propertyType;
      return 0;
    });

    this.productTableModel.sortOptions.property = sortProperty;

    if (sortType === 'asc') {
      this.productTableModel.sortOptions.type = 'desc';
      return sorted.reverse();
    }
    this.productTableModel.sortOptions.type = 'asc';
    return sorted;
  }

  async removeProduct(productId) {
    try {
      await this.productTableModel.removeProduct(productId);

      this.openAlert('success', 'Product has been removed!');
      this.renderView();
    } catch (error) {
      this.openAlert('danger', error.statusText);
    }
  }

  async editProduct(productId, productData) {
    try {
      await this.productTableModel.editProduct(productId, productData);

      this.openAlert('success', 'Product has been updated!');
      this.renderView();
    } catch (error) {
      this.openAlert('danger', error.statusText);
    }
  }

  async addProduct(productId, productData) {
    try {
      await this.productTableModel.addProduct(productData);

      this.openAlert('success', 'Product has been added!');
      this.renderView();
    } catch (error) {
      this.openAlert('danger', error.statusText);
    }
  }
}
