from typing import List, Optional
from pydantic import BaseModel


class Product(BaseModel):
    id: int
    name: str
    description: str
    
    @staticmethod
    def get_all_products() -> List["Product"]:
        return [
            Product(
                id=3, 
                name="Navy Single-Breasted Slim Fit Formal Blazer", 
                description="This navy single-breasted slim fit formal blazer is made from a blend of polyester and viscose. It features a notched lapel, a chest welt pocket, two flap pockets, a front button fastening, long sleeves, button cuffs, a double vent to the rear, and a full lining."
            ),
            Product(
                id=111, 
                name="White & Navy Blue Slim Fit Printed Casual Shirt", 
                description="White and navy blue printed casual shirt, has a spread collar, short sleeves, button placket, curved hem, one patch pocket"
            ),
            Product(
                id=116, 
                name="Red Slim Fit Checked Casual Shirt", 
                description="Red checked casual shirt, has a spread collar, long sleeves, button placket, curved hem, one patch pocket"
            ),
            Product(
                id=10, 
                name="Navy Blue Washed Denim Jacket", 
                description="Navy Blue washed denim jacket, has a spread collar, 4 pockets, button closure, long sleeves, straight hem, and unlined"
            ),
        ]
    
    @staticmethod
    def get_product_by_id(product_id: int) -> Optional["Product"]:
        for product in Product.get_all_products():
            if product.id == product_id:
                return product
        return None