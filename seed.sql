USE foodiehub_db;
INSERT INTO food_items (name,description,price,image_url,category,is_available) VALUES
('Burger','Juicy burger with fresh toppings',199,'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500','Fast Food',TRUE),
('Party Platter','A shareable selection of delicious bites',299,'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=500','Platters',TRUE),
('Noodles','Stir-fried noodles',179,'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500','Asian',TRUE),
('Fries','Golden crispy fries',99,'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=500','Sides',TRUE),
('Cappuccino','Freshly brewed cappuccino',149,'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500','Drinks',TRUE),
('Papdi Chaat','Crispy papdi chaat with chutneys',129,'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=500','Indian',TRUE),
('Cake','Rich celebration cake',249,'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500','Desserts',TRUE),
('Fondant Cookies','Decorated fondant cookies',159,'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=500','Desserts',TRUE),
('Healthy Meal Bowl','A fresh, balanced meal bowl',219,'https://images.unsplash.com/photo-1547592180-85f173990554?w=500','Healthy',TRUE),
('Caesar Salad','Crisp Caesar salad',189,'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500','Healthy',TRUE),
('Pizza','Freshly baked pizza',149,'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500','Fast Food',TRUE),
('Momos Platter','Steamed momos served with dip',129,'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=500','Asian',TRUE)
AS new_food
ON DUPLICATE KEY UPDATE
  description=new_food.description,
  price=new_food.price,
  image_url=new_food.image_url,
  category=new_food.category,
  is_available=new_food.is_available;
