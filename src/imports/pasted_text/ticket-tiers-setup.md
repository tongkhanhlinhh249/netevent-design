Improve the current NetEvent “Thiết lập hạng vé” UI and flow.

Use Vietnamese for all UI copy, labels, buttons, helper text, validation messages, status badges, and preview content.

Product context:
NetEvent is an event management platform. Each event has one active ticket inventory called “Kho vé”. Inside one Kho vé, users can create multiple ticket tiers called “Hạng vé”. Each Hạng vé has its own name, type, price, quantity, registration time, visibility on Landing Page, and status.

Important business logic:

* One event can have only one active Kho vé in MVP.
* One Kho vé belongs to exactly one event.
* One Kho vé can contain many Hạng vé.
* Each Hạng vé has its own price and quantity.
* Creating Hạng vé does not consume ticket quota.
* Ticket quota is consumed only when a real ticket is issued to an attendee after successful registration.
* Landing Page does not create ticket data. Landing Page only displays ticket tiers from the event’s Kho vé.
* Only Hạng vé with “Hiển thị Landing Page” enabled and valid status should appear on Landing Page.
* Do not use the word “Voucher”.

Design style:

* Modern B2B SaaS dashboard
* Clean light background
* Rounded cards
* Subtle borders and shadows
* Primary color: #FF8644
* Supporting blue for selected states
* Green for active/available
* Orange for warning/current editing
* Red/gray for sold out/blocked
* Font: Inter or Be Vietnam Pro
* Desktop width: 1440px
* Keep current EventHub style but make the flow clearer and more scalable.

==================================================
SCREEN — THIẾT LẬP HẠNG VÉ
==========================

Page/card title:
“Thiết lập hạng vé”

Subtitle:
“Tạo và quản lý các hạng vé trong Kho vé của sự kiện này.”

Add context row below subtitle:

* “Sự kiện: NetEvent Demo Conference 2026”
* “Kho vé: Kho vé - NetEvent Demo Conference 2026”
* Status badge: “Đang hoạt động”

Top right CTA:
“+ Thêm hạng vé”

Add helper info box:
“Tạo hạng vé không trừ quota vé. Quota chỉ được tính khi vé được phát hành thật cho người tham dự.”

==================================================
TICKET TIER CARD BEHAVIOR
=========================

Use accordion cards for ticket tiers.

Only one Hạng vé card should be expanded at a time.
Other Hạng vé cards should be collapsed summary cards.

Collapsed card should show:

* Number badge
* Hạng vé name
* Type / price
* Quantity
* Issued count if available
* Remaining count if available
* Landing visibility
* Status
* Actions: Duplicate, Delete, Expand

Example collapsed text:
“Standard · Miễn phí · 300 vé · Đang mở · Hiển thị Landing”

Expanded card should show the full form.

Only the expanded card should have orange accent border.
Collapsed cards should use neutral border.

==================================================
EXPANDED HẠNG VÉ FORM
=====================

Fields:

1. “Tên hạng vé”
   Placeholder:
   “Ví dụ: Standard, VIP, Early Bird”
   Required

2. “Mô tả hạng vé”
   Placeholder:
   “Mô tả ngắn về hạng vé”

3. “Loại vé”
   Segmented control:

* “Miễn phí”
* “Trả phí”

4. “Giá vé”
   Input suffix:
   “đ”
   If “Miễn phí” is selected:

* Disable price input
* Show value “0”
  If “Trả phí” is selected:
* Enable price input
* Required
* Must be greater than 0

5. “Số lượng vé”
   Placeholder:
   “Nhập số lượng vé”
   Required

6. “Giới hạn/người”
   Default:
   “1”

7. “Quyền lợi vé”
   Placeholder:
   “Ví dụ: Chỗ ngồi ưu tiên, tài liệu sự kiện, networking”

8. “Thời gian đăng ký”
   Fields:

* Ngày mở
* Giờ mở
* Ngày đóng
* Giờ đóng

Checkbox:
“Không giới hạn thời gian đăng ký”

If checkbox is checked:

* Disable date/time fields
* Make disabled state visually clear

