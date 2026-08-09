export type Status = "Active" | "Inactive";
export type BuyerRole = "Customer" | "Dealer";
export type OrderStatus = "Pending" | "Confirmed" | "Packed" | "Shipped" | "Delivered" | "Cancelled";
export type ServiceStatus = "New" | "Assigned" | "In Progress" | "Completed" | "Cancelled";
export type CouponManualStatus = "Active" | "Inactive";
export type CouponComputedStatus = "Active" | "Inactive" | "Upcoming" | "Expired";
export type DiscountType = "Percentage" | "Flat Amount";

export type Dealer = {
  id: string;
  name: string;
  dealerCode: string;
  mobile: string;
  email: string;
  businessName: string;
  gstNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  totalOrders: number;
  totalPurchaseValue: number;
  status: Extract<Status, "Active" | "Inactive">;
  createdDate: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  productsCount: number;
  status: Extract<Status, "Active" | "Inactive">;
  createdDate: string;
};

export type Coupon = {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minimumOrderAmount: number;
  maximumDiscountAmount?: number;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  usageLimit: number;
  manualStatus: CouponManualStatus;
  createdDate: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  images: string[];
  customerSellingPrice: number;
  dealerSellingPrice: number;
  customerOriginalPrice: number;
  dealerOriginalPrice: number;
  description: string;
  status: Status;
  createdDate: string;
  updatedDate?: string;
};

export type Order = {
  id: string;
  buyerName: string;
  role: BuyerRole;
  items: number;
  amount: number;
  payment: "Paid" | "Pending" | "Failed";
  status: OrderStatus;
  date: string;
};

export type ServiceRequest = {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  serviceType: string;
  address: string;
  city: string;
  preferredDate: string;
  problem: string;
  status: ServiceStatus;
  createdDate: string;
};
