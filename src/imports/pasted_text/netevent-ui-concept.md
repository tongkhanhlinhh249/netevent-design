Create a high-fidelity UI/UX concept for NetEvent inspired by Luma’s clean event-first experience, but adapted to NetEvent’s product logic and SaaS event management flow.

Use Vietnamese for all UI copy, labels, buttons, helper text, status badges, empty states, tabs, and forms.

Important:
Do not copy Luma exactly. Use Luma-inspired UX principles: minimal interface, fast event creation, event-first workspace, contextual side drawer, clear empty states, soft visual style, simple top navigation, and strong event preview. Adapt everything to NetEvent’s business model and workflow.

Product context:
NetEvent is a self-service SaaS event management platform. Customers can register an account, buy an event package, create events, build landing pages, create registration forms, set up ticket inventory, issue QR tickets, check in attendees, and view reports.

NetEvent business rules:

* Customer can register and buy an event package.
* Package limits number of published events, issued tickets, and usage duration.
* Creating an event draft does not consume event quota.
* Event quota is consumed only when the event is published for the first time.
* Creating ticket inventory does not consume ticket quota.
* Creating ticket tiers does not consume ticket quota.
* Ticket quota is consumed only when a real ticket is issued after successful registration.
* Each event can have one active landing page in MVP.
* Each event can have one active ticket inventory called “Kho vé”.
* One Kho vé can contain multiple ticket tiers called “Hạng vé”.
* Each Hạng vé has its own price, quantity, status, and landing visibility.
* Landing Page does not own ticket or form data. It pulls data from the event’s Kho vé and Form đăng ký.

Design direction:

* Luma-inspired minimal layout
* Event-first experience
* Soft gradient background
* Large whitespace
* Rounded cards
* Subtle shadows
* Clean typography
* Calm neutral UI with one strong primary color
* Primary color: #FF8644
* Supporting colors: blue for selected state, green for success, red/orange for warning
* Font: Inter or Be Vietnam Pro
* Desktop width: 1440px
* Responsive mindset for mobile check-in and public landing page

==================================================
SCREEN 1 — EVENTS EMPTY STATE
=============================

Create an Events list screen inspired by Luma empty state.

Top navigation:

* Logo: NetEvent
* Navigation: Sự kiện, Lịch, Khám phá
* Right side: Gói hiện tại, Tìm kiếm, Thông báo, User avatar
* Primary action: “Tạo sự kiện”

Page title:
“Sự kiện”

Tabs:

* Sắp diễn ra
* Bản nháp
* Đã qua

Empty state when user has no events:
Illustration: soft event card illustration with number 0
Title:
“Chưa có sự kiện nào”

Description:
“Tạo sự kiện đầu tiên để bắt đầu thiết lập landing page, form đăng ký, kho vé và check-in.”

Primary CTA:
“+ Tạo sự kiện”

Package mini card:
“Gói Professional”
“0 / 10 sự kiện đã publish”
“0 / 1.000 vé đã phát hành”
“Còn hạn đến 03/08/2026”

Helper text:
“Bản nháp chưa tính vào quota. Quota sự kiện chỉ được tính khi publish lần đầu.”

==================================================
SCREEN 2 — CREATE EVENT DRAFT
=============================

Create a Luma-inspired event creation screen.

Layout:

* Left column: Event cover/theme preview
* Right column: Event basic info form
* No long wizard
* User creates event draft quickly

Page title:
“Tạo sự kiện”

Left column:
Large event cover upload card:

* Placeholder cover image
* Button: “Thay ảnh cover”
* Theme selector below:

  * Minimal
  * Gradient
  * Conference
  * Workshop
  * Product Launch

Theme controls:

* Màu chủ đạo
* Font hiển thị
* Style ảnh nền

Right column:
Event form card.

Fields:

1. Tên sự kiện
   Placeholder:
   “Nhập tên sự kiện”

2. Lịch / Workspace
   Dropdown:
   “Workspace mặc định”

3. Chế độ hiển thị
   Dropdown:
   “Công khai / Riêng tư”

4. Thời gian bắt đầu
   Date + time picker

5. Thời gian kết thúc
   Date + time picker

6. Múi giờ
   Default:
   “GMT+07:00 — Việt Nam”

7. Hình thức tổ chức
   Segmented control:

* Offline
* Online
* Hybrid

8. Địa điểm hoặc link online
   Placeholder:
   “Nhập địa điểm tổ chức hoặc link online”

9. Mô tả ngắn
   Textarea:
   “Sự kiện này dành cho ai? Nội dung chính là gì?”

Event options:

* Yêu cầu duyệt đăng ký
* Giới hạn số người tham dự
* Cho phép hiển thị công khai

Primary button:
“Tạo bản nháp”

Secondary button:
“Hủy”

Right/Bottom helper:
“Tạo bản nháp trước. Bạn sẽ cấu hình Landing Page, Form đăng ký, Kho vé và Email trong Event Workspace.”

After clicking “Tạo bản nháp”:
Show toast:
“Tạo sự kiện bản nháp thành công”

