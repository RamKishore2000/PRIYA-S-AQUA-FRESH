import type { Banner, Category, Coupon, Customer, Dealer, Order, OrderStatus, Product, ServiceRequest, Status, Testimonial } from "@/types/admin";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
};

type ApiCategory = {
  id: number;
  name: string;
  slug: string;
  imageUrl: string | null;
  description: string | null;
  status: "ACTIVE" | "INACTIVE";
  productsCount: number;
  createdAt: string;
};

type ApiBanner = {
  id: number;
  title: string;
  subtitle: string | null;
  description: string | null;
  imageUrl: string;
  buttonText: string | null;
  buttonLink: string | null;
  themeColor: string | null;
  glowColor: string | null;
  sortOrder: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
};

type ApiProduct = {
  id: number;
  name: string;
  slug: string;
  sku: string;
  description: string;
  rating: number;
  reviewCount: number;
  status: "ACTIVE" | "INACTIVE";
  category: { id: number; name: string; slug: string };
  prices: {
    customerOriginalPrice: number;
    customerSellingPrice: number;
    dealerOriginalPrice: number;
    dealerSellingPrice: number;
  };
  images: { imageUrl: string }[];
  createdAt: string;
  updatedAt?: string;
};

type ApiDealer = {
  id: number;
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
  status: "ACTIVE" | "INACTIVE" | "BLOCKED";
  createdAt: string;
};

type ApiCustomer = {
  id: number;
  fullName: string;
  mobile: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  status: "ACTIVE" | "INACTIVE" | "BLOCKED";
  createdAt: string;
};

type ApiCoupon = {
  id: number;
  code: string;
  discountType: "PERCENTAGE" | "FLAT_AMOUNT";
  discountValue: number;
  minimumOrderAmount: number;
  maximumDiscountAmount: number | null;
  startAt: string;
  endAt: string;
  usageLimit: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
};

type ApiServiceRequest = {
  id: number;
  customerName: string;
  mobile: string;
  email: string | null;
  serviceType: string;
  address: string;
  city: string;
  preferredDate: string | null;
  problem: string;
  status: "NEW" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  createdAt: string;
};

type ApiTestimonial = {
  id: number;
  customerName: string;
  role: string | null;
  rating: number;
  message: string;
  imageUrl: string | null;
  sortOrder: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
};

type ApiOrder = {
  id: number;
  orderNumber: string;
  subtotalAmount: number;
  discountAmount: number;
  shippingAmount: number;
  totalAmount: number;
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  orderStatus: "PENDING" | "CONFIRMED" | "PACKED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  customer: {
    id: number;
    fullName: string;
    mobile: string;
    email: string;
    role: "CUSTOMER" | "DEALER" | "ADMIN";
  } | null;
  shippingAddress?: Order["shippingAddress"];
  createdAt: string;
  items: {
    id: number;
    productId: number;
    productName: string;
    productSku: string;
    productSlug?: string;
    imageUrl?: string | null;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }[];
};

export async function apiRequest<T>(path: string, init?: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  const result = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !result.success) {
    const error = new Error(result.message || "API request failed.") as Error & { fieldErrors?: Record<string, string> };
    error.fieldErrors = result.errors;
    throw error;
  }
  return result.data as T;
}

export async function uploadImage(file: File, folder: string, width?: number, height?: number) {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("folder", folder);
  if (width) formData.append("width", String(width));
  if (height) formData.append("height", String(height));

  const response = await fetch(`${API_BASE_URL}/api/uploads/images`, {
    method: "POST",
    body: formData,
  });
  const result = (await response.json()) as ApiResponse<{ image: { url: string } }>;
  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.message || "Image upload failed.");
  }
  return `${API_BASE_URL}${result.data.image.url}`;
}

