import Order from "./order";
import OrderItem from "./orderItem";

describe("Order unit tests", () =>{

    it("should throw error when id is empty", () =>{
        expect(() => {
            let order = new Order("","123",[]);
        }).toThrowError("Id is required");
    });

    it("should throw error when CustomerId is empty", () =>{
        expect(() => {
            let order = new Order("123","",[]);
        }).toThrowError("CustomerId is required");
    });

    it("should throw error when items is empty", () =>{
        expect(() => {
            let order = new Order("123","123",[]);
        }).toThrowError("Items are required");
    }); 
    
    it("should calculate total", () =>{
        const item = new OrderItem("i1","Item 1", 100, "p1",1);
        const item2 = new OrderItem("i2","Item 2", 50, "p2",3);
        const order = new Order("1","1",[item,item2]);

        const total = order.total();

        expect(total).toBe(250);
    });

    it("should throw error if the item qte is less or equal 0", () =>{
        expect(() =>{
            const item = new OrderItem("i1","Item 1", 100, "p1",0);
            const order = new Order("1","1",[item]);
        }).toThrowError("Quantity must be greater than 0");
    });

    it("should throw error if the item not add", () =>{
        const item = new OrderItem("i1","Item 1", 100, "p1",2);
        const order = new Order("1","1",[item]);

        const item2 = new OrderItem("i2","Item 2", 100, "p2",3);
        order.AddItem(item2);

        expect((order.items)).toHaveLength(2);
        expect((order.items)).toContainEqual(item);
        expect((order.items)).toContainEqual(item2);
    });

    it("should change customer", () =>{
        const item = new OrderItem("i1","Item 1", 100, "p1",1);
        const order = new Order("1","1",[item]);

        order.changeCustomer("2");

        expect(order.customerId).toBe("2");
    });
});