Then navigate to Event Workspace Overview.

==================================================
SCREEN 3 — EVENT WORKSPACE OVERVIEW
===================================

Create an event detail workspace inspired by Luma’s event detail page, but adapted to NetEvent.

Top area:
Breadcrumb:
“Sự kiện / NetEvent Demo Conference 2026”

Event title:
“NetEvent Demo Conference 2026”

Status badge:
“Bản nháp”

Primary action:
“Publish”

If not ready, disable Publish and show:
“Chưa đủ điều kiện publish”

Button:
“Event Page”
“Preview”

Tabs:

* Tổng quan
* Landing Page
* Form đăng ký
* Kho vé
* Người tham dự
* Email
* Check-in
* Báo cáo
* Cài đặt

Active tab:
“Tổng quan”

Top quick action cards:

1. “Tạo Landing Page”
   Description:
   “Chọn template hoặc tạo mới bằng Page Builder.”
   Button:
   “Tạo landing”

2. “Tạo Form đăng ký”
   Description:
   “Thu thông tin người tham dự.”
   Button:
   “Tạo form”

3. “Tạo Kho vé”
   Description:
   “Thiết lập các hạng vé và giá vé.”
   Button:
   “Tạo kho vé”

4. “Preview & Publish”
   Description:
   “Kiểm tra điều kiện trước khi public.”
   Button:
   “Kiểm tra”

Main content layout:
Left column:
Event preview card similar to Luma:

* Cover image
* Event name
* Host/Organizer
* Registration preview
* Public URL
* Copy link button
* Share buttons

Right column:
“When & Where” card:

* Date
* Time
* Location / Online link
* Timezone
* Button: “Chỉnh sửa thông tin”

Below:
Setup checklist card.

Checklist title:
“Checklist cấu hình sự kiện”

Checklist items:

1. “Thông tin sự kiện”
   Status: Đã hoàn tất
   Button: “Chỉnh sửa”

2. “Landing Page”
   Status: Chưa tạo
   Button: “Tạo landing page”

3. “Form đăng ký”
   Status: Chưa tạo
   Button: “Tạo form”

4. “Kho vé”
   Status: Chưa tạo
   Button: “Tạo kho vé”

5. “Email xác nhận”
   Status: Chưa cấu hình
   Button: “Cấu hình email”

6. “Preview & Publish”
   Status: Chưa sẵn sàng
   Button: “Kiểm tra publish”

Progress:
“1/6 hoàn tất”

Helper text:
“Hoàn tất checklist để sự kiện sẵn sàng publish.”

==================================================
SCREEN 4 — EDIT EVENT SIDE DRAWER
=================================

Create a right-side drawer inspired by Luma’s Edit Event drawer.

Drawer title:
“Chỉnh sửa sự kiện”

Sections:

1. “Thông tin cơ bản”
   Fields:

* Tên sự kiện
* Mô tả
* Đơn vị tổ chức

2. “Thời gian & Địa điểm”
   Fields:

* Ngày bắt đầu
* Giờ bắt đầu
* Ngày kết thúc
* Giờ kết thúc
* Múi giờ
* Hình thức tổ chức
* Địa điểm / Link online

3. “Giao diện”
   Theme cards:

* Minimal
* Gradient
* Conference
* Workshop
* Product Launch

Controls:

* Màu chủ đạo
* Font
* Ảnh cover
* Style hiển thị

Footer:

* “Hủy”
* Primary button: “Cập nhật sự kiện”

==================================================
SCREEN 5 — LANDING PAGE TAB
===========================

Create Landing Page tab inside Event Workspace.

If no landing page:
Empty state:
Title:
“Chưa có Landing Page”
Description:
“Tạo landing page để giới thiệu sự kiện, hiển thị vé và thu đăng ký.”

Primary CTA:
“Tạo Landing Page”

Options:

* “Dùng template có sẵn”
* “Tạo mới hoàn toàn”

After landing page is created:
Show landing page card:

* Landing page name
* Status: Bản nháp / Đã publish
* Public URL
* Views
* Registrations
* Conversion rate
* Button: “Mở Page Builder”
* Button: “Preview”

Page Builder should include:

* Left: Section library
* Center: Canvas
* Right: Section settings

Section groups:

* Banner / Hero
* Thông tin sự kiện
* Nội dung sự kiện
* Đăng ký & Vé
* Marketing / Trust
* Footer

Important:
The “Vé tham dự” section pulls data from Kho vé.
The “Form đăng ký” section pulls data from Form đăng ký.
Do not let users edit ticket tiers or form fields directly inside Landing Page Builder.

==================================================
SCREEN 6 — FORM ĐĂNG KÝ TAB
===========================

If no form:
Empty state:
Title:
“Chưa có Form đăng ký”
Description:
“Tạo form để thu thông tin người tham dự. Section Form trên Landing Page sẽ lấy dữ liệu từ form này.”

Primary CTA:
“Tạo form đăng ký”

Form builder:
Default fields:

* Họ và tên
* Email
* Số điện thoại

Custom fields:

