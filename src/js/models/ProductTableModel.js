import $ from 'jquery';
import AlertModel from './AlertModel';

export default class ProductTableModel {
  constructor() {
    this.products = [];
    this.filtredProducts = [];
    this.hostUrl = 'https://api-crud-mongo.herokuapp.com/api/v1/products';
    this.sortOptions = {
      type: 'desc',
      property: 'name',
      default: 'desc',
    };
    this.alerts = [];
    this.localeOptions = {
      locale: 'en-US',
      options: {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
      },
    };
    this.delivery = {
      Russia: [
        'Moscow',
        'Saint-Petersburg',
        'Saratov',
      ],
      USA: [
        'New York',
        'Los Angeles',
        'Chicago',
      ],
      Japan: [
        'Tokyo',
        'Osaka',
        'Nagasaki',
      ],
    };
  }

  async getProducts() {
    this.products = (await $.get(this.hostUrl)).Data;
  }

  async addProduct(productData) {
    let dataToAdd = {};
    return fetch(this.hostUrl + '/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(productData),
    })
      .then((response) => response.json())
      .then((json) => {
        dataToAdd = { id: json.Data.id, ...productData };
        this.editProduct(json.Data.id, productData);
      })
      .then(() => this.products.push(dataToAdd));
  }

  async editProduct(productId, productData) {
    const requestData = {
      id: productId,
      ...productData,
    };

    return fetch(this.hostUrl + `/update/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(requestData),
    })
      .then(() => {
        const updatedProductIndex = this.products.findIndex((product) => product.id === productId);
        this.products[updatedProductIndex] = requestData;
      });
  }

  async removeProduct(productId) {
    const response = await $.ajax({
      url: this.hostUrl + `/delete/${productId}`,
      method: 'DELETE',
    }).done(() => this.products = this.products.filter(product => product.id !== productId));

    return response;
  }

  closeAlert(alertId) {
    this.alerts = this.alerts.filter((alert) => alert.id !== alertId);
  }

  openAlert(type, message) {
    this.alerts.push(new AlertModel(type, message, Date.now()));
  }
}