9. “Hiển thị trên Landing Page”
   Toggle:
   “Hiển thị”

Helper:
“Khi bật, hạng vé này có thể xuất hiện trong section Vé tham dự trên Landing Page.”

10. “Trạng thái hạng vé”
    Radio cards:

* “Lưu nháp”
  Subtext: “Chưa hiển thị cho người tham dự”
* “Mở đăng ký ngay”
  Subtext: “Cho phép người tham dự chọn vé”
* “Tạm đóng”
  Subtext: “Tạm ngừng nhận đăng ký hạng vé này”

==================================================
PREVIEW ON LANDING
==================

Inside expanded card, show a preview block.

Title:
“Preview trên Landing Page”

Preview card should look like public landing ticket card.

For free ticket:

* “Standard”
* “Miễn phí”
* “Còn 300 vé”
* Button: “Chọn vé”

For paid ticket:

* “VIP”
* “499.000đ”
* “Còn 100 vé”
* Button: “Chọn vé”

If sold out:

* “Early Bird”
* “299.000đ”
* “Hết vé”
* Disabled button: “Hết vé”

==================================================
SUMMARY PANEL / FOOTER
======================

Add a compact summary bar or right summary panel.

Summary:

* “Số hạng vé: 3”
* “Tổng sức chứa: 550 vé”
* “Đã phát hành: 0 vé”
* “Quota vé còn lại trong gói: 2.514 vé”

Formula helper:
“Tổng sức chứa = tổng số lượng cấu hình của tất cả hạng vé. Quota gói chỉ trừ khi vé được phát hành thật.”

Footer actions:

* “Quay lại”
* “Lưu nháp”
* Primary: “Lưu hạng vé”

If this is part of create Kho vé wizard, primary button:
“Hoàn tất tạo Kho vé”

==================================================
VALIDATION MESSAGES
===================

Use these validation messages:

* “Tên hạng vé không được để trống.”
* “Giá vé trả phí phải lớn hơn 0.”
* “Số lượng vé phải lớn hơn 0.”
* “Thời gian đóng đăng ký phải sau thời gian mở đăng ký.”
* “Mỗi kho vé cần có ít nhất một hạng vé.”
* “Số lượng vé không được nhỏ hơn số vé đã phát hành.”

==================================================
EDIT MODE RULES
===============

When editing an existing Hạng vé that already has issued tickets:
Show warning:
“Hạng vé này đã có vé được phát hành. Một số thay đổi có thể ảnh hưởng đến người tham dự mới.”

Rules:

* User can increase quantity.
* User cannot reduce quantity below issued count.
* If price changes after tickets were issued, show confirmation warning.
* If status changes to “Tạm đóng”, new attendees cannot select this ticket tier.
* If “Hiển thị Landing Page” is turned off, the ticket tier will disappear from public Landing Page.

==================================================
EXAMPLE DATA
============

Create 3 ticket tier accordion cards:

1. Standard
   Type: Miễn phí
   Price: 0đ
   Quantity: 300
   Limit per person: 1
   Landing visibility: On
   Status: Mở đăng ký ngay

2. VIP
   Type: Trả phí
   Price: 499.000đ
   Quantity: 100
   Limit per person: 1
   Landing visibility: On
   Status: Mở đăng ký ngay

3. Early Bird
   Type: Trả phí
   Price: 299.000đ
   Quantity: 150
   Limit per person: 1
   Landing visibility: On
   Status: Lưu nháp

==================================================
UX FIXES FROM CURRENT SCREEN
============================

Fix these issues:

* Make it clear that this screen configures Hạng vé inside one Kho vé.
* Add event and Kho vé context at the top.
* Use accordion cards so the screen scales when there are many Hạng vé.
* Add “Trạng thái hạng vé”.
* Make “Không giới hạn thời gian đăng ký” disable date/time fields clearly.
* Make preview more realistic and consistent with Landing Page.
* Add quota helper to avoid misunderstanding.
* Do not imply ticket quota is consumed when creating Hạng vé.
* Keep “+ Thêm hạng vé” as the main action.
