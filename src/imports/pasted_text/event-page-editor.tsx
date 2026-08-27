Redesign the current NetEvent “Tùy chỉnh Trang sự kiện” editor screen.

Use Vietnamese for all UI copy, labels, buttons, helper text, section titles, validation messages, publish conditions, tooltips, and preview content.

Product context:
NetEvent is an event management platform. Each event has a public event page where attendees can view event information, register, choose ticket tiers if enabled, and receive a QR ticket automatically after successful registration.

MVP logic:

* Form đăng ký is no longer a separate module in the checklist.
* Registration form belongs inside “Trang sự kiện”.
* Confirmation email does not need separate configuration in MVP.
* The system automatically sends a confirmation email with QR code after successful registration.
* Kho vé is only required if the event uses ticket tier registration mode.
* If the event uses simple registration mode, Kho vé is not required.
* “Giới thiệu sự kiện” must be editable inside the event page editor.

Current issue to fix:

* The left panel is selecting “Chỉ Form đăng ký”, but the preview still shows ticket tiers.
* “Giới thiệu sự kiện” appears in preview but there is no clear place to edit it.
* Publish conditions still treat “Form đăng ký” as a separate module.
* Email confirmation should not appear as a separate configuration step.

==================================================
SCREEN STRUCTURE
================

Keep the current screen structure:

Top:

* Event breadcrumb
* Event title
* Status badge: “Bản nháp”
* Tabs: Tổng quan, Trang sự kiện, Kho vé, Người tham dự, Check-in
* Top actions: Tùy chỉnh, Xem trước, Xóa, Lưu, Xuất bản

Main layout:

* Left configuration panel
* Right live preview canvas

Active tab:
“Trang sự kiện”

==================================================
LEFT PANEL STRUCTURE
====================

Rename panel title:
“Tùy chỉnh trang sự kiện”

Description:
“Quản lý giao diện, nội dung hiển thị và cách người tham dự đăng ký.”

Organize the left panel into these groups:

1. GIAO DIỆN
2. NỘI DUNG TRANG
3. ĐĂNG KÝ
4. ĐIỀU KIỆN XUẤT BẢN
5. TRẠNG THÁI LƯU

==================================================
GROUP 1 — GIAO DIỆN
===================

Fields:

1. “Tải ảnh cover”
   Upload area.

2. “Kiểu nền”
   Dropdown options:

* Gradient nhẹ
* Nền sáng
* Nền tối
* Theo ảnh cover

3. “Font hiển thị”
   Dropdown:

* Be Vietnam Pro
* Inter
* System Font

==================================================
GROUP 2 — NỘI DUNG TRANG
========================

Create editable content section cards.

Each row should have:

* Section name
* Toggle on/off
* Status
* Action button

Rows:

1. “Thông tin sự kiện”
   Status:
   “Lấy từ thông tin sự kiện”

Action:
“Chỉnh sửa”

Subtext:
“Tên sự kiện, thời gian, địa điểm và đơn vị tổ chức.”

2. “Giới thiệu sự kiện”
   Status when empty:
   “Chưa có nội dung”

Action when empty:
“Viết nội dung”

Status when filled:
“Đã có nội dung”

Action when filled:
“Chỉnh sửa”

Subtext:
“Mô tả sự kiện, điểm nổi bật hoặc agenda.”

3. “Đơn vị tổ chức”
   Status:
   “Đang hiển thị”

Action:
“Chỉnh sửa”

4. “Địa điểm / Bản đồ”
   Status:
   “Đang hiển thị”

Action:
“Chỉnh sửa”

5. “Footer”
   Status:
   “Đang hiển thị”

Action:
“Chỉnh sửa”

Important:
“Giới thiệu sự kiện” must have a clear edit action. Do not only show a toggle.

==================================================
DRAWER — CHỈNH SỬA GIỚI THIỆU SỰ KIỆN
=====================================

When clicking “Viết nội dung” or “Chỉnh sửa” on “Giới thiệu sự kiện”, open a right drawer or modal.

