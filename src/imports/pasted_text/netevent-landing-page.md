Create a high-fidelity NetEvent Basic Landing Page template inspired by Luma’s clean event landing page layout, but adapted to NetEvent’s event registration and ticketing flow.

Use Vietnamese for all UI copy, labels, buttons, helper text, form fields, status badges, empty states, and validation messages.

Important:
Do not copy Luma exactly. Use the same UX direction: simple, minimal, event-first, clear registration area, strong event poster, clean two-column layout, soft background, and easy customization.

Product context:
NetEvent is a self-service event management platform. Each event can have:

* Basic event information
* A landing page
* A registration form
* A ticket inventory called “Kho vé”
* Multiple ticket tiers called “Hạng vé”
* QR ticket generation after successful registration
* Check-in / Check-out for event staff

Landing page logic:

* Landing Page belongs to exactly one event.
* Landing Page displays event information.
* Registration Form data comes from the event’s Form đăng ký.
* Ticket tiers come from the event’s Kho vé.
* Landing Page does not create or edit form fields directly.
* Landing Page does not create or edit ticket tiers directly.
* Admin can customize visual style and section visibility per event.
* The template must support free registration, single paid ticket, and multiple ticket tiers.

Design style:

* Luma-inspired minimal event landing page
* Soft gradient or warm neutral background
* Large whitespace
* Rounded cards
* Subtle shadows
* Clean typography
* Event poster as a strong visual anchor
* Primary color: #FF8644
* Use neutral text: #0F172A, #64748B
* Use green for available tickets
* Use red/gray for sold out
* Font: Inter or Be Vietnam Pro
* Desktop width: 1440px
* Responsive structure for mobile

==================================================
SCREEN 1 — BASIC EVENT LANDING PAGE
===================================

Create a public event landing page.

Layout:
Two-column layout on desktop.

Left column:

* Large event poster / cover image
* Manage access box if current user is admin
* Host / Organizer block
* Contact host link

Right column:

* Event title
* Date and time
* Location or online link
* Registration block
* Event description
* Location / map section
* Footer

==================================================
HEADER / HERO SECTION
=====================

Left:
Large poster card:
Use a bold event poster placeholder.
Card size around 360x360.
Rounded corners: 20px.
Subtle shadow.

Below poster, show admin access box if current user has manage permission:
Text:
“Bạn có quyền quản lý sự kiện này.”

Button:
“Quản lý”

Host block:
Title:
“Đơn vị tổ chức”

Host name:
“NetSpace”

Host contact:
“Liên hệ ban tổ chức”

Right:
Event title:
“NetEvent Demo Conference 2026”

Date/time card:

* “Thứ Tư, 01 Tháng 7”
* “16:30 - 17:30”
* “GMT+7”

Location card:

* “NetSpace — Công ty Công nghệ & Truyền thông”
* “Kim Liên, Hà Nội”
* External link icon

Event status badge:
“Đang mở đăng ký”

CTA button:
“Đăng ký ngay”

==================================================
REGISTRATION BLOCK — MAIN COMPONENT
===================================

Create one reusable registration block with three possible modes:

Mode 1:
Free registration form only

Mode 2:
Single ticket + form

Mode 3:
Multiple ticket tiers + form

The block should be placed above the fold, like Luma’s registration card.

Card title:
“Đăng ký tham gia”

Description:
“Điền thông tin bên dưới để nhận vé QR tham dự sự kiện.”

==================================================
MODE 1 — FREE REGISTRATION
==========================

Use this when event has no paid ticket tiers or only free registration.

Show form fields:

* Họ và tên
* Email
* Số điện thoại
* Công ty / Tổ chức
* Chức danh — optional

Checkbox:
“Tôi đồng ý nhận thông tin từ ban tổ chức.”

Button:
“Hoàn tất đăng ký”

Helper text:
“Sau khi đăng ký thành công, vé QR sẽ được gửi về email của bạn.”

==================================================
MODE 2 — SINGLE PAID TICKET
===========================

Show ticket summary first:

Ticket card:
Title:
“Vé tham dự”

Ticket name:
“Standard”

Price:
“499.000đ”

Remaining:
“Còn 120 vé”

Button:
“Chọn vé”

After selected, show selected state:
“Đã chọn: Standard — 499.000đ”

Then show form:

* Họ và tên
* Email
* Số điện thoại
* Công ty / Tổ chức

Button:
“Tiếp tục đăng ký”

If online payment is not ready in MVP, show helper:
“Thanh toán online sẽ được cấu hình ở giai đoạn sau. Hiện tại hệ thống ghi nhận đăng ký và phát hành vé theo cấu hình sự kiện.”

==================================================
MODE 3 — MULTIPLE TICKET TIERS
==============================

Show section title:
“Chọn hạng vé”

Show ticket tier cards in a clean grid/list.

Ticket tier 1:
Name:
“Standard”

Type:
“Miễn phí”

Description:
“Vé tham dự cơ bản”

Remaining:
“Còn 120 vé”

Button:
“Chọn vé”

Ticket tier 2:
Name:
“VIP”

Price:
“499.000đ”

Description:
“Quyền lợi ưu tiên, khu vực check-in riêng”

Remaining:
“Còn 28 vé”

Button:
“Chọn vé”

Ticket tier 3:
Name:
“Early Bird”

