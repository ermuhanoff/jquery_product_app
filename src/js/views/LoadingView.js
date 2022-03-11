import $ from 'jquery';

export default class LoadingView {
  constructor() {
    this.$root = $('#product-table-root');

    this.getLoadingTemplate = () => `
      <div class="d-flex justify-content-center align-items-center w-100 h-100">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    `;
  }

  render() {
    this.$root.html(this.getLoadingTemplate());
  }
}