Drawer title:
“Chỉnh sửa giới thiệu sự kiện”

Fields:

1. “Tiêu đề section”
   Default value:
   “Giới thiệu sự kiện”

2. “Mô tả sự kiện”
   Textarea content:
   “NetEvent Demo Conference 2026 là sự kiện dành cho các đội ngũ tổ chức sự kiện, marketing, vận hành và công nghệ. Chương trình tập trung vào cách xây dựng trải nghiệm sự kiện hiệu quả, quản lý đăng ký, phát hành vé QR và tối ưu quy trình check-in.”

3. “Điểm nổi bật”
   List editor:

* Xu hướng tổ chức sự kiện hiện đại
* Tối ưu quy trình đăng ký và check-in
* Kết nối cộng đồng làm sản phẩm và marketing
* Ứng dụng công nghệ trong vận hành sự kiện

Button:
“+ Thêm ý”

Footer:

* “Hủy”
* Primary: “Lưu nội dung”

Success toast:
“Đã cập nhật giới thiệu sự kiện.”

==================================================
GROUP 3 — ĐĂNG KÝ
=================

Rename “Chế độ đăng ký”.

Use these registration mode options:

1. “Chỉ đăng ký nhận QR”
   Description:
   “Người tham dự điền form và nhận mã QR qua email.”

2. “Đăng ký theo hạng vé”
   Description:
   “Người tham dự chọn hạng vé trước khi điền form.”

Important:
Do not use the label “Chỉ Form đăng ký”.
Use “Chỉ đăng ký nhận QR” instead.

==================================================
MODE 1 — CHỈ ĐĂNG KÝ NHẬN QR
============================

If mode = “Chỉ đăng ký nhận QR”:

Left panel should show:

Card title:
“Form đăng ký”

Status:
“Đã sẵn sàng”

Subtext:
“Form mặc định gồm Họ và tên, Email, Số điện thoại.”

Action:
“Chỉnh sửa field”

Info note:
“Email xác nhận kèm mã QR sẽ được gửi tự động sau khi đăng ký thành công.”

Do not show Kho vé warning.
Do not require ticket inventory.
Do not show ticket tiers in preview.

Preview registration card should show:

Title:
“Đăng ký tham gia”

Subtitle:
“Điền thông tin để nhận mã QR tham dự sự kiện.”

CTA:
“Tiếp tục đăng ký”

Helper:
“Bạn sẽ điền thông tin đăng ký ở bước tiếp theo.”

No ticket tier list should be displayed.

==================================================
MODE 2 — ĐĂNG KÝ THEO HẠNG VÉ
=============================

If mode = “Đăng ký theo hạng vé”:

Left panel should show:

Card title:
“Kho vé”

If not configured:
Status:
“Chưa cấu hình”

Subtext:
“Cần tạo kho vé và ít nhất 1 hạng vé đang mở.”

Action:
“Tạo kho vé”

If configured:
Status:
“Đã cấu hình”

Subtext:
“3 hạng vé · 2 đang mở · 1 đã hết vé”

Action:
“Chỉnh sửa kho vé”

Preview registration card should show ticket tiers:

Title:
“Đăng ký tham gia”

Subtitle:
“Chọn hạng vé phù hợp với bạn.”

Ticket tiers:

1. Standard
   Price: “Miễn phí”
   Description:
   “Vé tham dự cơ bản. Bao gồm tài liệu sự kiện và tea-break.”
   Availability:
   “Còn 120 vé”

2. VIP
   Price: “499.000đ”
   Description:
   “Ưu tiên chỗ ngồi, networking riêng và quà tặng đặc biệt.”
   Availability:
   “Còn 28 vé”

3. Early Bird
   Price: “299.000đ”
   Status:
   “Hết vé”
   Disabled style

CTA:
“Tiếp tục đăng ký”

Helper:
“Bạn sẽ điền thông tin đăng ký ở bước tiếp theo.”

==================================================
GROUP 4 — ĐIỀU KIỆN XUẤT BẢN
============================

