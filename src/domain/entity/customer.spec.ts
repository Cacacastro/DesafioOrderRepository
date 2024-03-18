import Address from "./address";
import Customer from "./customer";

describe("Customer unit tests", () =>{
    it("should throw error when id is empty", () =>{

        expect(() => {
            let customer = new Customer("", "John");
        }).toThrowError("Id is required");
    });

    it("should throw error when name is empty", () =>{

        expect(() => {
            let customer = new Customer("123", "");
        }).toThrowError("Name is required");
    });

    it("should change name", () =>{

        const customer = new Customer("123","John");
        customer.changeName("Jane");

        expect(customer.name).toBe("Jane");
    });

    it("should activate customer", () =>{

        const customer = new Customer("123","John");
        const address = new Address("Rua 1",123,"12345-000","Presidente Prudente");
        customer.Address = address;

        customer.activate();
        expect(customer.isActive()).toBe(true);
    });

    it("should deactivate customer", () =>{

        const customer = new Customer("123","John");

        customer.deactivate();

        expect(customer.isActive()).toBe(false);
    });

    it("should throw error when address is undefined when you activate a customer", () =>{

        expect(() => {
            const customer = new Customer("123","John");
            customer.activate();
        }).toThrowError("Address is mandatory to activate a customer");
    });

    it("should add reward points", () =>{

        const customer = new Customer("123","John");
        expect(customer.rewardPoints).toBe(0);

        customer.addRewardPoints(100);
        expect(customer.rewardPoints).toBe(100);

        customer.addRewardPoints(50);
        expect(customer.rewardPoints).toBe(150);
    });
});