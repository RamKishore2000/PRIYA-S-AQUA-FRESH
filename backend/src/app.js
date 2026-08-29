const express = require("express");
const path = require("path");
const cors = require("cors");
const env = require("./config/env");
const addressRoutes = require("./routes/address.routes");
const authRoutes = require("./routes/auth.routes");
const bannerRoutes = require("./routes/banner.routes");
const cartRoutes = require("./routes/cart.routes");
const categoryRoutes = require("./routes/category.routes");
const contactRoutes = require("./routes/contact.routes");
const couponRoutes = require("./routes/coupon.routes");
const customerRoutes = require("./routes/customer.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const dealerRoutes = require("./routes/dealer.routes");
const healthRoutes = require("./routes/health.routes");
const orderRoutes = require("./routes/order.routes");
const productRoutes = require("./routes/product.routes");
const reviewRoutes = require("./routes/review.routes");
const razorpayWebhookRoutes = require("./routes/razorpayWebhook.routes");
const serviceRequestRoutes = require("./routes/serviceRequest.routes");
const settingsRoutes = require("./routes/settings.routes");
const subcategoryRoutes = require("./routes/subcategory.routes");
const testimonialRoutes = require("./routes/testimonial.routes");
const trainingEnquiryRoutes = require("./routes/trainingEnquiry.routes");
const uploadRoutes = require("./routes/upload.routes");
const wishlistRoutes = require("./routes/wishlist.routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const corsOrigins = env.corsOrigin.split(",").map((origin) => origin.trim());

app.use(
  cors({
    origin: corsOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use("/api/orders/razorpay/webhook", express.raw({ type: "application/json", limit: "1mb" }), razorpayWebhookRoutes);
app.use(express.json({ limit: "1mb" }));
app.use("/uploads", express.static(path.resolve(__dirname, "../public/uploads")));

app.use("/api", healthRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/contact-messages", contactRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/dealers", dealerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/service-requests", serviceRequestRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/subcategories", subcategoryRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/training-enquiries", trainingEnquiryRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/wishlist", wishlistRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found.",
  });
});

app.use(errorHandler);

module.exports = app;