Price:
“299.000đ”

Description:
“Ưu đãi cho người đăng ký sớm”

Remaining:
“Hết vé”

Button disabled:
“Hết vé”

Selected ticket state:

* Orange border
* Light orange background
* Check icon
* Text: “Đã chọn”

After user selects a ticket tier, show registration form below.

Form title:
“Thông tin người tham dự”

Fields:

* Họ và tên
* Email
* Số điện thoại
* Công ty / Tổ chức
* Chức danh — optional
* Ghi chú — optional

Button:
“Hoàn tất đăng ký”

Helper:
“Vé QR sẽ được gửi đến email sau khi đăng ký thành công.”

==================================================
EVENT DESCRIPTION SECTION
=========================

Section title:
“Giới thiệu sự kiện”

Content example:
“NetEvent Demo Conference 2026 là sự kiện dành cho doanh nghiệp, đội ngũ marketing, vận hành sự kiện và các đơn vị đang tìm kiếm giải pháp số hóa quy trình tổ chức event.”

Add bullet list:

* Cập nhật xu hướng tổ chức sự kiện số
* Trải nghiệm đăng ký và check-in bằng QR
* Kết nối với cộng đồng chuyên gia và doanh nghiệp
* Demo quy trình tạo sự kiện trên NetEvent

==================================================
LOCATION / MAP SECTION
======================

If event is Offline or Hybrid, show:

Section title:
“Địa điểm”

Location:
“NetSpace — Công ty Công nghệ & Truyền thông”

Address:
“Tòa nhà MIPEC, 229 P. Tây Sơn, Kim Liên, Hà Nội”

Map placeholder:
Google Map style embedded card

Button:
“Xem bản đồ”

If event is Online, replace map with:

Section title:
“Tham gia online”

Text:
“Link tham gia sẽ được gửi đến email sau khi đăng ký thành công.”

==================================================
SUCCESS STATE AFTER REGISTRATION
================================

Create success state screen or modal.

Title:
“Đăng ký thành công”

Description:
“Vé QR đã được tạo và gửi đến email của bạn.”

Show ticket summary:

* Tên sự kiện
* Hạng vé
* Mã vé
* Thời gian
* Địa điểm / Link online

Show QR placeholder.

Buttons:

* “Tải vé”
* “Thêm vào lịch”
* “Quay lại trang sự kiện”

==================================================
CLOSED / SOLD OUT STATES
========================

If registration is closed:
Show message:
“Sự kiện đã đóng đăng ký.”

Button disabled:
“Đã đóng đăng ký”

If all tickets are sold out:
Show message:
“Tất cả hạng vé đã hết.”

Button disabled:
“Hết vé”

If event ended:
Show message:
“Sự kiện đã kết thúc.”

CTA:
“Xem sự kiện khác”

==================================================
ADMIN CUSTOMIZATION PANEL
=========================

Create an admin customization side drawer for this basic landing page.

Drawer title:
“Tùy chỉnh Landing Page”

Sections:

1. “Giao diện”
   Controls:

* Ảnh cover
* Theme: Minimal / Gradient / Conference / Workshop / Product Launch
* Màu chủ đạo
* Font hiển thị
* Bo góc card
* Kiểu nền: Trắng / Gradient nhẹ / Màu thương hiệu

2. “Nội dung hiển thị”
   Toggle controls:

* Hiển thị mô tả sự kiện
* Hiển thị đơn vị tổ chức
* Hiển thị địa điểm / bản đồ
* Hiển thị FAQ
* Hiển thị footer
* Hiển thị số vé còn lại
* Hiển thị giá vé

3. “Đăng ký”
   Controls:

* CTA button text
  Default:
  “Đăng ký ngay”

* Registration mode:

  * Chỉ form đăng ký
  * Vé + form
  * Nhiều hạng vé + form

Read-only data source:
“Form đăng ký: Lấy từ Form của sự kiện”
“Kho vé: Lấy từ Kho vé của sự kiện”

If no form:
Show warning:
“Sự kiện này chưa có Form đăng ký.”
Button:
“Tạo Form đăng ký”

If no ticket inventory:
Show warning:
“Sự kiện này chưa có Kho vé.”
Button:
“Tạo Kho vé”

Footer buttons:

* “Hủy”
* “Lưu thay đổi”
* Primary: “Preview”

==================================================
IMPORTANT UX RULES
==================

Keep the public landing page very simple:

* Do not overload with too many sections.
* Registration block must be above the fold.
* Event poster should be visually strong.
* Date, time, and location must be easy to scan.
* Ticket selection must be clear before showing the form.
* Sold-out ticket tiers must be disabled.
* Form should only ask for basic user information in MVP.

Keep NetEvent data logic:

* Landing Page displays data from Event.
* Form fields come from Form đăng ký.
* Ticket tiers come from Kho vé.
* Admin customizes layout, theme, visibility, and CTA text only.
* Admin does not edit ticket quantity or form fields directly on the landing page.
* To edit ticket tiers, user must go to Kho vé.
* To edit form fields, user must go to Form đăng ký.

Final attendee flow:
User opens landing page
→ Views event info
→ Selects ticket tier if available
→ Fills basic registration form
→ Submits registration
→ System validates ticket availability
→ System creates attendee
→ System issues ticket code and QR
→ System sends confirmation email
→ User sees success state
