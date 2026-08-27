Redesign the NetEvent Event Workspace tab “Người tham dự”.

Use Vietnamese for all UI copy, labels, buttons, helper text, status badges, table columns, empty states, and validation messages.

Product context:
NetEvent is an event management platform. Attendee data is created only after an event is published and people register through the public Landing Page. Each successful registration creates an attendee record and may issue a ticket QR depending on the event setup.

Important logic:

* The “Người tham dự” tab should not show fake attendee data.
* This tab only has real data after the event is published and at least one person has registered.
* If the event is still Draft, show an empty state explaining that attendee data will appear after Publish.
* If the event is Published but has no registrations, show a different empty state with actions to share the Landing Page.
* If the event has registrations, show statistics, filters, attendee table, and attendee detail drawer.
* Do not merge this tab with Check-in. “Người tham dự” is for registration data. “Check-in” is for event operation.

Design style:

* Modern B2B SaaS dashboard
* Clean light background
* Rounded cards
* Subtle borders and shadows
* Primary color: #FF8644
* Blue for active states
* Green for success/check-in
* Orange for warning
* Red/gray for invalid/cancelled
* Font: Inter or Be Vietnam Pro
* Desktop width: 1440px

==================================================
TAB STRUCTURE
=============

Inside Event Workspace, create these tabs:

* Tổng quan
* Landing Page
* Form đăng ký
* Kho vé
* Người tham dự
* Check-in
* Email
* Báo cáo
* Cài đặt

Active tab:
“Người tham dự”

Page title:
“Người tham dự”

Subtitle:
“Quản lý danh sách đăng ký, hạng vé và trạng thái check-in của sự kiện.”

Show event context:

* Event name: “NetEvent Demo Conference 2026”
* Event status badge
* Event date
* Landing Page URL if published

==================================================
STATE 1 — EVENT IS DRAFT
========================

Condition:
event_status = Draft

Do not show attendee stats or table.

Show empty state card:

Title:
“Chưa có người tham dự”

Description:
“Danh sách người tham dự sẽ xuất hiện sau khi sự kiện được Publish và có người đăng ký qua Landing Page.”

Checklist:

* Landing Page
* Form đăng ký
* Kho vé nếu sự kiện có vé
* Publish sự kiện

Primary CTA:
“Kiểm tra điều kiện Publish”

Secondary CTA:
“Quay lại Tổng quan”

Helper text:
“Bản nháp chưa thể nhận đăng ký công khai.”

==================================================
STATE 2 — EVENT PUBLISHED BUT NO REGISTRATIONS
==============================================

Condition:
event_status = Published
attendee_count = 0

Show light stats with zero values:

* Tổng người đăng ký: 0
* Vé đã phát hành: 0
* Đã check-in: 0
* Chưa check-in: 0

Show empty state:

Title:
“Chưa có người đăng ký”

Description:
“Sự kiện đã được Publish. Chia sẻ Landing Page để bắt đầu nhận đăng ký.”

Primary CTA:
“Sao chép link Landing Page”

Secondary CTA:
“Xem Landing Page”

Optional CTA:
“Gửi email mời tham dự”

Show Landing Page link card:

* URL: “eventhub.vn/netevent-demo-conference-2026”
* Status: “Đang public”

Do not show full attendee table unless user clicks “Hiển thị bảng trống”.

==================================================
STATE 3 — EVENT HAS REGISTRATIONS
=================================

Condition:
attendee_count > 0

Show stat cards:

1. “Tổng người đăng ký”
   Value: “328”

2. “Vé đã phát hành”
   Value: “328”

3. “Đã check-in”
   Value: “138”

4. “Chưa check-in”
   Value: “190”

5. “Tỷ lệ check-in”
   Value: “42%”

Add calculation helper:
“Tỷ lệ check-in = số người đã check-in / tổng vé đã phát hành.”

==================================================
FILTERS
=======

Show filter bar:

Search input:
“Tìm theo tên, email, SĐT hoặc mã vé”

Dropdown:
“Tất cả hạng vé”

