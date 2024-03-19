import Address from "../value-object/address";
import CustomerFactory from "./customer.factory";

describe("Customer factory unit test", ()=>{

    it("should create a customer", ()=>{
        let customer = CustomerFactory.create("John");

        expect(customer.id).toBeDefined();
        expect(customer.name).toBe("John");
        expect(customer.address).toBeUndefined();
    });

    it("should create a customer with an address", ()=>{

        const address = new Address("Rua 1", 108, "19260000", "Mirante");
        let customer = CustomerFactory.createWithAddress("Carlos",address);

        expect(customer.id).toBeDefined();
        expect(customer.name).toBe("Carlos");
        expect(customer.address).toBe(address);
    });

});