export type Status = "Active" | "Inactive" | "Blocked";
export type BuyerRole = "Customer" | "Dealer";
export type OrderStatus = "Pending" | "Confirmed" | "Packed" | "Shipped" | "Delivered" | "Cancelled";
export type ServiceStatus = "New" | "Assigned" | "In Progress" | "Completed" | "Cancelled";
export type CouponManualStatus = "Active" | "Inactive";
export type CouponProductScope = "All Products" | "Selected Products";
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
  status: Status;
  createdDate: string;
};

export type Customer = {
  id: string;
  fullName: string;
  mobile: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  status: Status;
  createdDate: string;
};

export type Subcategory = {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  productsCount: number;
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
  subcategories?: Subcategory[];
  status: Extract<Status, "Active" | "Inactive">;
  createdDate: string;
};

export type Banner = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  themeColor: string;
  glowColor: string;
  sortOrder: number;
  status: Extract<Status, "Active" | "Inactive">;
  createdDate: string;
};

export type Coupon = {
  id: string;
  code: string;
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  discountType: DiscountType;
  discountValue: number;
  minimumOrderAmount: number;
  maximumDiscountAmount?: number;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  usageLimit: number;
  sortOrder: number;
  manualStatus: CouponManualStatus;
  applicableProductIds: string[];
  applicableProducts?: { id: string; name: string; sku?: string }[];
  createdDate: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  categoryId?: string;
  subcategory?: string;
  subcategoryId?: string;
  images: string[];
  customerSellingPrice: number;
  dealerSellingPrice: number;
  customerOriginalPrice: number;
  dealerOriginalPrice: number;
  rating: number;
  reviewCount: number;
  sortOrder: number;
  description: string;
  status: Extract<Status, "Active" | "Inactive">;
  createdDate: string;
  updatedDate?: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  buyerName: string;
  buyerMobile: string;
  buyerEmail: string;
  role: BuyerRole;
  items: number;
  firstProductName: string;
  firstProductImage: string;
  amount: number;
  payment: "Paid" | "Partial" | "Pending" | "Failed";
  status: OrderStatus;
  date: string;
  subtotalAmount: number;
  discountAmount: number;
  shippingAmount: number;
  paymentMethod?: "Online" | "COD";
  paymentType?: "Full Payment" | "Advance Payment";
  advanceAmount?: number;
  paidAmount?: number;
  balanceAmount?: number;
  shippingAddress?: {
    fullName: string;
    mobile: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  products: {
    id: string;
    productId: string;
    productName: string;
    productSku: string;
    productSlug?: string;
    imageUrl: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }[];
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

export type Testimonial = {
  id: string;
  customerName: string;
  role: string;
  rating: number;
  message: string;
  imageUrl: string;
  sortOrder: number;
  status: Status;
  createdDate: string;
};

export type Review = {
  id: string;
  userId: string;
  customerName: string;
  role: BuyerRole;
  rating: number;
  message: string;
  status: "Visible" | "Hidden";
  createdDate: string;
};


export type PolicyPage = {
  slug: string;
  title: string;
  description: string;
  sections: { title: string; body: string }[];
  status: Extract<Status, "Active" | "Inactive">;
};
export type SiteSettings = {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  facebook: string;
  instagram: string;
  youtube: string;
  linkedin: string;
  x: string;
  trainingAmount: number;
  orderAdvanceAmount: number;
  trainingImages: string[];
  trainingVideos: string[];
};

export type ContactMessage = {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  subject: string;
  message: string;
  status: "New" | "Read" | "Replied";
  createdDate: string;
};
export type TrainingEnquiry = {
  id: string;
  enquiryNumber: string;
  fullName: string;
  mobile: string;
  city: string;
  message: string;
  actionType: "Interested" | "Payment";
  amount: number;
  paymentStatus: "Not Required" | "Pending" | "Paid" | "Failed";
  createdDate: string;
};