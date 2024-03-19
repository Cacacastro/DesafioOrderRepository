import { Sequelize } from "sequelize-typescript";
import CustomerRepository from "../../../customer/repository/sequilize/customer.repository";
import CustomerModel from "../../../customer/repository/sequilize/customer.model";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import OrderModel from "./order.model";
import OrderItemModel from "./order-item.model";
import ProductModel from "../../../product/repository/sequilize/product.model";
import ProductRepository from "../../../product/repository/sequilize/product.repository";
import Product from "../../../../domain/product/entity/product";
import OrderItem from "../../../../domain/checkout/entity/orderItem";
import OrderRepository from "./order.repository";
import Order from "../../../../domain/checkout/entity/order";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });
  
  it("should create a new order", async() => {

      const customerRepository = new CustomerRepository();
      const customer = new Customer("123","Carlos Henrique");
      const address = new Address("Rua 1", 108, "19260000","Mirante");
      customer.changeAddress(address);
      await customerRepository.create(customer);

      const productRepository = new ProductRepository();
      const product = new Product("123", "Produto 1", 10);
      await productRepository.create(product);

      const orderItem = new OrderItem("1", product.name, product.price,product.id,2);
      const order = new Order("123","123",[orderItem]);
      const orderRepository = new OrderRepository();
      await orderRepository.create(order);

      const orderModel = await OrderModel.findOne({
        where: {id: order.id},
        include: ["items"], 
      });

      expect(orderModel.toJSON()).toStrictEqual({
        id: "123",
        customer_id: "123",
        total: order.total(),
        items: [
          {
            id: orderItem.id,
            name: orderItem.name,
            price: orderItem.price,
            quantity: orderItem.quantity,
            order_id: "123",
            product_id: "123"
          },
        ],
      });
  });

  it("should update a order", async () => {
      const customerRepository = new CustomerRepository();
      const customer = new Customer("123","Carlos Henrique");
      const address = new Address("Rua 1", 108, "19260000","Mirante");
      customer.changeAddress(address);
      await customerRepository.create(customer);

      const productRepository = new ProductRepository();
      const product = new Product("123", "Produto 1", 10);
      await productRepository.create(product);

      const orderItem = new OrderItem("1", product.name, product.price,product.id,2);
      let order = new Order("123","123",[orderItem]);
      const orderRepository = new OrderRepository();
      await orderRepository.create(order);

      const product2 = new Product("124", "Produto 4", 20);
      await productRepository.create(product2);
      const orderItem2 = new OrderItem("2", product2.name, product2.price,product2.id,4);
      order = new Order("123","123",[orderItem,orderItem2]);

      const customer2 = new Customer("124","Amarildo Carlos");
      const address2 = new Address("Rua 1", 108, "19260000","Mirante");
      customer2.changeAddress(address2);
      await customerRepository.create(customer2);

      await orderRepository.update(order);

      const orderModel = await OrderModel.findOne({
        where: {id: order.id},
        include: ["items"], 
      });
      
      expect(orderModel.toJSON()).toStrictEqual({
        id: "123",
        customer_id: "123",
        total: order.total(),
        items: [
          {
            id: orderItem.id,
            name: orderItem.name,
            price: orderItem.price,
            quantity: orderItem.quantity,
            order_id: "123",
            product_id: "123"
          },
          {
            id: orderItem2.id,
            name: orderItem2.name,
            price: orderItem2.price,
            quantity: orderItem2.quantity,
            order_id: "123",
            product_id: "124"
          }
        ],
      });
  });

  it("should find a order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123","Carlos Henrique");
    const address = new Address("Rua 1", 108, "19260000","Mirante");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Produto 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem("1", product.name, product.price,product.id,2);
    const order = new Order("123","123",[orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderResult = await orderRepository.find(order.id);

    expect(order).toStrictEqual(orderResult);
  });

  it("should throw an error when order is not found", async () => {
    const orderRepository = new OrderRepository();

    expect(async () => {
      await orderRepository.find("456ABC");
    }).rejects.toThrow("Order not found");
  });

  it("should find all orders", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123","Carlos Henrique");
    const address = new Address("Rua 1", 108, "19260000","Mirante");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Produto 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem("1", product.name, product.price,product.id,2);
    const order = new Order("123","123",[orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderItem2 = new OrderItem("2", product.name, product.price,product.id,10);
    const order2 = new Order("124","123",[orderItem2]);
    await orderRepository.create(order2);

    const orders = await orderRepository.findAll();

    expect(orders).toHaveLength(2);
    expect(orders).toContainEqual(order);
    expect(orders).toContainEqual(order2);
  });

});