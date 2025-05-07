/**
 * Product model representing fashion items
 */
class Product {
  constructor(id, name, description) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  /**
   * Get all available products
   * @returns {Array} List of all products
   */
  static getAllProducts() {
    return [
      new Product(
        3, 
        "Navy Single-Breasted Slim Fit Formal Blazer", 
        "This navy single-breasted slim fit formal blazer is made from a blend of polyester and viscose. It features a notched lapel, a chest welt pocket, two flap pockets, a front button fastening, long sleeves, button cuffs, a double vent to the rear, and a full lining."
      ),
      new Product(
        111, 
        "White & Navy Blue Slim Fit Printed Casual Shirt", 
        "White and navy blue printed casual shirt, has a spread collar, short sleeves, button placket, curved hem, one patch pocket"
      ),
      new Product(
        116, 
        "Red Slim Fit Checked Casual Shirt", 
        "Red checked casual shirt, has a spread collar, long sleeves, button placket, curved hem, one patch pocket"
      ),
      new Product(
        10, 
        "Navy Blue Washed Denim Jacket", 
        "Navy Blue washed denim jacket, has a spread collar, 4 pockets, button closure, long sleeves, straight hem, and unlined"
      ),
    ];
  }

  /**
   * Get a product by its ID
   * @param {number} productId - The ID of the product to find
   * @returns {Product|null} - The found product or null if not found
   */
  static getProductById(productId) {
    return this.getAllProducts().find(product => product.id === productId) || null;
  }
}

module.exports = Product;