import $ from 'jquery';
import ProductTableTamplates from './ProductTableTamplates.js';

export default class ProductTableView {
  constructor(props) {
    this.$root = $('#product-table-root');
    this.handlers = props.handlers;
  }

  render(state) {
    const { products, sortOptions, alerts, localeOptions } = state;

    const panelRow = ProductTableTamplates.getPanelTemplate();
    const alertsRow = ProductTableTamplates.getAlertsTemplate(alerts);
    const tableRow = ProductTableTamplates.getProductsTableTemplate(products, sortOptions, localeOptions);
    const mainRow = ProductTableTamplates.getMainTemplate(panelRow + alertsRow + tableRow);

    this.$root.html(mainRow);
  }

  renderProductTable(products, sortOptions, localeOptions) {
    const tableRow = ProductTableTamplates.getProductsTableTemplate(products, sortOptions, localeOptions);

    this.$root.find('.product-table__table').html(tableRow);
  }

  onProductViewClick(event) {
    event.preventDefault();

    this.handlers.onProductView($(event.target).attr('href'));
  }

  initHandlers() {
    this.$root.on('click', '[data-action="remove"]', (event) => this.handlers.onRemove($(event.target).data('product-id')));
    this.$root.on('click', '[data-action="edit"]', (event) => this.handlers.onEdit($(event.target).data('product-id')));
    this.$root.on('click', '[data-action="add"]', () => this.handlers.onAdd());
    this.$root.on('click', '[data-action="sort"]',
      (event) => {
        this.handlers.onSort(
          $(event.target).data('sort-type'),
          $(event.target).data('sort-property'),
        );
      });
    this.$root.on('click', '[data-action="close-alert"]', (event) => this.handlers.onCloseAlert($(event.target).data('alert-id')));
    this.$root.on('input', '[data-action="search-input"]', (event) => this.handlers.onSearch($(event.target).val()));
    this.$root.on('click', '[data-action="search-submit"]', () => this.handlers.onSearch($('[data-action="search-input"]').val()));
    this.$root.on('click', '[data-action="product-info"]', this.onProductViewClick.bind(this));
  }
}
