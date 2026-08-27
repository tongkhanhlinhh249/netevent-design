Improve the current NetEvent Landing Page Editor UI and flow.

Use Vietnamese for all UI copy, labels, buttons, helper text, empty states, warnings, validation messages, status badges, and form fields.

Product context:
NetEvent is an event management platform. Each event can have:

* One Landing Page
* One Registration Form
* One Ticket Inventory called “Kho vé”
* Multiple ticket tiers called “Hạng vé”

Landing Page logic:

* Landing Page belongs to one event.
* Landing Page displays event information.
* Landing Page can show a registration block.
* Registration Form data must come from the event’s “Form đăng ký”.
* Ticket tier data must come from the event’s “Kho vé”.
* Landing Page does not directly store or edit form fields.
* Landing Page does not directly store or edit ticket tiers.
* However, inside Landing Page Editor, user can quickly create Form đăng ký or Kho vé through drawers/modals.
* Data created from Landing Page Editor must still be saved to the correct source module: Form đăng ký or Kho vé.

Important business rules:

* Default registration form must include:

  * Họ và tên
  * Email
  * Số điện thoại
* One event can have only one active Kho vé in MVP.
* One Kho vé can have multiple Hạng vé.
* Each Hạng vé has its own name, price, quantity, status, and landing visibility.
* Creating Kho vé does not consume ticket quota.
* Creating Hạng vé does not consume ticket quota.
* Ticket quota is consumed only when a real ticket is issued after attendee registration.
* If no Form exists, do not show fake form fields as real data.
* If no Kho vé exists, do not show fake ticket tiers as real data.
* Show clear placeholder states instead.

Design style:

* Modern B2B SaaS dashboard
* Clean light background
* Rounded cards
* Subtle borders and shadows
* Primary color: #FF8644
* Supporting blue for selected states
* Green for success/available
* Orange for warning/missing setup
* Red/gray for blocked/sold out
* Font: Inter or Be Vietnam Pro
* Desktop layout: 1440px
* Keep current NetEvent/EventHub visual style, but make the flow clearer and more logical.

==================================================
SCREEN — LANDING PAGE EDITOR
============================

Keep the editor layout:

Top bar:

* Event name / Landing page name
* Status badge: “Bản nháp”
* Public URL
* Button: “Tùy chỉnh”
* Button: “Preview”
* Button: “Xóa”
* Primary button: “Publish”

Editor layout:

* Left panel: configuration
* Center/right canvas: Landing Page preview

Top helper banner:
“Click trực tiếp vào nội dung để chỉnh sửa giao diện. Dữ liệu Form và Kho vé được lấy từ sự kiện.”

==================================================
LEFT PANEL STRUCTURE
====================

Redesign the left panel into these groups:

1. “Giao diện”

* Tải ảnh cover
* Kiểu nền
* Font hiển thị
* Màu chủ đạo

2. “Section hiển thị”
   Toggles:

* Thông tin sự kiện
* Đơn vị tổ chức
* Địa điểm / Bản đồ
* Giới thiệu sự kiện
* Footer

3. “Đăng ký”

* Chế độ đăng ký
* Form đăng ký
* Kho vé

4. “Điều kiện Publish”

* Checklist trạng thái dữ liệu

==================================================
REGISTRATION MODE
=================

In group “Đăng ký”, add a dropdown/segmented control:

Label:
“Chế độ đăng ký”

Options:

1. “Chỉ Form đăng ký”
2. “Một hạng vé + Form”
3. “Nhiều hạng vé + Form”

Helper text:
“Chọn cách người tham dự đăng ký trên Landing Page.”

Logic:

* If “Chỉ Form đăng ký” is selected, user only needs Form đăng ký.
* If “Một hạng vé + Form” is selected, user needs Form đăng ký and Kho vé with one visible active Hạng vé.
* If “Nhiều hạng vé + Form” is selected, user needs Form đăng ký and Kho vé with multiple visible active Hạng vé.

==================================================
LEFT PANEL — FORM ĐĂNG KÝ SOURCE
================================

Create a data source card:

Title:
“Form đăng ký”

If no form exists:
Status:
“Chưa có Form đăng ký”

Description:
“Form dùng để thu thông tin người tham dự.”

Button:
“Tạo Form”

Warning style:
Light orange background, orange border.

If form exists:
Status:
“Đã cấu hình”

Description:
“3 field mặc định · Họ tên, Email, Số điện thoại”

Button:
“Quản lý Form”

Secondary text:
“Dữ liệu Form được lưu tại module Form đăng ký của sự kiện.”

==================================================
CREATE FORM DRAWER
==================

