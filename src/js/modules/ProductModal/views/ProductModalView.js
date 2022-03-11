/* eslint-disable class-methods-use-this */
import $ from 'jquery';
import ProductModalTemplates from './ProductModalTemplates';

export default class ProductModalView {
  constructor(props) {
    this.$mainRoot = $('#product-table-root');
    this.$root = $('<div></div>');
    this.handlers = props.handlers;
    this.delivery = props.delivery;
    this.localeOptions = props.localeOptions;

    this.inValidClassName = 'is-invalid';
    this.validClassName = 'is-valid';

    switch (props.type) {
      case 'delete':
        this.template = (product) => ProductModalTemplates.getDeleteModalTemplate(product);
        break;
      case 'add':
        this.template = (product, delivery, localeOptions) => ProductModalTemplates.getAddModalTemplate(null, delivery, localeOptions);
        break;
      case 'edit':
        this.template = (product, delivery, localeOptions) => ProductModalTemplates.getEditModalTemplate(product, delivery, localeOptions);
        break;
      case 'info':
        this.template = (product, delivery, localeOptions) => ProductModalTemplates.getInfoModalTemplate(product, delivery, localeOptions);
        break;
      default:
        this.template = null;
    }

    this.initHandlers();
  }

  render(modalModel) {
    const $modal = $(this.template(modalModel, this.delivery, this.localeOptions));
    this.$mainRoot.append(this.$root);
    this.$root.html($modal);
    $modal.animate({ opacity: 1 }, 1);
  }

  showModal(modalModel) {
    this.render(modalModel);
  }

  closeModal(event) {
    const $modal = $(event.target).closest('.modal');
    $modal.animate({ opacity: 0 }, 150, () => { $modal.remove(); this.$root.remove(); });
  }

  onSubmitModal(event) {
    if (this.validateFrom(event)) {
      const $form = $('.modal').find('form');
      const data = {};

      if ($form.length !== 0) {
        let formData = $form.serializeArray();
        const formDataPrice = formData.find((dataItem) => dataItem.name === 'price');
        const formDataDelivery = formData.find((dataItem) => dataItem.name === 'delivery');
        const formDataCountry = formData.find((dataItem) => dataItem.name === 'country');
        const formDataCount = formData.find((dataItem) => dataItem.name === 'count');

        if (formDataCount) {
          formDataCount.value = +formDataCount.value;
        }

        if (formDataPrice) {
          formDataPrice.value = +$form.find('input[name=price]').data('raw-price');
        }

        if (formDataDelivery) {
          if (formDataDelivery.value === 'none') {
            formDataDelivery.value = {};
          } else {
            formDataDelivery.value = {
              country: formDataCountry.value,
              city: [...formData.filter((dataItem) => dataItem.name === 'city').map((dataItem) => dataItem.value)],
            };

            formData = formData.filter((dataItem) => dataItem.name !== 'city' && dataItem.name !== 'country');
          }
        }

        formData.forEach((dataItem) => data[dataItem.name] = dataItem.value);
       
      }
      this.closeModal(event);
      this.handlers.onSubmit(data);
    } else {
      const $from = $($(event.target).data('form'));
      const invalidFields = $from.find(`.${this.inValidClassName}`);

      invalidFields[0].focus();
    }
  }

  onFocusChange(event) {
    this.validateField(event.target);
  }

  onProductViewClick(event) {
    event.preventDefault();

    this.handlers.onProductView($(event.target).attr('href'));
    return false;
  }

  onPriceFocusOff(event) {
    const fieldValue = $(event.target).val();

    if (fieldValue.trim() === '') return;

    const notFormattedPrice = +(fieldValue) || 0;

    $(event.target).data('raw-price', notFormattedPrice);
    $(event.target).val(notFormattedPrice.toLocaleString(this.localeOptions.locale, this.localeOptions.options));
  }

  onPriceFocus(event) {
    const formattedPrice = $(event.target).data('raw-price');

    $(event.target).val(formattedPrice);
  }

  onInputPaste(event) {
    if (isNaN(+event.originalEvent.clipboardData.getData('Text'))) {
      event.preventDefault();
    }
  }

  onDeliverySelect(event) {
    const selected = $(event.target).val();
    const optionClass = 'delivery-option';

    if (selected === 'none') {
      $($('.' + optionClass)).each((index, option) => {
        $(option).find('input, select').attr('disabled', 'disabled');
        $(option).css('display', 'none');
        $(event.target).find('option[value="#city"]').attr('disabled', 'disabled');
      });
    } else {
      $($('.' + optionClass)).each((index, option) => {
        $(option).find('input, select').removeAttr('disabled');
        $(option).css('display', 'none');
      });
      $(selected).show(200);
    }
  }

  onCountrySelect(event) {
    const selected = $(event.target).val();

    $('#delivery').find('option[value="#city"]').removeAttr('disabled');
    $('#city').find('.checkboxes').html(ProductModalTemplates.getCityTemplate(this.delivery[selected]));
  }

  onCitySelect() {
    const checkboxes = $('#city').find('input.city-input[type="checkbox"]:checked');

    const $field = $('#city').find('.city-main-input');

    if (checkboxes.length > 0) {
      $field.prop('checked', true);
    } else {
      $field.prop('checked', false);
    }

    this.validateField($field[0]);
  }

  validateFrom(event) {
    const $from = $($(event.target).data('form'));
    let isValid = true;

    if ($from.length === 0) return true;

    const requiredFields = $from.find('[required]:not([disabled])');

    requiredFields.each((index, field) => {
      if (!this.validateField(field)) isValid = false;
    });

    return isValid;
  }

  validateField(field) {
    let isValid = true;

    const $field = $(field);

    $field.removeClass(this.inValidClassName);
    $field.removeClass(this.validClassName);

    if (!field.checkValidity() || $field.val().trim() === '') {
      isValid = false;
      $field.addClass(this.inValidClassName);
    } else $field.addClass(this.validClassName);

    return isValid;
  }

  initHandlers() {
    this.$root.on('click', '[data-action="modal-close"]', this.closeModal.bind(this));
    this.$root.on('click', '[data-action="modal-submit"]', this.onSubmitModal.bind(this));
    this.$root.on('blur', 'input:not(.no-validate)', this.onFocusChange.bind(this));
    this.$root.on('paste', '[data-action="input-paste"]', this.onInputPaste);
    this.$root.on('blur', '[data-action="price-formatter"]', this.onPriceFocusOff.bind(this));
    this.$root.on('focus', '[data-action="price-formatter"]', this.onPriceFocus);
    this.$root.on('change', '[data-action="delivery-select"]', this.onDeliverySelect);
    this.$root.on('change', '[data-action="country-select"]', this.onCountrySelect.bind(this));
    this.$root.on('change', '[data-action="city-select"]', this.onCitySelect.bind(this));
  }
}
