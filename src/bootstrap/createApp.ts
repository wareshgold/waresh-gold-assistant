import type { GetProductUseCase } from "../application/catalog/GetProductUseCase";
import type { UpdateOrderStatusUseCase } from "../application/catalog/UpdateOrderStatusUseCase";

interface AppContainer {
  telegramWebhookController: TelegramWebhookController;
  systemMetricsController: SystemMetricsController;
  monitoringService: SystemMonitoringService;
  healthCheckService: HealthCheckService;
  calculateGoldPriceUseCase: CalculateGoldPriceUseCase;
  createOrderQuoteUseCase: CreateOrderQuoteUseCase;
  getOrderQuoteUseCase: GetOrderQuoteUseCase;
  createOrderFromQuoteUseCase: CreateOrderFromQuoteUseCase;
  getOrderUseCase: GetOrderUseCase;
  listCustomerOrdersUseCase: ListCustomerOrdersUseCase;
  listAdminOrdersUseCase: ListAdminOrdersUseCase;
  updateOrderStatusUseCase: UpdateOrderStatusUseCase;
  verifyPaymentUseCase: VerifyPaymentUseCase;
  marketProvider: MarketPriceProvider;
  snapshotService: MarketSnapshotService;
  getGoldBubbleDataUseCase: GetGoldBubbleDataUseCase;
  registerCustomerUseCase: RegisterCustomerUseCase;
  loginCustomerUseCase: LoginCustomerUseCase;
  addCustomerAddressUseCase: AddCustomerAddressUseCase;
  removeCustomerAddressUseCase: RemoveCustomerAddressUseCase;
  customerRepository: CustomerRepository;
  sessionService: SessionService;
  getProductsUseCase: GetProductsUseCase;
  getProductUseCase: GetProductUseCase;
  adminApiToken?: string;
}

const jsonBody = async (c: any): Promise<Record<string, unknown> | null> => {
  const body = await c.req.json().catch(() => null);
  return body && typeof body === "object" && !Array.isArray(body) ? body as Record<string, unknown> : null;
};

const publicCustomer = (customer: any) => ({
  customerId: customer.customerId,
  customerNumber: customer.customerNumber,
  username: customer.username,
  phone: customer.phone,
  nationalId: customer.nationalId,
  firstName: customer.firstName,
  lastName: customer.lastName,
  addresses: customer.addresses,
});
