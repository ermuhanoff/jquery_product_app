export default {
  getProductsRowTemplate(product, index, localeOptions) {
    return `
      <tr>
        <th scope="row">${index + 1}</th>
        <td>
          <div class="product-table__name-col">
            <span>
              <a href="${product.id}" class="link-primary" data-action="product-info">
                ${product.name}
              </a>
            </span>  
            <span class="badge rounded-pill bg-dark">
              ${product.count}
            </span>
          </div> 
        </td>
        <td>
          ${product.price.toLocaleString(localeOptions.locale, localeOptions.options)}
        </td>
        <td>
          <button 
            data-action="edit" 
            data-product-id="${product.id}" 
            type="button" 
            class="btn btn-outline-primary">
              Edit
          </button>
          <button 
            data-action="remove" 
            data-product-id="${product.id}" 
            type="button" 
            class="btn btn-outline-danger">
              Delete
          </button>
        </td>
      </tr>
    `;
  },

  getProductsTableTemplate(products, sortOptions, localeOptions) {
    const productsRow = products.reduce((row, product, index) => row += this.getProductsRowTemplate(product, index, localeOptions), '');

    return `
      <table class="table table-striped product-table__table">
        <thead>
          <tr>
            <td scope="col">#</td>
            <td scope="col">
              Product Name  
              ${this.getSortButtonTemplate(sortOptions, 'name')}
            </td>
            <td scope="col">
              Price
              ${this.getSortButtonTemplate(sortOptions, 'price')}
            </td>
            <td scope="col">
              Actions
            </td>
          </tr>
        </thead>
        <tbody>
          ${productsRow.trim() === '' ? '<tr><td class="product-table__no-products" colspan="5">No products!</td</tr>' : productsRow}
        </tbody>
      <table>
    `;
  },

  getSortButtonTemplate(sortOptions, sortProperty) {
    const sortSignAsc = '▲';
    const sortSignDesc = '▼';
    const isCurrent = sortOptions.property === sortProperty;
    const sortType = isCurrent ? sortOptions.type : sortOptions.default;

    return `
      <button 
        data-action="sort" 
        data-sort-type="${sortType}" 
        data-sort-property="${sortProperty}" 
        type="button" 
        class="btn btn-outline-dark p-0 px-1 border-0">
          ${sortType === 'asc' ? sortSignAsc : sortSignDesc}
      </button>
    `;
  },

  getSearchTemplate() {
    return `
      <div class="input-group">
        <input type="text" class="form-control no-validate" placeholder="Type product name to search" aria-label="Search" data-action="search-input" aria-describedby="button-search">
        <button class="btn btn-outline-secondary" data-action="search-submit" type="button" id="button-search">Search</button>
      </div>
    `;
  },

  getToolButtonsTemplate() {
    return `
      <div class="d-flex ms-5">
        <button type="button" class="btn btn-primary" data-action="add">Add</button>
      </div>
    `;
  },

  getAlertsTemplate(alerts) {
    return `
      <div>
        ${alerts.reduce((row, alert) => row += this.getAlertTemplate(alert), '')}
      </div>
    `;
  },

  getAlertTemplate({ type, message, id }) {
    return `
      <div class="alert alert-${type} alert-dismissible" role="alert">
        ${message}
        <button type="button" class="btn-close" data-action="close-alert" data-alert-id=${id}></button>
      </div>
    `;
  },

  getPanelTemplate() {
    return `
      <div class="d-flex mb-3 product-table__panel">
        ${this.getSearchTemplate()}
        ${this.getToolButtonsTemplate()}
      </div>
    `;
  },

  getMainTemplate(content) {
    return `
      <section class="product-table">
        ${content}
      </section>
      <div id="product-table-root-modal"></div>
    `;
  },
};
