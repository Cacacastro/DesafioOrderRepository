import Customer from "../entity/customer";
import Order from "../entity/order";
import RepositoryInterface from "./repository-interface";

export default interface OrderRepositoryInterface extends RepositoryInterface<Order>{}