import type { AboutAward, Banner, Category, Coupon, Customer, Dealer, Order, OrderStatus, Product, Subcategory, ContactMessage, PolicyPage, Review, ServiceRequest, SiteSettings, Status, Testimonial, TrainingEnquiry } from "@/types/admin";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

type ProductPayload = Omit<Product, "id" | "createdDate" | "updatedDate"> & {
  id?: string;
  categoryId?: string;
  subcategoryId?: string;
};

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
  subcategories?: ApiSubcategory[];
  createdAt: string;
};


type ApiSubcategory = {
  id: number;
  categoryId: number;
  category?: { id: number; name: string; slug: string };
  name: string;
  slug: string;
  imageUrl: string | null;
  description: string | null;
  status: "ACTIVE" | "INACTIVE";
  productsCount: number;
  createdAt: string;
};

type ApiAboutAward = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
  status: "ACTIVE" | "INACTIVE";
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
  sortOrder: number;
  status: "ACTIVE" | "INACTIVE";
  category: { id: number; name: string; slug: string };
  subcategory?: { id: number; name: string; slug: string } | null;
  prices: {
    customerOriginalPrice: number;
    customerSellingPrice: number;
    dealerOriginalPrice: number;
    dealerSellingPrice: number;
  };
  images: { imageUrl: string; colorName?: string | null; colorCode?: string | null; isPrimary?: boolean }[];
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
  title: string | null;
  subtitle: string | null;
  imageUrl: string | null;
  discountType: "PERCENTAGE" | "FLAT_AMOUNT";
  discountValue: number;
  minimumOrderAmount: number;
  maximumDiscountAmount: number | null;
  startAt?: string;
  endAt?: string;
  start_at?: string;
  end_at?: string;
  usageLimit: number;
  sortOrder: number;
  status: "ACTIVE" | "INACTIVE";
  applicableProductIds?: number[];
  applicableProducts?: { id: number; name: string; sku?: string }[];
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


type ApiSiteSettings = SiteSettings;

type ApiPolicyPage = {
  slug: string;
  title: string;
  description: string;
  sections: { title: string; body: string }[] | string;
  status: "ACTIVE" | "INACTIVE";
};

type ApiContactMessage = {
  id: number;
  full_name?: string;
  fullName?: string;
  email: string | null;
  mobile: string | null;
  subject: string | null;
  message: string;
  status: "NEW" | "READ" | "REPLIED";
  created_at?: string;
  createdAt?: string;
};
type ApiTrainingEnquiry = {
  id: number;
  enquiryNumber: string;
  fullName: string;
  mobile: string;
  city: string;
  message: string | null;
  actionType: "INTERESTED" | "PAYMENT";
  amount: number;
  paymentStatus: "NOT_REQUIRED" | "PENDING" | "PAID" | "FAILED";
  createdAt: string;
};

type ApiReview = {
  id: number;
  userId: number;
  customerName: string;
  role: "CUSTOMER" | "DEALER";
  rating: number;
  message: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "VISIBLE" | "HIDDEN";
  createdAt: string;
};

type ApiOrder = {
  id: number;
  orderNumber: string;
  subtotalAmount: number;
  discountAmount: number;
  shippingAmount: number;
  totalAmount: number;
  paymentStatus: "PENDING" | "PARTIAL" | "PAID" | "FAILED" | "REFUNDED";
  paymentMethod?: "ONLINE" | "COD";
  paymentType?: "FULL_PAYMENT" | "ADVANCE_PAYMENT";
  advanceAmount?: number;
  paidAmount?: number;
  balanceAmount?: number;
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
    selectedColorName?: string | null;
    selectedColorCode?: string | null;
    selectedImageUrl?: string | null;
    selectedVariantKey?: string | null;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }[];
};

async function refreshAdminSession() {
  if (typeof window === "undefined") return null;
  const refreshToken = sessionStorage.getItem("priyas-admin-refresh-token");
  if (!refreshToken) return null;

  const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  });
  const result = (await response.json()) as ApiResponse<{ user: { role: string }; tokens: { accessToken: string; refreshToken: string } }>;
  if (!response.ok || !result.success || !result.data || result.data.user.role !== "ADMIN") {
    sessionStorage.removeItem("priyas-admin-auth");
    sessionStorage.removeItem("priyas-admin-user");
    sessionStorage.removeItem("priyas-admin-access-token");
    sessionStorage.removeItem("priyas-admin-refresh-token");
    return null;
  }

  sessionStorage.setItem("priyas-admin-user", JSON.stringify(result.data.user));
  sessionStorage.setItem("priyas-admin-access-token", result.data.tokens.accessToken);
  sessionStorage.setItem("priyas-admin-refresh-token", result.data.tokens.refreshToken);
  return result.data.tokens.accessToken;
}

