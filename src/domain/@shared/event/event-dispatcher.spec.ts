import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import SendNotifyWhenCustomerIsCreatedHandler from "../../customer/event/handler/send-notify-when-customer-is-created.handler";
import SendEmailWhenCustomerIsCreatedHandler from "../../customer/event/handler/send-email-when-customer-is-created.handler";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from "./event-dispatcher";
import Customer from "../../customer/entity/customer";
import Address from "../../customer/value-object/address";
import SendNotifyWhenCustomerChangesAddress from "../../customer/event/handler/send-notify-when-address-changes.event";

describe("Domain events tests", () =>{

    it("should register an event handler", ()=>{
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent",eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
    });

    it("should unregister as event handler", () =>{
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent",eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        eventDispatcher.unregister("ProductCreatedEvent",eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(0);
    })

    it("should unregister all events handlers", () =>{
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent",eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        eventDispatcher.unregisterAll();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeUndefined();
    })

    it("should notify all events handlers", () =>{
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        const spyEvenyHandler = jest.spyOn(eventHandler,"handle");

        eventDispatcher.register("ProductCreatedEvent",eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        const productCreatedEvent = new ProductCreatedEvent({
            name: "Product 1",
            description: "Product 1 description",
            price: 10,
        });

        eventDispatcher.notify(productCreatedEvent);

        expect(spyEvenyHandler).toHaveBeenCalled();
    })

    it("should notify an a customer created", () =>{
        const customer = new Customer("1","Carlos Henrique");
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenCustomerIsCreatedHandler();
        const eventHandler2 = new SendNotifyWhenCustomerIsCreatedHandler();

        const spyEvenyHandler = jest.spyOn(eventHandler,"handle");
        const spyEvenyHandler2 = jest.spyOn(eventHandler2,"handle");

        eventDispatcher.register("CustomerCreatedEvent",eventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler);

        eventDispatcher.register("CustomerCreatedEvent",eventHandler2);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandler2);

        const customerCreatedEvent = new CustomerCreatedEvent({
            id: customer.id,
            name: customer.name,
        });

        eventDispatcher.notify(customerCreatedEvent);

        expect(spyEvenyHandler).toHaveBeenCalled();
        expect(spyEvenyHandler2).toHaveBeenCalled();
    })

    it("should notify when address changes", () =>{
        const customer = new Customer("1","Carlos Henrique");
        const address = new Address("Rua 1", 1000, "19260000", "Mirante do Paranapanema")

        customer.changeAddress(address);

        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendNotifyWhenCustomerChangesAddress();

        const spyEvenyHandler = jest.spyOn(eventHandler,"handle");

        eventDispatcher.register("CustomerCreatedEvent",eventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler);

        const customerCreatedEvent = new CustomerCreatedEvent({
            id: customer.id,
            name: customer.name,
            address: customer.Address.street + " Nº: " + customer.Address.number + " CEP: " + customer.Address.zip + " - " + customer.Address.city
        });

        eventDispatcher.notify(customerCreatedEvent);

        expect(spyEvenyHandler).toHaveBeenCalled();
    })
});