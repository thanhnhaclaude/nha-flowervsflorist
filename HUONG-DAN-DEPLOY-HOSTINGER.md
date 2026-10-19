# Hướng dẫn deploy flowervsflorist.com lên Hostinger

Áp dụng cho gói **Business / Cloud** có mục **Node.js** trong hPanel.

Thư mục `deploy/` trên máy bạn (không đưa lên GitHub) có:

| File | Dùng để |
|---|---|
| `deploy/hostinger-env.txt` | Toàn bộ biến môi trường. **Mật khẩu admin** và `AUTH_SECRET` đã được tạo sẵn (xem dòng đầu file) |
| `deploy/database.sql.gz` | Bản sao dữ liệu ban đầu: 45 sản phẩm, 8 bài blog, 2 mã giảm giá. Chỉ dùng khi muốn nhập tay, vì website **tự tạo bảng và dữ liệu** khi chạy lần đầu |

---

## Bước 1: Tạo database MySQL

1. hPanel → **Databases → MySQL Databases**.
2. Tạo database và user mới. Đặt mật khẩu **chỉ gồm chữ và số**.
3. Điền 3 dòng `DB_NAME`, `DB_USER`, `DB_PASSWORD` trong `deploy/hostinger-env.txt`. Giữ nguyên `DB_HOST=localhost` và `DB_PORT=3306`.

> Không cần import gì. Lần khởi động đầu tiên, website tự tạo 11 bảng và nạp sản phẩm, blog, mã giảm giá.

## Bước 2: Tạo hộp thư email

1. hPanel → **Emails** → thêm tên miền `flowervsflorist.com` → tạo hộp thư `contact@flowervsflorist.com`.
2. Điền mật khẩu hộp thư vào dòng `SMTP_PASS`.

## Bước 3: Tạo tài khoản Stripe

1. Đăng ký tại https://dashboard.stripe.com/register với thông tin **M&R MARKETING GROUP, LLC** (Business type: *LLC*; EIN; địa chỉ 331 3rd Street, Macon, GA 31201; website `https://flowervsflorist.com`; mô tả: *Online florist – fresh flower delivery*). Hoàn tất xác minh để nhận tiền.
2. **Developers → API keys** → copy **Secret key** (`sk_live_...`) vào `STRIPE_SECRET_KEY`.
3. **Developers → Webhooks → Add endpoint**:
   - URL: `https://flowervsflorist.com/api/stripe/webhook`
   - Sự kiện: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `checkout.session.expired`, `charge.refunded`
   - Copy **Signing secret** (`whsec_...`) vào `STRIPE_WEBHOOK_SECRET`.
4. **Settings → Payment methods**: bật Apple Pay và Google Pay.
5. (Tùy chọn) Bật **Stripe Tax** để thu thuế bán hàng của Georgia và các bang khác, rồi đặt `STRIPE_AUTOMATIC_TAX=true`.

> **Thử trước bằng tiền ảo:** dùng khóa `sk_test_...` và webhook ở chế độ Test, thanh toán bằng thẻ `4242 4242 4242 4242` (ngày hết hạn bất kỳ trong tương lai, CVC bất kỳ). Khi chạy thật thì đổi sang khóa `sk_live_...`.
>
> Nếu chưa điền `STRIPE_SECRET_KEY`, website vẫn nhận đơn ở chế độ **Place Order**: shop gọi điện cho khách để thu tiền, sau đó đánh dấu "đã thanh toán" trong admin.

## Bước 4: Tạo ứng dụng Node.js từ GitHub

1. hPanel → **Websites → Add website → Node.js Apps**.
2. Chọn **Import Git repository**, đăng nhập GitHub, chọn repo `thanhnhaclaude/nha-flowervsflorist`, nhánh `main`.
3. Cấu hình:
   - **Node.js version:** 22.x (tối thiểu 20.9)
   - **Build command:** `npm run build`
   - **Start command:** `npm start`
   - **Root directory:** để mặc định

## Bước 5: Khai báo biến môi trường (trước khi bấm Deploy)

Trong phần **Environment variables**, thêm **từng dòng** trong `deploy/hostinger-env.txt` (tên biến và giá trị). Bỏ qua các dòng bắt đầu bằng `#`.