Dropdown:
“Tất cả trạng thái vé”

Dropdown:
“Tất cả trạng thái check-in”

Date filter:
“Ngày đăng ký”

Quick filters:

* Tất cả
* Chưa check-in
* Đã check-in
* Vé lỗi
* Đã hủy

Actions:

* “Export CSV”
* “Gửi lại vé QR”
* “Thêm người tham dự”

==================================================
ATTENDEE TABLE
==============

Table title:
“Danh sách người tham dự”

Table columns:

* Người tham dự
* Số điện thoại
* Hạng vé
* Giá vé
* Mã vé
* Trạng thái vé
* Check-in
* Thời gian đăng ký
* Hành động

Rows:

Row 1:
Người tham dự: “Nguyễn Văn A — [nguyenvana@gmail.com](mailto:nguyenvana@gmail.com)”
Số điện thoại: “098xxxxxxx”
Hạng vé: “VIP”
Giá vé: “499.000đ”
Mã vé: “VIP-000124”
Trạng thái vé: “Hợp lệ”
Check-in: “Chưa check-in”
Thời gian đăng ký: “30/06/2026 09:30”
Hành động: “Xem”, “Check-in”

Row 2:
Người tham dự: “Trần Minh B — [tranminhb@gmail.com](mailto:tranminhb@gmail.com)”
Số điện thoại: “097xxxxxxx”
Hạng vé: “Standard”
Giá vé: “Miễn phí”
Mã vé: “STD-000087”
Trạng thái vé: “Hợp lệ”
Check-in: “Đã check-in”
Thời gian đăng ký: “30/06/2026 10:15”
Hành động: “Xem”

Row 3:
Người tham dự: “Lê Hoàng C — [lehoangc@gmail.com](mailto:lehoangc@gmail.com)”
Số điện thoại: “096xxxxxxx”
Hạng vé: “Early Bird”
Giá vé: “299.000đ”
Mã vé: “EB-000045”
Trạng thái vé: “Hợp lệ”
Check-in: “Chưa check-in”
Thời gian đăng ký: “29/06/2026 16:20”
Hành động: “Xem”, “Check-in”

==================================================
ATTENDEE DETAIL DRAWER
======================

When clicking “Xem”, open right drawer.

Drawer title:
“Chi tiết người tham dự”

Sections:

1. “Thông tin cá nhân”

* Họ và tên
* Email
* Số điện thoại
* Công ty / Tổ chức
* Chức danh

2. “Thông tin vé”

* Hạng vé
* Giá vé
* Mã vé
* Trạng thái vé
* QR Code

3. “Check-in”
   If not checked in:

* Status: “Chưa check-in”
* Button: “Check-in”

If checked in:

* Status: “Đã check-in”
* Time: “08:45, 01/07/2026”
* Staff: “Nguyễn Staff”

4. “Lịch sử thao tác”

* Đăng ký thành công
* Gửi email vé
* Check-in nếu có

Drawer actions:

* “Check-in”
* “Gửi lại vé QR”
* “Hủy vé”

==================================================
TICKET TIER BREAKDOWN
=====================

Add optional section or side card:
“Theo hạng vé”

Cards:

1. Standard

* Giá: Miễn phí
* Đã đăng ký: 180
* Đã check-in: 80
* Còn lại: 120

2. VIP

* Giá: 499.000đ
* Đã đăng ký: 72
* Đã check-in: 45
* Còn lại: 28

3. Early Bird

* Giá: 299.000đ
* Đã đăng ký: 76
* Đã check-in: 13
* Còn lại: 74

Clicking a ticket tier card should filter the attendee table by that ticket tier.

==================================================
IMPORTANT UX RULES
==================

* Do not show attendee data before the event is published.
* Do not show fake rows in Draft state.
* Use empty states to explain why there is no data.
* If Published but no registration, focus on sharing Landing Page.
* If there are registrations, show stats, filters, table, and detail drawer.
* Keep Check-in as a separate operational tab.
* “Người tham dự” manages registration records.
* “Check-in” handles QR scanning and onsite operations.