Publish conditions must be dynamic based on registration mode.

Title:
“Điều kiện xuất bản”

==================================================
PUBLISH CONDITIONS — MODE 1
CHỈ ĐĂNG KÝ NHẬN QR
===================

Show this list:

1. “Thông tin sự kiện đầy đủ”
   Status: completed

2. “Trang sự kiện đã tạo”
   Status: completed

3. “Block đăng ký đã bật”
   Status: completed

4. “Field đăng ký mặc định đã sẵn sàng”
   Status: completed

5. “URL trang hợp lệ”
   Status: completed

Do not show:

* “Kho vé đã cấu hình”
* “Có ít nhất 1 hạng vé đang mở”
* “Email xác nhận đã cấu hình”

Bottom note:
“Email QR sẽ được gửi tự động sau khi đăng ký thành công.”

If all conditions are complete:
Message:
“Có thể xuất bản sự kiện.”

==================================================
PUBLISH CONDITIONS — MODE 2
ĐĂNG KÝ THEO HẠNG VÉ
====================

Show this list:

1. “Thông tin sự kiện đầy đủ”
   Status: completed

2. “Trang sự kiện đã tạo”
   Status: completed

3. “Block đăng ký đã bật”
   Status: completed

4. “Kho vé đã cấu hình”
   Status: incomplete if no ticket inventory exists

5. “Có ít nhất 1 hạng vé đang mở”
   Status: incomplete if no active ticket tier exists

6. “URL trang hợp lệ”
   Status: completed

Do not show:

* “Form đăng ký đã cấu hình” as a separate module
* “Email xác nhận đã cấu hình”

Bottom note:
“Email QR sẽ được gửi tự động sau khi đăng ký thành công.”

If missing required ticket setup:
Message:
“Chưa thể publish vì còn thiếu cấu hình bắt buộc.”

==================================================
GROUP 5 — TRẠNG THÁI LƯU
========================

Show autosave status:

“Đã lưu tự động”

or

“Đang lưu…”

or

“Có thay đổi chưa lưu”

==================================================
RIGHT PREVIEW CANVAS
====================

Keep Luma-inspired layout:

* Left column: poster, organizer, share
* Right column: event info, registration card, about event, location
* About event and location must stay inside the right column, not full-width sections.

Preview content order in right column:

1. Status badge
2. Event title
3. Short description
4. Date/time/location meta
5. Registration card
6. Giới thiệu sự kiện
7. Địa điểm / Bản đồ

Important:
When mode = “Chỉ đăng ký nhận QR”, registration preview must not show ticket tiers.

When mode = “Đăng ký theo hạng vé”, registration preview must show ticket tiers.

==================================================
TOP PUBLISH BUTTON LOGIC
========================

Button:
“Xuất bản”

If publish conditions are incomplete:

* Disable button
* Tooltip:
  “Hoàn tất điều kiện xuất bản trước khi publish.”

If publish conditions are complete:

* Enable button
* On click, show confirmation modal.

Publish confirmation modal:
Title:
“Xuất bản sự kiện?”

Description:
“Sự kiện sẽ được public và người tham dự có thể đăng ký qua trang sự kiện.”

Buttons:

* “Hủy”
* Primary: “Xuất bản”

==================================================
IMPORTANT UX RULES
==================

* Do not show ticket tiers when registration mode is “Chỉ đăng ký nhận QR”.
* Do not require Kho vé when registration mode is “Chỉ đăng ký nhận QR”.
* Do not show “Form đăng ký” as a separate publish condition.
* Do not show “Email xác nhận” as a separate publish condition.
* Email QR is automatic in MVP.
* “Giới thiệu sự kiện” must have an explicit edit flow.
* “Giới thiệu sự kiện” should not block publish if empty, but if the section is enabled and empty, show warning:
  “Giới thiệu sự kiện đang bật nhưng chưa có nội dung.”
* Keep all event page editing inside the “Trang sự kiện” tab.
* Keep the UI simple for MVP.
* Reduce module complexity.
