import Address from "./domain/customer/value-object/address";
import Order from "./domain/checkout/entity/order";
import OrderItem from "./domain/checkout/entity/orderItem";
import Customer from "./domain/customer/entity/customer";

let customer = new Customer("123","Carlos Henrique");
let address = new Address("Rua Dep. Fernando Ferrari",245,"19013730","Presidente Prudente");
customer.Address = address;
customer.activate();


// const item1 = new OrderItem("1", "Item 1", 10,);
// const item2 = new OrderItem("2", "Item 2", 20);
// const order = new Order("1","123",[item1, item2]);