* Text
* Dropdown
* Checkbox
* Textarea

Actions:

* Preview form
* Lưu form

==================================================
SCREEN 7 — KHO VÉ TAB
=====================

If no Kho vé:
Empty state:
Title:
“Sự kiện này chưa có Kho vé”

Description:
“Tạo kho vé để thiết lập các hạng vé như Standard, VIP, Early Bird và hiển thị vé trên Landing Page.”

Primary CTA:
“Tạo Kho vé”

Rule helper:
“Mỗi sự kiện chỉ có một kho vé active. Tạo kho vé và hạng vé không trừ quota vé.”

After Kho vé is created:
Show Kho vé detail:

* Kho vé name
* Status: Đang hoạt động
* Total capacity
* Issued tickets
* Remaining tickets
* Package quota
* Button: “Thêm hạng vé”

Ticket tier table:
Columns:

* Hạng vé
* Loại vé
* Giá vé
* Số lượng
* Đã phát hành
* Còn lại
* Hiển thị Landing
* Trạng thái
* Hành động

Example tiers:

1. Standard — Miễn phí — 0đ — 300 — Đang mở
2. VIP — Trả phí — 499.000đ — 100 — Đang mở
3. Early Bird — Trả phí — 299.000đ — 150 — Hết vé
4. Guest — Miễn phí — 0đ — 50 — Lưu nháp

Add ticket tier drawer:
Fields:

* Tên hạng vé
* Mô tả
* Quyền lợi vé
* Loại vé: Miễn phí / Trả phí
* Giá vé
* Số lượng
* Giới hạn mỗi người
* Thời gian đăng ký
* Hiển thị trên Landing Page
* Trạng thái

Footer:

* Hủy
* Lưu hạng vé

==================================================
SCREEN 8 — GUESTS / ATTENDEE TAB
================================

Inspired by Luma Guests tab, but adapted to NetEvent.

Page title:
“Người tham dự”

Actions:

* “Thêm người tham dự”
* “Import CSV”
* “Export”
* “Gửi lại email vé”

Table columns:

* Người tham dự
* Email
* Số điện thoại
* Hạng vé
* Mã vé
* Trạng thái check-in
* Thời gian đăng ký
* Hành động

Filters:

* Tất cả
* Chưa check-in
* Đã check-in
* Vé lỗi
* Theo hạng vé

==================================================
SCREEN 9 — EMAIL / BLAST TAB
============================

Inspired by Luma Blasts, adapted for NetEvent.

Page title:
“Email”

Sections:

1. “Email xác nhận đăng ký”

* Status
* Template
* Last updated
* Button: “Cấu hình”

2. “Gửi thông báo”

* Gửi cho tất cả người đăng ký
* Gửi theo hạng vé
* Gửi cho người chưa check-in

For MVP, focus on email confirmation only.

==================================================
SCREEN 10 — CHECK-IN TAB
========================

Page title:
“Check-in”

Primary actions:

* “Mở máy quét QR”
* “Check-in thủ công”

Stats:

* Tổng đăng ký
* Đã check-in
* Chưa check-in
* Tỷ lệ check-in

Manual check-in search:
“Tìm theo tên, email, SĐT hoặc mã vé”

Check-in result states:

* Check-in thành công
* Vé đã được check-in trước đó
* Không tìm thấy vé
* Vé không thuộc sự kiện này

==================================================
SCREEN 11 — PUBLISH CHECKLIST MODAL
===================================

Create publish validation modal.

Title:
“Kiểm tra trước khi Publish”

Checklist:

* Gói sử dụng còn hiệu lực
* Còn quota sự kiện
* Thông tin sự kiện đầy đủ
* Landing Page đã tạo
* Form đăng ký đã tạo
* Kho vé có ít nhất một hạng vé đang mở
* URL Landing hợp lệ

If missing:
Primary button disabled:
“Chưa thể Publish”

If ready:
Primary button:
“Publish sự kiện”

Success toast:
“Sự kiện đã được Publish. Landing Page hiện có thể truy cập công khai.”

==================================================
UX PRINCIPLES TO FOLLOW
=======================

Use Luma-inspired UX:

* Fast event creation
* Minimal initial form
* Event workspace after creation
* Clear event preview
* Strong empty states
* Contextual drawers for editing
* Tabs for event operations
* Quick actions on overview
* Soft, clean, calm interface

But keep NetEvent product logic:

* Package / subscription / quota
* Campaign workspace checklist
* Landing Page Builder
* Form đăng ký
* Kho vé with multiple hạng vé and separate pricing
* QR ticket issuing
* Check-in validation
* Reports

Final flow:
Đăng ký tài khoản
→ Mua gói sự kiện
→ Vào Events
→ Tạo sự kiện draft nhanh
→ Vào Event Workspace
→ Hoàn tất checklist
→ Tạo Landing Page
→ Tạo Form đăng ký
→ Tạo Kho vé và hạng vé
→ Preview
→ Publish
→ Attendee đăng ký
→ Sinh vé QR
→ Check-in
→ Báo cáo
