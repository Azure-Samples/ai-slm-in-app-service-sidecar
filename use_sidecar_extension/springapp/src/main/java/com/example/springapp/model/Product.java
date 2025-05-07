package com.example.springapp.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class Product {
    private int id;
    private String name;
    private String description;

    // Static list of products similar to the .NET app
    private static final List<Product> products = new ArrayList<>();

    static {
        products.add(createProduct(3, "Navy Single-Breasted Slim Fit Formal Blazer", 
                "This navy single-breasted slim fit formal blazer is made from a blend of polyester and viscose. It features a notched lapel, a chest welt pocket, two flap pockets, a front button fastening, long sleeves, button cuffs, a double vent to the rear, and a full lining."));
        products.add(createProduct(111, "White & Navy Blue Slim Fit Printed Casual Shirt", 
                "White and navy blue printed casual shirt, has a spread collar, short sleeves, button placket, curved hem, one patch pocket"));
        products.add(createProduct(116, "Red Slim Fit Checked Casual Shirt", 
                "Red checked casual shirt, has a spread collar, long sleeves, button placket, curved hem, one patch pocket"));
        products.add(createProduct(10, "Navy Blue Washed Denim Jacket", 
                "Navy Blue washed denim jacket, has a spread collar, 4 pockets, button closure, long sleeves, straight hem, and unlined"));
    }

    private static Product createProduct(int id, String name, String description) {
        Product product = new Product();
        product.setId(id);
        product.setName(name);
        product.setDescription(description);
        return product;
    }

    public static List<Product> getAllProducts() {
        return products;
    }

    public static Optional<Product> getProductById(int id) {
        return products.stream()
                .filter(p -> p.getId() == id)
                .findFirst();
    }
        
    // Getters and setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}