async function fetchApi<T>(path: string, init: RequestInit | undefined, token: string | null) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  const result = (await response.json()) as ApiResponse<T>;
  return { response, result };
}

export async function apiRequest<T>(path: string, init?: RequestInit) {
  const token = typeof window === "undefined" ? null : sessionStorage.getItem("priyas-admin-access-token");
  let { response, result } = await fetchApi<T>(path, init, token);

  if (response.status === 401) {
    const nextToken = await refreshAdminSession();
    if (nextToken) {
      ({ response, result } = await fetchApi<T>(path, init, nextToken));
    }
  }

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
  async getSiteSettings() {
    const data = await apiRequest<{ settings: ApiSiteSettings }>("/api/settings/site");
    return data.settings;
  },
  async updateSiteSettings(settings: SiteSettings) {
    const data = await apiRequest<{ settings: ApiSiteSettings }>("/api/settings/site", {
      method: "PUT",
      body: JSON.stringify(settings),
    });
    return data.settings;
  },
  async listPolicies() {
    const data = await apiRequest<{ policies: ApiPolicyPage[] }>("/api/policies?includeInactive=true");
    return data.policies.map(mapPolicyPage);
  },
  async updatePolicy(policy: PolicyPage) {
    const data = await apiRequest<{ policy: ApiPolicyPage }>(`/api/policies/${policy.slug}`, {
      method: "PUT",
      body: JSON.stringify(toPolicyPayload(policy)),
    });
    return mapPolicyPage(data.policy);
  },
  async listContactMessages() {
    const data = await apiRequest<{ messages: ApiContactMessage[] }>("/api/contact-messages");
    return data.messages.map(mapContactMessage);
  },
  async getDashboard() {
    return apiRequest<{ stats: { totalUsers: number; totalDealers: number; totalOrders: number; totalServices: number; activeProducts: number; totalRevenue: number } }>("/api/dashboard");
  },
  async listCategories() {
    const data = await apiRequest<{ categories: ApiCategory[] }>("/api/categories?includeInactive=true");
    return data.categories.map(mapCategory);
  },
  async listSubcategories() {
    const data = await apiRequest<{ subcategories: ApiSubcategory[] }>("/api/subcategories?includeInactive=true");
    return data.subcategories.map(mapSubcategory);
  },
  async createSubcategory(subcategory: Subcategory) {
    const data = await apiRequest<{ subcategory: ApiSubcategory }>("/api/subcategories", {
      method: "POST",
      body: JSON.stringify(toSubcategoryPayload(subcategory)),
    });
    return mapSubcategory(data.subcategory);
  },
  async updateSubcategory(subcategory: Subcategory) {
    const data = await apiRequest<{ subcategory: ApiSubcategory }>(`/api/subcategories/${subcategory.id}`, {
      method: "PUT",
      body: JSON.stringify(toSubcategoryPayload(subcategory)),
    });
    return mapSubcategory(data.subcategory);
  },
  async deleteSubcategory(id: string) {
    await apiRequest(`/api/subcategories/${id}`, { method: "DELETE" });
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
  async listAboutAwards() {
    const data = await apiRequest<{ awards: ApiAboutAward[] }>("/api/about-awards?includeInactive=true");
    return data.awards.map(mapAboutAward);
  },
  async createAboutAward(award: AboutAward) {
    const data = await apiRequest<{ award: ApiAboutAward }>("/api/about-awards", {
      method: "POST",
      body: JSON.stringify(toAboutAwardPayload(award)),
    });
    return mapAboutAward(data.award);
  },
  async updateAboutAward(award: AboutAward) {
    const data = await apiRequest<{ award: ApiAboutAward }>(`/api/about-awards/${award.id}`, {
      method: "PUT",
      body: JSON.stringify(toAboutAwardPayload(award)),
    });
    return mapAboutAward(data.award);
  },
  async setAboutAwardStatus(id: string, status: "ACTIVE" | "INACTIVE") {
    const data = await apiRequest<{ award: ApiAboutAward }>(`/api/about-awards/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    return mapAboutAward(data.award);
  },
  async deleteAboutAward(id: string) {
    await apiRequest(`/api/about-awards/${id}`, { method: "DELETE" });
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
  async createProduct(product: ProductPayload) {
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
  async updateProduct(product: ProductPayload & { id: string }) {
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
  async listTrainingEnquiries() {
    const data = await apiRequest<{ enquiries: ApiTrainingEnquiry[] }>("/api/training-enquiries");
    return data.enquiries.map(mapTrainingEnquiry);
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
  async listReviews() {
    const data = await apiRequest<{ reviews: ApiReview[] }>("/api/reviews/admin?includeHidden=true&limit=100");
    return data.reviews.map(mapReview);
  },
  async setReviewStatus(id: string, status: "PENDING" | "APPROVED" | "REJECTED") {
    const data = await apiRequest<{ review: ApiReview }>(`/api/reviews/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    return mapReview(data.review);
  },
  async deleteReview(id: string) {
    await apiRequest(`/api/reviews/${id}`, { method: "DELETE" });
  },
};


function parsePolicySections(value: ApiPolicyPage["sections"]) {
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value || "[]") as { title: string; body: string }[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function mapPolicyPage(policy: ApiPolicyPage): PolicyPage {
  return {
    slug: policy.slug,
    title: policy.title,
    description: policy.description,
    sections: parsePolicySections(policy.sections),
    status: policy.status === "ACTIVE" ? "Active" : "Inactive",
  };
}

function toPolicyPayload(policy: PolicyPage) {
  return {
    title: policy.title,
    description: policy.description,
    sections: policy.sections.map((section) => ({ title: section.title, body: section.body })),
    status: policy.status === "Active" ? "ACTIVE" : "INACTIVE",
  };
}
function mapTrainingAction(action: ApiTrainingEnquiry["actionType"]): TrainingEnquiry["actionType"] {
  return action === "PAYMENT" ? "Payment" : "Interested";
}

function mapTrainingPaymentStatus(status: ApiTrainingEnquiry["paymentStatus"]): TrainingEnquiry["paymentStatus"] {
  if (status === "PAID") return "Paid";
  if (status === "PENDING") return "Pending";
  if (status === "FAILED") return "Failed";
  return "Not Required";
}

function mapTrainingEnquiry(enquiry: ApiTrainingEnquiry): TrainingEnquiry {
  return {
    id: String(enquiry.id),
    enquiryNumber: enquiry.enquiryNumber,
    fullName: enquiry.fullName,
    mobile: enquiry.mobile,
    city: enquiry.city,
    message: enquiry.message || "",
    actionType: mapTrainingAction(enquiry.actionType),
    amount: Number(enquiry.amount || 0),
    paymentStatus: mapTrainingPaymentStatus(enquiry.paymentStatus),
    createdDate: formatDate(enquiry.createdAt),
  };
}

function mapContactStatus(status: ApiContactMessage["status"]): ContactMessage["status"] {
  if (status === "READ") return "Read";
  if (status === "REPLIED") return "Replied";
  return "New";
}

function mapContactMessage(message: ApiContactMessage): ContactMessage {
  return {
    id: String(message.id),
    fullName: message.fullName || message.full_name || "Customer",
    email: message.email || "",
    mobile: message.mobile || "",
    subject: message.subject || "Contact Message",
    message: message.message,
    status: mapContactStatus(message.status),
    createdDate: formatDate(message.createdAt || message.created_at || new Date().toISOString()),
  };
}
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

function splitDateTime(value?: string | null, fallbackDays = 0) {
  const fallback = new Date();
  fallback.setDate(fallback.getDate() + fallbackDays);
  const date = value ? new Date(value) : fallback;
  const safeDate = Number.isNaN(date.getTime()) ? fallback : date;
  return {
    date: safeDate.toISOString().slice(0, 10),
    time: safeDate.toTimeString().slice(0, 5),
  };
}

function mapCategory(category: ApiCategory): Category {
  return {
    id: String(category.id),
    name: category.name,
    slug: category.slug,
    image: category.imageUrl ? withApiUrl(category.imageUrl) : "/admin/file.svg",
    description: category.description || "",
    productsCount: category.productsCount,
    subcategories: category.subcategories?.map(mapSubcategory) || [],
    status: mapStatus(category.status) as Category["status"],
    createdDate: formatDate(category.createdAt),
  };
}

function mapSubcategory(subcategory: ApiSubcategory): Subcategory {
  return {
    id: String(subcategory.id),
    categoryId: String(subcategory.categoryId),
    categoryName: subcategory.category?.name || "",
    name: subcategory.name,
    slug: subcategory.slug,
    image: subcategory.imageUrl ? withApiUrl(subcategory.imageUrl) : "/admin/file.svg",
    description: subcategory.description || "",
    productsCount: Number(subcategory.productsCount || 0),
    status: mapStatus(subcategory.status) as Subcategory["status"],
    createdDate: formatDate(subcategory.createdAt),
  };
}

function toSubcategoryPayload(subcategory: Subcategory) {
  return {
    categoryId: Number(subcategory.categoryId),
    name: subcategory.name,
    imageUrl: subcategory.image,
    description: subcategory.description,
    status: subcategory.status === "Active" ? "ACTIVE" : "INACTIVE",
  };
}

function mapAboutAward(award: ApiAboutAward): AboutAward {
  return {
    id: String(award.id),
    title: award.title,
    description: award.description,
    imageUrl: award.imageUrl,
    sortOrder: Number(award.sortOrder || 0),
    status: award.status === "ACTIVE" ? "Active" : "Inactive",
    createdDate: formatDate(award.createdAt),
  };
}

function toAboutAwardPayload(award: AboutAward) {
  return {
    title: award.title,
    description: award.description,
    imageUrl: award.imageUrl,
    sortOrder: award.sortOrder,
    status: award.status === "Active" ? "ACTIVE" : "INACTIVE",
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

function groupProductImageVariants(images: { imageUrl: string; colorName?: string | null; colorCode?: string | null; isPrimary?: boolean }[]) {
  const common = images.find((image) => image.isPrimary && !image.colorName && !image.colorCode) || images[0];
  const groups = new Map<string, { imageUrl: string; colorName: string; colorCode: string; isPrimary: boolean; images: string[] }>();

  images.forEach((image) => {
    const imageUrl = withApiUrl(image.imageUrl);
    const colorName = image.colorName || "";
    const colorCode = image.colorCode || "";
    if (image === common && !colorName && !colorCode) return;
    if (!colorName && !colorCode && image.isPrimary) return;
    const key = `${colorName.toLowerCase()}|${colorCode.toLowerCase()}`;
    const existing = groups.get(key);
    if (existing) {
      existing.images.push(imageUrl);
      return;
    }
    groups.set(key, { imageUrl, colorName, colorCode, isPrimary: false, images: [imageUrl] });
  });

  const variants = common ? [{ imageUrl: withApiUrl(common.imageUrl), colorName: "", colorCode: "", isPrimary: true, images: [withApiUrl(common.imageUrl)] }] : [];
  return [...variants, ...Array.from(groups.values())];
}

function flattenProductImageVariants(variants: { imageUrl: string; colorName?: string | null; colorCode?: string | null; isPrimary?: boolean; images?: string[] }[]) {
  const rows: { imageUrl: string; colorName?: string | null; colorCode?: string | null; isPrimary?: boolean }[] = [];
  variants.forEach((variant) => {
    const urls = variant.images?.length ? variant.images : variant.imageUrl ? [variant.imageUrl] : [];
    urls.filter(Boolean).slice(0, variant.isPrimary ? 1 : 4).forEach((imageUrl, index) => {
      rows.push({
        imageUrl,
        colorName: variant.isPrimary ? "" : variant.colorName || "",
        colorCode: variant.isPrimary ? "" : variant.colorCode || "",
        isPrimary: rows.length === 0 && variant.isPrimary,
      });
    });
  });
  return rows;
}
function mapProduct(product: ApiProduct): Product {
  return {
    id: String(product.id),
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    category: product.category.name,
    categoryId: String(product.category.id),
    subcategory: product.subcategory?.name,
    subcategoryId: product.subcategory?.id ? String(product.subcategory.id) : undefined,
    images: groupProductImageVariants(product.images).flatMap((variant) => variant.images),
    imageVariants: groupProductImageVariants(product.images),
    customerOriginalPrice: product.prices.customerOriginalPrice,
    customerSellingPrice: product.prices.customerSellingPrice,
    dealerOriginalPrice: product.prices.dealerOriginalPrice,
    dealerSellingPrice: product.prices.dealerSellingPrice,
    rating: Number(product.rating || 0),
    reviewCount: Number(product.reviewCount || 0),
    sortOrder: Number(product.sortOrder ?? 999),
    description: product.description,
    status: mapStatus(product.status) as Product["status"],
    createdDate: formatDate(product.createdAt),
    updatedDate: product.updatedAt ? formatDate(product.updatedAt) : undefined,
  } as Product;
}

function toProductPayload(product: ProductPayload) {
  const payload: {
    categoryId: number;
    subcategoryId?: number | null;
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
    sortOrder: number;
    images: { imageUrl: string; colorName?: string | null; colorCode?: string | null; isPrimary?: boolean }[];
  } = {
    categoryId: Number((product as Product & { categoryId?: string }).categoryId),
    subcategoryId: product.subcategoryId ? Number(product.subcategoryId) : null,
    name: product.name,
    description: product.description,
    status: product.status === "Active" ? "ACTIVE" : "INACTIVE",
    customerOriginalPrice: product.customerOriginalPrice,
    customerSellingPrice: product.customerSellingPrice,
    dealerOriginalPrice: product.dealerOriginalPrice,
    dealerSellingPrice: product.dealerSellingPrice,
    rating: Number(product.rating || 0),
    reviewCount: Number(product.reviewCount || 0),
    sortOrder: Number(product.sortOrder ?? 999),
    images: flattenProductImageVariants(product.imageVariants?.length ? product.imageVariants : product.images.map((imageUrl) => ({ imageUrl, colorName: "", colorCode: "" }))),
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
    gstNumber: dealer.gstNumber || "",
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
  const start = splitDateTime(coupon.startAt || coupon.start_at);
  const end = splitDateTime(coupon.endAt || coupon.end_at, 365);
  return {
    id: String(coupon.id),
    code: coupon.code,
    title: coupon.title || undefined,
    subtitle: coupon.subtitle || undefined,
    imageUrl: coupon.imageUrl || undefined,
    discountType: coupon.discountType === "PERCENTAGE" ? "Percentage" : "Flat Amount",
    discountValue: coupon.discountValue,
    minimumOrderAmount: coupon.minimumOrderAmount,
    maximumDiscountAmount: coupon.maximumDiscountAmount || undefined,
    startDate: start.date,
    startTime: start.time,
    endDate: end.date,
    endTime: end.time,
    usageLimit: coupon.usageLimit,
    sortOrder: Number(coupon.sortOrder || 0),
    manualStatus: coupon.status === "ACTIVE" ? "Active" : "Inactive",
    applicableProductIds: (coupon.applicableProductIds || []).map(String),
    applicableProducts: (coupon.applicableProducts || []).map((product) => ({ id: String(product.id), name: product.name, sku: product.sku })),
    createdDate: formatDate(coupon.createdAt),
  };
}

function toCouponPayload(coupon: Coupon) {
  return {
    code: coupon.code,
    title: coupon.title,
    subtitle: coupon.subtitle,
    imageUrl: coupon.imageUrl,
    discountType: coupon.discountType === "Percentage" ? "PERCENTAGE" : "FLAT_AMOUNT",
    discountValue: coupon.discountValue,
    minimumOrderAmount: coupon.minimumOrderAmount,
    maximumDiscountAmount: coupon.maximumDiscountAmount,
    startAt: `${coupon.startDate}T${coupon.startTime}:00`,
    endAt: `${coupon.endDate}T${coupon.endTime}:00`,
    usageLimit: coupon.usageLimit,
    sortOrder: coupon.sortOrder,
    status: coupon.manualStatus === "Active" ? "ACTIVE" : "INACTIVE",
    applicableProductIds: (coupon.applicableProductIds || []).map(Number).filter(Boolean),
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
  if (status === "PARTIAL") return "Partial";
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
    paymentMethod: order.paymentMethod === "COD" ? "COD" : "Online",
    paymentType: order.paymentType === "ADVANCE_PAYMENT" || order.paymentMethod === "COD" ? "Advance Payment" : "Full Payment",
    advanceAmount: Number(order.advanceAmount || 0),
    paidAmount: Number(order.paidAmount ?? (order.paymentStatus === "PARTIAL" ? order.advanceAmount : order.paymentStatus === "PAID" ? order.totalAmount : 0) ?? 0),
    balanceAmount: Number(order.balanceAmount || 0),
    shippingAddress: order.shippingAddress,
    products: order.items.map((item) => ({
      id: String(item.id),
      productId: String(item.productId),
      productName: item.productName,
      productSku: item.productSku,
      productSlug: item.productSlug,
      imageUrl: withApiUrl(item.imageUrl),
      selectedColorName: item.selectedColorName || "",
      selectedColorCode: item.selectedColorCode || "",
      selectedImageUrl: item.selectedImageUrl ? withApiUrl(item.selectedImageUrl) : "",
      selectedVariantKey: item.selectedVariantKey || "",
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

function mapReviewStatus(status: ApiReview["status"]): Review["status"] {
  if (status === "APPROVED" || status === "VISIBLE") return "Approved";
  if (status === "REJECTED" || status === "HIDDEN") return "Rejected";
  return "Pending";
}

function mapReview(review: ApiReview): Review {
  return {
    id: String(review.id),
    userId: String(review.userId),
    customerName: review.customerName,
    role: review.role === "DEALER" ? "Dealer" : "Customer",
    rating: Number(review.rating || 0),
    message: review.message,
    status: mapReviewStatus(review.status),
    createdDate: formatDate(review.createdAt),
  };
}
