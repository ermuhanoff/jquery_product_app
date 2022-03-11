export default {
  getModalFormTemplate({ disabled, data = {}, delivery, localeOptions }) {
    const readOnly = disabled ? 'disabled readonly' : '';
    const getProductProperty = (property) => property || '';

    return `
      <form id="add-form" class="row g-3" novalidate>
        <div class="col-md-6">
          <label for="name" class="form-label">Name</label>
          <input
            type="text"
            class="form-control"
            name="name" id="name"
            value="${getProductProperty(data.name)}"
            pattern=".{1,15}"
            required
            ${readOnly}
          >
          <div class="invalid-feedback">
            Name must be none-epmty and length less than 15!
          </div>
        </div>
        <div class="col-md-6">
          <label for="email" class="form-label">Email</label>
          <input
            type="email"
            class="form-control"
            name="email"
            value="${getProductProperty(data.email)}"
            id="email"
            pattern="\\S+@\\S+\\.\\S+"
            required
            ${readOnly}
          >
          <div class="invalid-feedback">
            Email must be valid email address!
          </div>
        </div>
        <div class="col-md-4">
          <label for="count" class="form-label">Count</label>
          <input
            type="number"
            class="form-control"
            name="count"
            value="${getProductProperty(data.count)}"
            id="count"
            pattern="\\d+"
            data-action="input-paste"
            min="1"
            required
            ${readOnly}
          >
          <div class="invalid-feedback">
            Count must be number!
          </div>
        </div>
        <div class="col-md-5">
          <label for="price" class="form-label">Price</label>
          <input 
            type="text" 
            class="form-control" 
            name="price"
            value="${getProductProperty(data.price).toLocaleString(localeOptions.locale, localeOptions.options)}"
            id="price" 
            data-action="price-formatter" 
            data-raw-price="${getProductProperty(data.price)}"
            pattern="\\S+" 
            required
            ${readOnly}
          >
          <div class="invalid-feedback">
            Price must be number!
          </div>
        </div>
        <div for="delivery" class="form-label">Delivery</div>
        ${
          readOnly ? '' :
          `
            <div class="col-md-6">
              <label for="country" class="form-label">Delivery point</label>
              <select
                class="form-select"
                name="delivery"
                id="delivery"
                data-action="delivery-select"
                required
                ${readOnly}
              > 
                <option selected value="none">w/o delivery</option>
                <option value="#country">Country</option>
                <option value="#city" disabled>City</option>
              </select>
              <div class="invalid-feedback">
                Please select country and city!
              </div>
            </div>
          `
        }
        ${readOnly && 
          (!getProductProperty(data.delivery).city
          || !getProductProperty(data.delivery).country)
          ? '<div class="col-md-6">None</div>'
          : `<div class="col-md-4 delivery-option" id="country" ${!readOnly ? 'style="display: none"' : ''}>
            <label for="country" class="form-label">Country</label>
            <select
              class="form-select"
              name="country"
              value="${getProductProperty(data?.delivery?.country)}"
              data-action="country-select"
              id="country"
              required
              disabled
              ${readOnly}
            >
              <option ${!getProductProperty(data?.delivery?.country) ? 'selected value=""' : ''} disabled>None</option>
              ${Object.keys(delivery).reduce((row, item) => row += `<option ${item === getProductProperty(data?.delivery?.country) ? 'selected' : ''} value="${item}">${item}</option>`, '')}
            </select>
            <div class="invalid-feedback">
              Please choose a country!
            </div>
          </div>
          <div class="col-md-4 delivery-option" id="city" ${!readOnly ? 'style="display: none"' : ''}>
            <label class="form-label">City</label>
            <input type="checkbox" class="city-main-input" style="visibility: hidden;" disabled required>
            <div class="checkboxes">
              ${readOnly && getProductProperty(data?.delivery?.city) ? this.getCityTemplate(getProductProperty(data?.delivery?.city), readOnly) : ''}
            </div>
            <div class="invalid-feedback">
              Please select at least one city!
            </div>
          </div>`
        }
      </form>
    `;
  },

  getCityTemplate(cities, readOnly = '') {
    return cities.reduce((row, item) => row += `
      <div class="form-check">
        <input 
          class="form-check-input city-input no-validate"
          type="checkbox"
          value="${item}"
          id="${item}"
          name="city"
          data-action="city-select"
          ${readOnly}
          ${readOnly ? 'checked' : ''}
        >
        <label class="form-check-label" for="${item}">
          ${item}
        </label>
      </div>
    `, '');
  },

  getModalTemplate(title, body, footer) {
    return `
      <div class="modal fade show" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${title}</h5>
              <button type="button" class="btn-close" data-action="modal-close"></button>
            </div>
            <div class="modal-body">
              ${body}
            </div>
            <div class="modal-footer">
              ${footer}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  getDeleteModalTemplate(product) {
    return this.getModalTemplate(
      'Are you sure want to delete?',
      `<p>${product.id} ${product.name}</p>`,
      `
        <button type="button" class="btn btn-secondary" data-action="modal-close">Close</button>
        <button type="button" class="btn btn-danger" data-action="modal-submit">Delete</button>
      `,
    );
  },

  getAddModalTemplate(product, delivery, localeOptions) {
    return this.getModalTemplate(
      'Add new product',
      this.getModalFormTemplate({ disabled: false, delivery, localeOptions }),
      `
        <button type="button" class="btn btn-secondary" data-action="modal-close">Close</button>
        <button type="button" class="btn btn-primary" data-action="modal-submit" data-form="#add-form">Add</button>
      `,
    );
  },

  getInfoModalTemplate(product, delivery, localeOptions) {
    return this.getModalTemplate(
      `${product.name} - ${product.id}`,
      this.getModalFormTemplate({ disabled: true, data: product, delivery, localeOptions }),
      `
        <button type="button" class="btn btn-secondary" data-action="modal-close">Close</button>
      `,
    );
  },

  getEditModalTemplate(product, delivery, localeOptions) {
    return this.getModalTemplate(
      `${product.name} - ${product.id}`,
      this.getModalFormTemplate({ disabled: false, data: product, delivery, localeOptions }),
      `
        <button type="button" class="btn btn-secondary" data-action="modal-close">Close</button>
        <button type="button" class="btn btn-primary" data-action="modal-submit" data-form="#add-form">Edit</button>
      `,
    );
  },
};