export const adminApi = {
  async getDashboard() {
    return apiRequest<{ stats: { totalUsers: number; totalDealers: number; totalOrders: number; totalServices: number; activeProducts: number; totalRevenue: number } }>("/api/dashboard");
  },
  async listCategories() {
    const data = await apiRequest<{ categories: ApiCategory[] }>("/api/categories?includeInactive=true");
    return data.categories.map(mapCategory);
  },
  async createCategory(category: Category) {
    const data = await apiRequest<{ category: ApiCategory }>("/api/categories", {
      method: "POST",
      body: JSON.stringify(toCategoryPayload(category)),
    });
    return mapCategory(data.category);
  },
  async updateCategory(category: Category) {
    const data = await apiRequest<{ category: ApiCategory }>(`/api/categories/${category.id}`, {
      method: "PUT",
      body: JSON.stringify(toCategoryPayload(category)),
    });
    return mapCategory(data.category);
  },
  async deleteCategory(id: string) {
    await apiRequest(`/api/categories/${id}`, { method: "DELETE" });
  },
  async listBanners() {
    const data = await apiRequest<{ banners: ApiBanner[] }>("/api/banners?includeInactive=true");
    return data.banners.map(mapBanner);
  },
  async createBanner(banner: Banner) {
    const data = await apiRequest<{ banner: ApiBanner }>("/api/banners", {
      method: "POST",
      body: JSON.stringify(toBannerPayload(banner)),
    });
    return mapBanner(data.banner);
  },
  async updateBanner(banner: Banner) {
    const data = await apiRequest<{ banner: ApiBanner }>(`/api/banners/${banner.id}`, {
      method: "PUT",
      body: JSON.stringify(toBannerPayload(banner)),
    });
    return mapBanner(data.banner);
  },
  async setBannerStatus(id: string, status: "ACTIVE" | "INACTIVE") {
    const data = await apiRequest<{ banner: ApiBanner }>(`/api/banners/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    return mapBanner(data.banner);
  },
  async deleteBanner(id: string) {
    await apiRequest(`/api/banners/${id}`, { method: "DELETE" });
  },
  async listProducts() {
    const data = await apiRequest<{ products: ApiProduct[] }>("/api/products?includeInactive=true");
    return data.products.map(mapProduct);
  },
  async createProduct(product: Product) {
    const data = await apiRequest<{ product: ApiProduct }>("/api/products", {
      method: "POST",
      body: JSON.stringify(toProductPayload(product)),
    });
    return mapProduct(data.product);
  },
  async getProduct(id: string) {
    const data = await apiRequest<{ product: ApiProduct }>(`/api/products/${id}`);
    return mapProduct(data.product);
  },
  async updateProduct(product: Product) {
    const data = await apiRequest<{ product: ApiProduct }>(`/api/products/${product.id}`, {
      method: "PUT",
      body: JSON.stringify(toProductPayload(product)),
    });
    return mapProduct(data.product);
  },
  async deleteProduct(id: string) {
    await apiRequest(`/api/products/${id}`, { method: "DELETE" });
  },
  async listDealers() {
    const data = await apiRequest<{ dealers: ApiDealer[] }>("/api/dealers");
    return data.dealers.map(mapDealer);
  },
  async getDealer(id: string) {
    const data = await apiRequest<{ dealer: ApiDealer }>(`/api/dealers/${id}`);
    return mapDealer(data.dealer);
  },
  async createDealer(payload: unknown) {
    const data = await apiRequest<{ dealer: ApiDealer }>("/api/dealers", { method: "POST", body: JSON.stringify(payload) });
    return mapDealer(data.dealer);
  },
  async updateDealer(id: string, payload: unknown) {
    const data = await apiRequest<{ dealer: ApiDealer }>(`/api/dealers/${id}`, { method: "PUT", body: JSON.stringify(payload) });
    return mapDealer(data.dealer);
  },
  async setDealerStatus(id: string, status: "ACTIVE" | "INACTIVE") {
    const data = await apiRequest<{ dealer: ApiDealer }>(`/api/dealers/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
    return mapDealer(data.dealer);
  },
  async resetDealerPassword(id: string, password: string, confirmPassword: string) {
    await apiRequest(`/api/dealers/${id}/password`, { method: "PATCH", body: JSON.stringify({ password, confirmPassword }) });
  },
  async listCustomers() {
    const data = await apiRequest<{ customers: ApiCustomer[] }>("/api/customers");
    return data.customers.map(mapCustomer);
  },
  async setCustomerStatus(id: string, status: "ACTIVE" | "INACTIVE" | "BLOCKED") {
    const data = await apiRequest<{ customer: ApiCustomer }>(`/api/customers/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    return mapCustomer(data.customer);
  },
  async listCoupons() {
    const data = await apiRequest<{ coupons: ApiCoupon[] }>("/api/coupons");
    return data.coupons.map(mapCoupon);
  },
  async createCoupon(coupon: Coupon) {
    const data = await apiRequest<{ coupon: ApiCoupon }>("/api/coupons", { method: "POST", body: JSON.stringify(toCouponPayload(coupon)) });
    return mapCoupon(data.coupon);
  },
  async updateCoupon(coupon: Coupon) {
    const data = await apiRequest<{ coupon: ApiCoupon }>(`/api/coupons/${coupon.id}`, { method: "PUT", body: JSON.stringify(toCouponPayload(coupon)) });
    return mapCoupon(data.coupon);
  },
  async setCouponStatus(id: string, status: "ACTIVE" | "INACTIVE") {
    const data = await apiRequest<{ coupon: ApiCoupon }>(`/api/coupons/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
    return mapCoupon(data.coupon);
  },
  async deleteCoupon(id: string) {
    await apiRequest(`/api/coupons/${id}`, { method: "DELETE" });
  },
  async listServiceRequests() {
    const data = await apiRequest<{ serviceRequests: ApiServiceRequest[] }>("/api/service-requests");
    return data.serviceRequests.map(mapServiceRequest);
  },
  async updateServiceRequestStatus(id: string, status: ApiServiceRequest["status"], technicianName?: string) {
    const data = await apiRequest<{ serviceRequest: ApiServiceRequest }>(`/api/service-requests/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, technicianName }),
    });
    return mapServiceRequest(data.serviceRequest);
  },
  async listOrders() {
    const data = await apiRequest<{ orders: ApiOrder[] }>("/api/orders");
    return data.orders.map(mapOrder);
  },
  async getOrder(id: string) {
    const data = await apiRequest<{ order: ApiOrder }>(`/api/orders/${id}/admin`);
    return mapOrder(data.order);
  },
  async setOrderStatus(id: string, status: ApiOrder["orderStatus"]) {
    const data = await apiRequest<{ order: ApiOrder }>(`/api/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    return mapOrder(data.order);
  },
  async listTestimonials() {
    const data = await apiRequest<{ testimonials: ApiTestimonial[] }>("/api/testimonials?includeInactive=true");
    return data.testimonials.map(mapTestimonial);
  },
  async createTestimonial(testimonial: Testimonial) {
    const data = await apiRequest<{ testimonial: ApiTestimonial }>("/api/testimonials", {
      method: "POST",
      body: JSON.stringify(toTestimonialPayload(testimonial)),
    });
    return mapTestimonial(data.testimonial);
  },
  async updateTestimonial(testimonial: Testimonial) {
    const data = await apiRequest<{ testimonial: ApiTestimonial }>(`/api/testimonials/${testimonial.id}`, {
      method: "PUT",
      body: JSON.stringify(toTestimonialPayload(testimonial)),
    });
    return mapTestimonial(data.testimonial);
  },
  async setTestimonialStatus(id: string, status: "ACTIVE" | "INACTIVE") {
    const data = await apiRequest<{ testimonial: ApiTestimonial }>(`/api/testimonials/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    return mapTestimonial(data.testimonial);
  },
  async deleteTestimonial(id: string) {
    await apiRequest(`/api/testimonials/${id}`, { method: "DELETE" });
  },
};

function mapStatus(status: string): Status {
  if (status === "BLOCKED") return "Blocked";
  return status === "ACTIVE" ? "Active" : "Inactive";
}

function withApiUrl(url?: string | null) {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("/images")) return url;
  return `${API_BASE_URL}${url}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

function splitDateTime(value: string) {
  const date = new Date(value);
  return {
    date: date.toISOString().slice(0, 10),
    time: date.toTimeString().slice(0, 5),
  };
}

function mapCategory(category: ApiCategory): Category {
  return {
    id: String(category.id),
    name: category.name,
    slug: category.slug,
    image: category.imageUrl || "/file.svg",
    description: category.description || "",
    productsCount: category.productsCount,
    status: mapStatus(category.status),
    createdDate: formatDate(category.createdAt),
  };
}

function mapBanner(banner: ApiBanner): Banner {
  return {
    id: String(banner.id),
    title: banner.title,
    subtitle: banner.subtitle || "",
    description: banner.description || "",
    imageUrl: withApiUrl(banner.imageUrl),
    buttonText: banner.buttonText || "Explore Range",
    buttonLink: banner.buttonLink || "/products",
    themeColor: banner.themeColor || "#2dd4bf",
    glowColor: banner.glowColor || "rgba(45, 212, 191, 0.34)",
    sortOrder: Number(banner.sortOrder || 0),
    status: mapStatus(banner.status) as Banner["status"],
    createdDate: formatDate(banner.createdAt),
  };
}

function toBannerPayload(banner: Banner) {
  return {
    title: banner.title,
    subtitle: banner.subtitle,
    description: banner.description,
    imageUrl: banner.imageUrl,
    buttonText: banner.buttonText,
    buttonLink: banner.buttonLink,
    themeColor: banner.themeColor,
    glowColor: banner.glowColor,
    sortOrder: Number(banner.sortOrder || 0),
    status: banner.status === "Active" ? "ACTIVE" : "INACTIVE",
  };
}

function toCategoryPayload(category: Category) {
  return {
    name: category.name,
    imageUrl: category.image,
    description: category.description,
    status: category.status === "Active" ? "ACTIVE" : "INACTIVE",
  };
}

function mapProduct(product: ApiProduct): Product {
  return {
    id: String(product.id),
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    category: product.category.name,
    categoryId: String(product.category.id),
    images: product.images.map((image) => image.imageUrl),
    customerOriginalPrice: product.prices.customerOriginalPrice,
    customerSellingPrice: product.prices.customerSellingPrice,
    dealerOriginalPrice: product.prices.dealerOriginalPrice,
    dealerSellingPrice: product.prices.dealerSellingPrice,
    rating: Number(product.rating || 0),
    reviewCount: Number(product.reviewCount || 0),
    description: product.description,
    status: mapStatus(product.status),
    createdDate: formatDate(product.createdAt),
    updatedDate: product.updatedAt ? formatDate(product.updatedAt) : undefined,
  } as Product;
}

function toProductPayload(product: Product) {
  const payload: {
    categoryId: number;
    name: string;
    sku?: string;
    description: string;
    status: "ACTIVE" | "INACTIVE";
    customerOriginalPrice: number;
    customerSellingPrice: number;
    dealerOriginalPrice: number;
    dealerSellingPrice: number;
    rating: number;
    reviewCount: number;
    images: { imageUrl: string }[];
  } = {
    categoryId: Number((product as Product & { categoryId?: string }).categoryId),
    name: product.name,
    description: product.description,
    status: product.status === "Active" ? "ACTIVE" : "INACTIVE",
    customerOriginalPrice: product.customerOriginalPrice,
    customerSellingPrice: product.customerSellingPrice,
    dealerOriginalPrice: product.dealerOriginalPrice,
    dealerSellingPrice: product.dealerSellingPrice,
    rating: Number(product.rating || 0),
    reviewCount: Number(product.reviewCount || 0),
    images: product.images.map((imageUrl) => ({ imageUrl })),
  };
  if (product.sku?.trim()) {
    payload.sku = product.sku.trim();
  }
  return payload;
}

function mapDealer(dealer: ApiDealer): Dealer {
  return {
    id: String(dealer.id),
    name: dealer.name,
    dealerCode: dealer.dealerCode,
    mobile: dealer.mobile,
    email: dealer.email,
    businessName: dealer.businessName,
    gstNumber: dealer.gstNumber,
    address: dealer.address,
    city: dealer.city,
    state: dealer.state,
    pincode: dealer.pincode,
    totalOrders: dealer.totalOrders,
    totalPurchaseValue: dealer.totalPurchaseValue,
    status: mapStatus(dealer.status),
    createdDate: formatDate(dealer.createdAt),
  };
}

function mapCustomer(customer: ApiCustomer): Customer {
  return {
    id: String(customer.id),
    fullName: customer.fullName,
    mobile: customer.mobile,
    email: customer.email,
    totalOrders: Number(customer.totalOrders || 0),
    totalSpent: Number(customer.totalSpent || 0),
    status: mapStatus(customer.status),
    createdDate: formatDate(customer.createdAt),
  };
}

function mapCoupon(coupon: ApiCoupon): Coupon {
  const start = splitDateTime(coupon.startAt);
  const end = splitDateTime(coupon.endAt);
  return {
    id: String(coupon.id),
    code: coupon.code,
    discountType: coupon.discountType === "PERCENTAGE" ? "Percentage" : "Flat Amount",
    discountValue: coupon.discountValue,
    minimumOrderAmount: coupon.minimumOrderAmount,
    maximumDiscountAmount: coupon.maximumDiscountAmount || undefined,
    startDate: start.date,
    startTime: start.time,
    endDate: end.date,
    endTime: end.time,
    usageLimit: coupon.usageLimit,
    manualStatus: coupon.status === "ACTIVE" ? "Active" : "Inactive",
    createdDate: formatDate(coupon.createdAt),
  };
}

function toCouponPayload(coupon: Coupon) {
  return {
    code: coupon.code,
    discountType: coupon.discountType === "Percentage" ? "PERCENTAGE" : "FLAT_AMOUNT",
    discountValue: coupon.discountValue,
    minimumOrderAmount: coupon.minimumOrderAmount,
    maximumDiscountAmount: coupon.maximumDiscountAmount,
    startAt: `${coupon.startDate}T${coupon.startTime}:00`,
    endAt: `${coupon.endDate}T${coupon.endTime}:00`,
    usageLimit: coupon.usageLimit,
    status: coupon.manualStatus === "Active" ? "ACTIVE" : "INACTIVE",
  };
}

function mapServiceStatus(status: ApiServiceRequest["status"]): ServiceRequest["status"] {
  const statuses = {
    NEW: "New",
    ASSIGNED: "Assigned",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  } as const;
  return statuses[status];
}

function mapOrderStatus(status: ApiOrder["orderStatus"]): OrderStatus {
  const statuses = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    PACKED: "Packed",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
  } as const;
  return statuses[status];
}

export function mapOrderStatusToApi(status: OrderStatus): ApiOrder["orderStatus"] {
  const statuses = {
    Pending: "PENDING",
    Confirmed: "CONFIRMED",
    Packed: "PACKED",
    Shipped: "SHIPPED",
    Delivered: "DELIVERED",
    Cancelled: "CANCELLED",
  } as const;
  return statuses[status];
}

function mapPaymentStatus(status: ApiOrder["paymentStatus"]): Order["payment"] {
  if (status === "PAID") return "Paid";
  if (status === "FAILED") return "Failed";
  return "Pending";
}

function toApiServiceStatus(status: ServiceRequest["status"]): ApiServiceRequest["status"] {
  const statuses = {
    New: "NEW",
    Assigned: "ASSIGNED",
    "In Progress": "IN_PROGRESS",
    Completed: "COMPLETED",
    Cancelled: "CANCELLED",
  } as const;
  return statuses[status];
}

export function mapServiceStatusToApi(status: ServiceRequest["status"]) {
  return toApiServiceStatus(status);
}

function mapServiceRequest(request: ApiServiceRequest): ServiceRequest {
  return {
    id: String(request.id),
    customerName: request.customerName,
    phone: request.mobile,
    email: request.email || "",
    serviceType: request.serviceType,
    address: request.address,
    city: request.city,
    preferredDate: request.preferredDate ? formatDate(request.preferredDate) : "",
    problem: request.problem,
    status: mapServiceStatus(request.status),
    createdDate: formatDate(request.createdAt),
  };
}

function mapOrder(order: ApiOrder): Order {
  const firstItem = order.items[0];
  return {
    id: String(order.id),
    orderNumber: order.orderNumber,
    buyerName: order.customer?.fullName || order.shippingAddress?.fullName || "Customer",
    buyerMobile: order.customer?.mobile || order.shippingAddress?.mobile || "",
    buyerEmail: order.customer?.email || "",
    role: order.customer?.role === "DEALER" ? "Dealer" : "Customer",
    items: order.items.reduce((total, item) => total + Number(item.quantity || 0), 0),
    firstProductName: firstItem?.productName || "Order items",
    firstProductImage: withApiUrl(firstItem?.imageUrl),
    amount: Number(order.totalAmount || 0),
    payment: mapPaymentStatus(order.paymentStatus),
    status: mapOrderStatus(order.orderStatus),
    date: formatDate(order.createdAt),
    subtotalAmount: Number(order.subtotalAmount || 0),
    discountAmount: Number(order.discountAmount || 0),
    shippingAmount: Number(order.shippingAmount || 0),
    shippingAddress: order.shippingAddress,
    products: order.items.map((item) => ({
      id: String(item.id),
      productId: String(item.productId),
      productName: item.productName,
      productSku: item.productSku,
      productSlug: item.productSlug,
      imageUrl: withApiUrl(item.imageUrl),
      unitPrice: Number(item.unitPrice || 0),
      quantity: Number(item.quantity || 0),
      lineTotal: Number(item.lineTotal || 0),
    })),
  };
}

function mapTestimonial(testimonial: ApiTestimonial): Testimonial {
  return {
    id: String(testimonial.id),
    customerName: testimonial.customerName,
    role: testimonial.role || "",
    rating: Number(testimonial.rating || 0),
    message: testimonial.message,
    imageUrl: withApiUrl(testimonial.imageUrl),
    sortOrder: Number(testimonial.sortOrder || 0),
    status: mapStatus(testimonial.status),
    createdDate: formatDate(testimonial.createdAt),
  };
}

function toTestimonialPayload(testimonial: Testimonial) {
  return {
    customerName: testimonial.customerName,
    role: testimonial.role,
    rating: Number(testimonial.rating),
    message: testimonial.message,
    imageUrl: testimonial.imageUrl,
    sortOrder: Number(testimonial.sortOrder || 0),
    status: testimonial.status === "Active" ? "ACTIVE" : "INACTIVE",
  };
}