- `NEXT_PUBLIC_SITE_URL` được ghi vào lúc build. Nếu đổi giá trị này thì phải **Deploy lại**.
- Biến nào còn ký hiệu `<...>` thì phải thay bằng giá trị thật, hoặc xóa đi (riêng Stripe có thể để trống).

## Bước 6: Deploy và gắn tên miền

1. Bấm **Deploy**. Lần đầu mất vài phút.
2. Trỏ tên miền **flowervsflorist.com** (và `www`) về ứng dụng này, bật **SSL** (hPanel → **Security → SSL**).

## Bước 7: Kiểm tra sau khi chạy

- [ ] https://flowervsflorist.com/api/health → `"database":{"status":"ok","products":45,...}`. Các biến đã khai báo phải là `true`, `stripeMode` là `live` hoặc `test`.
- [ ] Trang chủ, https://flowervsflorist.com/roses, https://flowervsflorist.com/product/crimson-classic-dozen-red-roses
- [ ] https://flowervsflorist.com/admin → đăng nhập user `admin`, mật khẩu ghi ở dòng đầu `deploy/hostinger-env.txt`
- [ ] Đặt thử một đơn → thanh toán Stripe → trang "Thank you"; email xác nhận đến khách và đến `contact@flowervsflorist.com`; trong Stripe → Webhooks, sự kiện `checkout.session.completed` trả về 200
- [ ] Admin → Orders → mở đơn → đổi trạng thái "Out for delivery" → khách nhận email
- [ ] Footer có thông tin **M&R Marketing Group, LLC**; các trang Terms, Privacy, Refund policy và Delivery information mở được
- [ ] https://flowervsflorist.com/sitemap.xml và /robots.txt hiển thị đúng

## Bước 8: Google & Bing

1. Thêm `flowervsflorist.com` vào **Google Search Console** và **Bing Webmaster Tools**, gửi sitemap `https://flowervsflorist.com/sitemap.xml`.
2. **Google Business Profile:** chỉ tạo khi shop có nơi nhận/giao hoa thật tại Macon. Địa chỉ 331 3rd Street là văn phòng agency M&R, không phải tiệm hoa, nên không đăng ký làm "Florist" tại địa chỉ đó (Google có thể khóa hồ sơ).
3. Thay ảnh Unsplash bằng ảnh thật của shop trong **Admin → Products → Upload images**.

## Bước 9: Quy trình xử lý đơn (giao ngày hôm sau qua FedEx/UPS)

Website hứa: **đặt trước 2 PM giờ miền Đông (ET), Thứ 2 – Thứ 6 → giao ngày hôm sau**; chỉ giao **Thứ 3 – Thứ 7**; không có giờ giao cố định. Để giữ đúng cam kết này:

1. Chọn nhà cung cấp đóng gói và ship hoa (trang trại, nhà bán sỉ hoặc dịch vụ dropship hoa) có thể gửi FedEx/UPS Priority Overnight trong ngày.
2. Mỗi ngày trước 2 PM ET: Admin → Orders → lọc "Order received", chuyển đơn cho nhà cung cấp, đổi trạng thái sang **Being prepared**.
3. Khi có mã vận đơn: mở đơn → chọn hãng (FedEx/UPS/USPS) → nhập **Tracking number** → đổi trạng thái sang **Shipped** (giữ tick "Email the customer") → khách nhận email có link theo dõi.
4. Sau khi giao: đổi sang **Delivered**.

> Nếu nhà cung cấp có giờ chốt đơn hoặc ngày giao khác, sửa `cutoffHour` và `deliveryDays` trong `src/lib/site.ts`. Sản phẩm cần thêm 1 ngày chuẩn bị: bỏ tick "Next-day eligible" trong Admin → Products.

---

## Cập nhật website về sau

- Sửa code rồi push lên nhánh `main`. Trong hPanel bấm **Deploy** lại, hoặc bật tự deploy khi có commit mới.
- Đổi cấu trúc bảng: sửa `src/lib/db/schema.ts`, chạy `npm run db:generate`, rồi commit thư mục `drizzle/`. Website tự áp dụng migration khi khởi động.
- Ảnh tải lên trong admin được lưu ở `/home/<user>/flowervsflorist-uploads`, nằm ngoài thư mục app nên không mất khi deploy lại.
- Sao lưu dữ liệu: phpMyAdmin → **Export**.
