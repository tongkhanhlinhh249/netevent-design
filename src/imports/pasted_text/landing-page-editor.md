Improve the current NetEvent Landing Page customization screen.

Use Vietnamese for all UI copy, labels, buttons, helper text, tooltips, badges, and empty states.

Current issue:
The current screen has a left customization panel and a landing page preview on the right. However, users want to edit content directly on the landing page preview instead of editing every field from the left panel.

Redesign the experience into an inline landing page editor:

* The landing page preview should become an editable canvas.
* Users can click directly on each field or section to edit it.
* The left panel should only control global settings, theme, section visibility, and data source status.
* Do not put all editable content fields in the left panel.

Product context:
NetEvent is an event management platform. Each event has a landing page. The landing page displays:

* Event cover
* Event name
* Date and time
* Location or online link
* Organizer
* Registration block
* Ticket tiers from Kho vé
* Registration form from Form đăng ký

Important business rules:

* Landing Page displays event data.
* Form fields come from the event’s Form đăng ký.
* Ticket tiers come from the event’s Kho vé.
* Users can edit display content directly on the landing canvas.
* Users must not edit ticket price, ticket quantity, or form fields directly inside the landing page editor.
* If users want to edit ticket tiers, direct them to Kho vé.
* If users want to edit form fields, direct them to Form đăng ký.
* Landing editor can edit layout, theme, visibility, copy, CTA text, and basic event display content.

Design style:

* Keep current clean NetEvent style
* Light background
* Rounded cards
* Subtle shadows
* Primary color: #FF8644
* Blue can be used for selected editable states
* Green for active registration status
* Font: Inter or Be Vietnam Pro
* Desktop layout: 1440px

==================================================
TOP BAR
=======

Keep top bar but improve clarity.

Left side:

* Status badge: “Bản nháp”
* URL: “netevent.vn/e/netevent-demo-conference”

Right side actions:

* “Tùy chỉnh”
* “Preview”
* “Xóa”
* Primary button: “Publish”

Add autosave indicator:
“Đã lưu tự động”

==================================================
LEFT PANEL — GLOBAL SETTINGS ONLY
=================================

Rename panel title:
“Tùy chỉnh Landing Page”

Subtitle:
“Quản lý giao diện, section và nguồn dữ liệu.”

The left panel should no longer contain all editable content fields.

Left panel sections:

1. “Giao diện”
   Controls:

* Tải ảnh cover
* Kiểu nền: Trắng / Gradient nhẹ / Màu thương hiệu
* Màu chủ đạo
* Font hiển thị
* Bo góc card

2. “Section hiển thị”
   Toggle list:

* Cover sự kiện
* Thông tin sự kiện
* Đơn vị tổ chức
* Đăng ký tham gia
* Vé tham dự
* Form đăng ký
* Địa điểm / Bản đồ
* Footer

3. “Nguồn dữ liệu”
   Show read-only source cards:

* Form đăng ký: “Lấy từ Form của sự kiện”
* Vé tham dự: “Lấy từ Kho vé của sự kiện”

If no form:
Show warning card:
“Sự kiện này chưa có Form đăng ký.”
Button: “Tạo Form”

If no ticket inventory:
Show warning card:
“Sự kiện này chưa có Kho vé.”
Button: “Tạo Kho vé”

4. “Chế độ đăng ký”
   Dropdown:

* Chỉ form đăng ký
* Một hạng vé + form
* Nhiều hạng vé + form

Important:
Do not place event title, date, location, CTA text, or organizer text only in this left panel. These should be editable directly on the canvas.

==================================================
MAIN CANVAS — INLINE EDITING
============================

The landing page preview should be an editable canvas.

Add helper at top of canvas:
“Click vào nội dung trên trang để chỉnh sửa trực tiếp.”

Use editable states:

* On hover: show light blue outline around editable field/section
* On selected: show blue/orange outline and small floating toolbar
* Toolbar actions: “Chỉnh sửa”, “Ẩn section”, “Nhân bản”, “Xóa” where applicable

==================================================
EDITABLE FIELD BEHAVIOR
=======================

1. Event cover
   When user hovers over cover image:
   Show overlay:
   “Thay ảnh cover”

Click action:
Open upload image modal/drawer.

2. Event title
   Current text:
   “NetEvent Demo Conference 2026”

On click:
Turn into inline text input.
Show floating toolbar:

* Lưu
* Hủy

3. Event date/time card
   Current:
   “Thứ Hai, 29 Tháng 6”
   “16:00 - 20:00 · GMT+7”

On click:
Open right drawer:
“Chỉnh sửa thời gian”

Fields:

* Ngày bắt đầu
* Giờ bắt đầu
* Ngày kết thúc
* Giờ kết thúc
* Múi giờ

