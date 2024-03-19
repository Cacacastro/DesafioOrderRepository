import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerChangesAddress from "../customer-changes-address.event";

export default class SendNotifyWhenCustomerChangesAddress implements EventHandlerInterface<CustomerChangesAddress>{
    handle(event: CustomerChangesAddress): void {
        console.log("Endereço do cliente: " + event.eventData.id + ", " + event.eventData.name +  " alterado para: " + event.eventData.address);
    }
}