When user clicks “Tạo Form”, open a right drawer.

Drawer title:
“Tạo Form đăng ký”

Subtitle:
“Form này sẽ được gắn với sự kiện hiện tại và hiển thị trên Landing Page.”

Default fields:
Show 3 required fields already created:

1. Họ và tên — Bắt buộc
2. Email — Bắt buộc
3. Số điện thoại — Bắt buộc

Allow optional fields:

* Công ty / Tổ chức
* Chức danh
* Ghi chú
* Dropdown
* Checkbox
* Textarea

Actions:

* “+ Thêm field”
* “Preview Form”

Footer:

* “Hủy”
* “Tạo Form”

After creation:
Show toast:
“Tạo Form đăng ký thành công”
Update left panel state to:
“Form đăng ký — Đã cấu hình”
Update Landing Page preview to show real form fields.

==================================================
LEFT PANEL — KHO VÉ SOURCE
==========================

Create a data source card:

Title:
“Kho vé”

If no Kho vé exists:
Status:
“Chưa có Kho vé”

Description:
“Kho vé dùng để thiết lập hạng vé, số lượng và giá vé.”

Button:
“Tạo Kho vé”

Warning style:
Light orange background, orange border.

If Kho vé exists:
Status:
“Đã cấu hình”

Description:
“3 hạng vé · 2 đang mở · 1 hết vé”

Button:
“Quản lý Kho vé”

Secondary text:
“Dữ liệu vé được lưu tại module Kho vé của sự kiện.”

==================================================
CREATE KHO VÉ DRAWER
====================

When user clicks “Tạo Kho vé”, open a right drawer.

Drawer title:
“Tạo Kho vé”

Subtitle:
“Kho vé sẽ được gắn với sự kiện hiện tại.”

Fields:

1. Tên Kho vé
   Default:
   “Kho vé - NetEvent Demo Conference 2026”

2. Sự kiện liên kết
   Read-only:
   “NetEvent Demo Conference 2026”

3. Mô tả Kho vé
   Placeholder:
   “Mô tả ngắn về kho vé hoặc mục đích sử dụng”

4. Trạng thái Kho vé
   Radio cards:

* “Lưu nháp”
  Subtext: “Chưa kích hoạt”
* “Kích hoạt ngay”
  Subtext: “Cho phép hiển thị các hạng vé đang mở trên Landing Page”

Info box:
“Tạo Kho vé không trừ quota vé. Quota chỉ được tính khi vé được phát hành thật cho người tham dự.”

Footer:

* “Hủy”
* “Tạo Kho vé”

After creation:
Show toast:
“Tạo Kho vé thành công”
Then immediately show next drawer state:
“Thêm hạng vé đầu tiên”

==================================================
ADD HẠNG VÉ DRAWER
==================

Drawer title:
“Thêm hạng vé”

Subtitle:
“Thiết lập giá, số lượng và trạng thái cho hạng vé.”

Fields:

1. Tên hạng vé
   Placeholder:
   “Ví dụ: Standard, VIP, Early Bird”

2. Mô tả hạng vé
   Placeholder:
   “Mô tả ngắn về hạng vé”

3. Loại vé
   Segmented control:

* Miễn phí
* Trả phí

4. Giá vé
   Input suffix:
   “đ”
   Disabled if “Miễn phí”
   Required and must be greater than 0 if “Trả phí”

5. Số lượng vé
   Placeholder:
   “Nhập số lượng vé”

6. Giới hạn mỗi người
   Default:
   “1”

7. Thời gian đăng ký

* Ngày giờ mở đăng ký
* Ngày giờ đóng đăng ký
* Checkbox: “Không giới hạn thời gian đăng ký”

8. Hiển thị trên Landing Page
   Toggle:
   “Hiển thị hạng vé này trên Landing Page”

9. Trạng thái
   Radio cards:

* “Lưu nháp”
* “Mở đăng ký ngay”

Preview block:
Title:
“Preview trên Landing Page”

Ticket card preview:

* Hạng vé name
* Price
* Remaining quantity
* CTA: “Chọn vé”

Footer:

* “Hủy”
* “Lưu hạng vé”
* Secondary: “Lưu & thêm hạng vé khác”

Validation messages:

* “Tên hạng vé không được để trống.”
* “Giá vé trả phí phải lớn hơn 0.”
* “Số lượng vé phải lớn hơn 0.”
* “Thời gian đóng đăng ký phải sau thời gian mở đăng ký.”

After saving:
Show toast:
“Thêm hạng vé thành công”
Update Landing Page registration block.

==================================================
LANDING PAGE PREVIEW — DATA STATES
==================================

The preview must reflect actual data state.