4. Location card
   Current:
   “NetSpace — Công ty Công nghệ & Truyền thông”
   “Kim Liên, Hà Nội”

On click:
Open right drawer:
“Chỉnh sửa địa điểm”

Fields:

* Hình thức tổ chức: Offline / Online / Hybrid
* Địa điểm
* Link online
* Ghi chú địa điểm

5. Organizer card
   Current:
   “NetSpace”
   “Liên hệ ban tổ chức”

On click:
Open inline editor or right drawer:
“Chỉnh sửa đơn vị tổ chức”

Fields:

* Tên đơn vị tổ chức
* Email liên hệ
* Hotline
* Website

6. CTA button
   Current:
   “Đăng ký ngay”

On click:
Open small inline popover:

* CTA text
* CTA action: Scroll đến form / Scroll đến vé / Mở popup đăng ký

7. Event description section
   On click:
   Turn into rich text editor.
   Support:

* Heading
* Paragraph
* Bullet list
* Link

8. Map section
   On click:
   Open location drawer.
   Do not edit map directly.

==================================================
NON-EDITABLE BUSINESS DATA SECTIONS
===================================

Ticket tier cards:
These should not be edited directly on landing page.

When user clicks ticket card:
Show small popover:
“Dữ liệu vé được lấy từ Kho vé của sự kiện.”

Actions:

* “Quản lý Kho vé”
* “Ẩn section Vé”
* “Cài đặt hiển thị”

Allowed display settings:

* Hiển thị giá vé
* Hiển thị số vé còn lại
* Hiển thị mô tả hạng vé
* Layout: Card / List

Do not allow:

* Editing ticket price
* Editing ticket quantity
* Editing issued count
* Editing ticket status directly here

Form section:
When user clicks form fields:
Show popover:
“Field form được lấy từ Form đăng ký của sự kiện.”

Actions:

* “Quản lý Form đăng ký”
* “Ẩn section Form”
* “Cài đặt hiển thị”

Allowed display settings:

* Hiển thị tiêu đề form
* Hiển thị mô tả form
* CTA button text
* Form layout: Single column / Two columns

Do not allow:

* Adding form fields directly here
* Removing form fields directly here
* Changing required fields directly here

==================================================
RIGHT DRAWER — CONTEXTUAL EDITING
=================================

When a complex editable section is selected, open a contextual right drawer.

Drawer examples:

Drawer 1:
“Chỉnh sửa thời gian”

Drawer 2:
“Chỉnh sửa địa điểm”

Drawer 3:
“Chỉnh sửa đơn vị tổ chức”

Drawer 4:
“Cài đặt section Vé tham dự”

Drawer 5:
“Cài đặt section Form đăng ký”

Drawer footer:

* Hủy
* Lưu thay đổi

==================================================
CANVAS CONTENT EXAMPLE
======================

Use the current landing preview but make it editable.

Left column:

* Cover gradient card
* Admin manage card
* Organizer card

Right column:

* Status badge: “Đang mở đăng ký”
* Editable event title
* Editable date/time card
* Editable location card
* Registration block

Registration block:
Title:
“Đăng ký tham gia”

Description:
“Điền thông tin bên dưới để nhận vé QR tham dự sự kiện.”

Ticket section:
Title:
“Chọn hạng vé”

Ticket cards:

1. Standard
   Badge: “Miễn phí”
   Description: “Vé tham dự cơ bản”
   Remaining: “Còn 120 vé”

2. VIP
   Price: “499.000đ”
   Description: “Quyền lợi ưu tiên, khu vực check-in riêng”
   Remaining: “Còn 28 vé”

Below selected ticket, show form:

* Họ và tên
* Email
* Số điện thoại
* Công ty / Tổ chức
  Button:
  “Hoàn tất đăng ký”

==================================================
MICROCOPY
=========

Canvas helper:
“Click trực tiếp vào nội dung để chỉnh sửa.”

Ticket source helper:
“Dữ liệu vé được lấy từ Kho vé của sự kiện.”

Form source helper:
“Field form được lấy từ Form đăng ký của sự kiện.”

Unsaved changes:
“Bạn có thay đổi chưa lưu.”

Saved:
“Đã lưu tự động.”

Warning no ticket inventory:
“Sự kiện này chưa có Kho vé. Tạo Kho vé để hiển thị các hạng vé trên Landing Page.”

Warning no form:
“Sự kiện này chưa có Form đăng ký. Tạo Form để thu thông tin người tham dự.”

==================================================
FINAL UX GOAL
=============

The final UX should feel like:

* User edits text and visual content directly on the landing page.
* Left panel controls theme and section visibility only.
* Right drawer appears only when detailed settings are needed.
* Ticket and form data remain connected to Kho vé and Form đăng ký modules.
* The editor feels intuitive, direct, and easy to customize per event.
