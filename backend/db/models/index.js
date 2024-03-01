const { CartItem } = require('./cart_item.model');
const { Discount } = require('./discount.model');
const { Feedback } = require('./feedback.model');
const { GameStats } = require('./game_stats.model');
const { OrderDetails } = require('./order_details.model');
const { OrderItems } = require('./order_items.model');
const { PaymentDetails } = require('./payment_details.model');
const { ProductCategory } = require('./product_category.model');
const { ProductInventory } = require('./product_inventory.model');
const { Product } = require('./product.model');
const { Session } = require('./session.model');
const { UserAddress } = require('./user_address.model');
const { UserPayment } = require('./user_payment.model');
const { User } = require('./user.model');
const { WishList } = require('./wishlist.model');

module.exports = {
    CartItem,
    Discount,
    Feedback,
    GameStats,
    OrderDetails,
    OrderItems,
    PaymentDetails,
    ProductCategory,
    ProductInventory,
    Product,
    Session,
    UserAddress,
    UserPayment,
    User,
    WishList
}