import ProductTableController from "./controllers/ProductTableController";
import "../scss/style.scss";

window.onload = function() {
  const productTableController = new ProductTableController();

  productTableController.init();
};
