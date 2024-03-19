import Customer from "../../customer/entity/customer";
import Order from "../entity/order";
import OrderItem from "../entity/orderItem";
import OrderService from "./order.service";

describe("Order service unit tests", () =>{

    it("should place an order", () => {

        const customer1 = new Customer("c1", "Carlos Henrique");
        const item1 = new OrderItem("i1", "Item 1", 100, "p1", 2);

        const order = OrderService.placeOrder(customer1, [item1]);

        expect(customer1.rewardPoints).toBe(100);
        expect(order.total()).toBe(200);

    });

    it("should get total of all orders", () => {

        const item1 = new OrderItem("i1","Item 1", 100, "p1", 1);
        const item2 = new OrderItem("i2","Item 2", 200, "p2", 2);

        const order1 = new Order("o1","c1",[item1]);
        const order2 = new Order("o2","c1",[item2]);

        const total = OrderService.total([order1,order2]);

        expect(total).toBe(500);

    });

});