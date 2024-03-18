import { Sequelize } from "sequelize-typescript";
import CustomerRepository from "./customer.repository";
import CustomerModel from "../db/sequelize/model/customer.model";
import Customer from "../../domain/entity/customer";
import Address from "../../domain/entity/address";
import OrderModel from "../db/sequelize/model/order.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import ProductModel from "../db/sequelize/model/product.model";
import ProductRepository from "./product.repository";
import Product from "../../domain/entity/product";
import OrderItem from "../../domain/entity/orderItem";
import OrderRepository from "./order.repository";
import Order from "../../domain/entity/order";

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
      const order = new Order("123","123",[orderItem]);
      const orderRepository = new OrderRepository();
      await orderRepository.create(order);

      const customer2 = new Customer("124","Amarildo Carlos");
      const address2 = new Address("Rua 1", 108, "19260000","Mirante");
      customer2.changeAddress(address2);
      await customerRepository.create(customer2);

      order.changeCustomer("124");

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