CASE 1 — No Form, no Kho vé:
In registration block, show placeholder:

Title:
“Đăng ký tham gia”

Message:
“Chưa có Form đăng ký.”

Description:
“Tạo form để thu thông tin người tham dự.”

Button:
“Tạo Form đăng ký”

If selected registration mode requires tickets, also show:

Message:
“Chưa có Kho vé.”

Description:
“Tạo kho vé để thiết lập các hạng vé hiển thị trên Landing Page.”

Button:
“Tạo Kho vé”

Do not show fake ticket tiers or fake input fields.

---

CASE 2 — Form exists, no Kho vé, mode = Chỉ Form:
Show real default form fields:

Title:
“Đăng ký tham gia”

Description:
“Điền thông tin bên dưới để nhận vé QR tham dự sự kiện.”

Fields:

* Họ và tên
* Email
* Số điện thoại

Button:
“Đăng ký ngay”

Data source label:
“Fields từ Form đăng ký của sự kiện”

---

CASE 3 — Form exists, Kho vé exists, mode = Nhiều hạng vé + Form:
Show ticket tiers from Kho vé:

Title:
“Đăng ký tham gia”

Section:
“Chọn hạng vé”

Ticket tier cards:

1. Standard
   Price:
   “Miễn phí”
   Remaining:
   “Còn 120 vé”
   Button:
   “Chọn vé”

2. VIP
   Price:
   “499.000đ”
   Remaining:
   “Còn 28 vé”
   Button:
   “Chọn vé”

3. Early Bird
   Price:
   “299.000đ”
   Remaining:
   “Hết vé”
   Button disabled:
   “Hết vé”

Selected ticket state:

* Orange border
* Light orange background
* Text: “Đã chọn”

Then show form:
Title:
“Thông tin người tham dự”

Fields:

* Họ và tên
* Email
* Số điện thoại
* Công ty / Tổ chức if configured

Button:
“Đăng ký ngay”

Data source labels:
“Dữ liệu vé từ Kho vé”
“Fields từ Form đăng ký”

---

CASE 4 — Registration closed:
Show:
“Sự kiện đã đóng đăng ký.”

Disable button:
“Đã đóng đăng ký”

---

CASE 5 — Sold out:
Show:
“Tất cả hạng vé đã hết.”

Disable button:
“Hết vé”

==================================================
PUBLISH CHECKLIST
=================

In left panel group “Điều kiện Publish”, show checklist:

* Thông tin sự kiện đầy đủ
* Landing Page có cover hoặc theme
* Form đăng ký đã cấu hình nếu bật đăng ký
* Kho vé đã cấu hình nếu chọn mode vé + form
* Có ít nhất 1 hạng vé đang mở nếu chọn mode nhiều hạng vé
* URL Landing hợp lệ

If missing required data, show warning near Publish button:
“Chưa thể Publish Landing Page vì còn thiếu cấu hình bắt buộc.”

Click Publish:
Open modal:
“Kiểm tra trước khi Publish”

If not ready:
Show missing items:

* “Chưa có Form đăng ký”
* “Chưa có Kho vé”
* “Chưa có hạng vé đang mở”

Primary button disabled:
“Chưa thể Publish”

If ready:
Primary button:
“Publish Landing Page”

Success toast:
“Landing Page đã được Publish”

==================================================
IMPORTANT UX FIXES
==================

Fix current screen issues:

* Do not show Standard/VIP ticket cards if Kho vé does not exist.
* Do not show real form fields if Form đăng ký does not exist.
* Replace fake data with clear empty states and CTA.
* Allow quick setup from Landing Page Editor, but save data to Form đăng ký and Kho vé modules.
* Make data source status clear in left panel.
* Make registration mode clear.
* Make Publish validation strict and understandable.
* Keep Landing Page simple and Luma-inspired.
* Registration block should stay above the fold.
* Admin can customize visual style and section visibility.
* Admin cannot directly edit ticket quantity or form fields inline on the landing page canvas.
* To edit Form fields, open Form drawer/module.
* To edit Hạng vé, open Kho vé drawer/module.

==================================================
FINAL FLOW
==========

User opens Landing Page Editor
→ Chooses Registration Mode
→ If no Form: clicks “Tạo Form”
→ System creates default form with Họ tên, Email, Số điện thoại
→ If registration mode needs tickets: user clicks “Tạo Kho vé”
→ System creates Kho vé linked to event
→ User adds multiple Hạng vé
→ Each Hạng vé has its own price and quantity
→ Hạng vé with “Hiển thị Landing Page” appears in registration block
→ User previews landing page
→ User publishes landing page when all required conditions are completed
