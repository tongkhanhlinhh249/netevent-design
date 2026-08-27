Redesign the current NetEvent “Tạo Kho vé” flow.

Use Vietnamese for all UI copy, labels, buttons, helper text, validation messages, status badges, and empty states.

Current problem:
The current flow is split into too many steps:

1. Chọn sự kiện
2. Thêm hạng vé
3. Thiết lập hạng vé

This is too long for the actual task. In NetEvent, the user does not need to manually create ticket inventory metadata. The system should automatically create “Kho vé” for the selected event. The user only needs to set up ticket tiers called “Hạng vé”.

Product context:

* Each event has one active “Kho vé” in MVP.
* One “Kho vé” belongs to exactly one event.
* One “Kho vé” can contain many “Hạng vé”.
* Each “Hạng vé” has its own price, quantity, benefits, registration time, visibility, and status.
* Creating “Kho vé” does not consume ticket quota.
* Creating “Hạng vé” does not consume ticket quota.
* Ticket quota is consumed only when a real ticket is issued to an attendee after successful registration.
* Landing Page displays ticket tiers from the event’s “Kho vé”.
* Do not use the word “Voucher”.
* Do not call this flow “Tạo vé”. Ticket is only issued after attendee registration.
* Use the correct naming: “Thiết lập Kho vé” or “Thiết lập hạng vé”.

Design style:

* Modern B2B SaaS dashboard
* Clean light background
* Rounded cards
* Subtle borders and shadows
* Primary color: #FF8644
* Blue for selected/active state
* Green for success/open status
* Orange for warning/editing
* Red/gray for blocked/sold out
* Font: Inter or Be Vietnam Pro
* Desktop modal/drawer layout
* Keep current NetEvent/EventHub style but make the flow simpler and clearer.

==================================================
NEW FLOW DIRECTION
==================

Remove the 3-step stepper.

Replace it with one single setup screen:

“Thiết lập Kho vé”

User flow:
Event Workspace
→ Tab Kho vé
→ Click “Thiết lập Kho vé”
→ Open single modal/drawer
→ Add multiple Hạng vé using accordion cards
→ Configure price, quantity, benefits, visibility, status
→ Save draft or complete setup

If user starts from Event Workspace:

* Event is already selected.
* Do not ask user to select event again.

If user starts from global “Kho vé” menu:

* Show an event dropdown at the top of the modal.
* Do not make event selection a separate step.

==================================================
MAIN MODAL / DRAWER — THIẾT LẬP KHO VÉ
======================================

Modal title:
“Thiết lập Kho vé”

Subtitle:
“Kho vé sẽ được tự tạo theo sự kiện. Bạn chỉ cần thiết lập các hạng vé cho người tham dự.”

Top context card:
Show:

* Sự kiện: “NetEvent Demo Conference 2026”
* Kho vé: “Tự tạo bởi hệ thống”
* Trạng thái: “Bản nháp”
* Quota vé còn lại trong gói: “1.000 vé”

Info box:
“Tạo hạng vé không trừ quota. Quota chỉ được tính khi vé được phát hành thật cho người tham dự.”

Do not show these fields:

* Tên Kho vé
* Mô tả Kho vé
* Trạng thái Kho vé as a separate required step

System-generated name:
“Kho vé - NetEvent Demo Conference 2026”

==================================================
SUMMARY BAR
===========

Add a compact real-time summary bar below the context card.

Summary items:

1. “Số hạng vé”
   Value: “2”

2. “Tổng sức chứa dự kiến”
   Value: “400 vé”

3. “Hiển thị Landing”
   Value: “2 hạng vé”

4. “Vé đã phát hành”
   Value: “0 vé”

Helper text:
“Tổng sức chứa dự kiến được tính từ tổng số lượng của các hạng vé đang cấu hình.”

Important:
Do not show “Tổng sức chứa: 0 vé” when the user has already entered ticket quantities.
Update summary in real time.

==================================================
TICKET TIER ACCORDION LIST
==========================

Main section title:
“Hạng vé”

Description:
“Thiết lập các hạng vé mà người tham dự có thể chọn khi đăng ký.”

Primary action:
“+ Thêm hạng vé”

Use accordion cards.

Only one Hạng vé card should be expanded at a time.
Collapsed cards should be compact.

Collapsed card content:

* Number badge
* Hạng vé name
* Price / type
* Quantity
* Landing visibility
* Status
* Actions: “Nhân bản”, “Xóa”, expand icon

Example collapsed cards:

1. “Standard · Miễn phí · 300 vé · Hiển thị Landing · Đang mở”
2. “VIP · 499.000đ · 100 vé · Hiển thị Landing · Đang mở”

Expanded card should show full configuration form.

Only expanded card should have blue/orange accent border.
Collapsed cards should use neutral border.

==================================================
DEFAULT STATE
=============

When no ticket tier exists:
Show empty state:

Title:
“Chưa có hạng vé nào”

Description:
“Thêm ít nhất một hạng vé như Standard, VIP hoặc Early Bird để người tham dự có thể chọn khi đăng ký.”

Button:
“+ Thêm hạng vé”

When user clicks “+ Thêm hạng vé”:
Add a new expanded accordion card immediately.

Default new ticket tier:

* Tên hạng vé: empty
* Loại vé: Miễn phí
* Giá vé: 0
* Số lượng: empty
* Giới hạn/người: 1
* Hiển thị Landing Page: On
* Trạng thái: Mở đăng ký ngay

==================================================
EXPANDED HẠNG VÉ FORM
=====================

Each expanded Hạng vé card must include:

1. “Tên hạng vé”
   Placeholder:
   “Ví dụ: Standard, VIP, Early Bird”
   Required

2. “Loại vé”
   Segmented control:

* “Miễn phí”
* “Trả phí”

3. “Giá vé”
   Input suffix:
   “đ”

Logic:

* If “Miễn phí” is selected: disable price input and set value to 0.
* If “Trả phí” is selected: enable price input, required, must be greater than 0.

4. “Số lượng vé”
   Placeholder:
   “Nhập số lượng vé”
   Required

5. “Giới hạn/người”
   Default:
   “1”

6. “Quyền lợi hạng vé”
   Textarea
   Placeholder:
   “Ví dụ: Chỗ ngồi ưu tiên, tài liệu sự kiện, tea-break, networking, quà tặng”

7. “Thời gian đăng ký”
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

8. “Hiển thị trên Landing Page”
   Toggle:
   “Hiển thị”

Helper:
“Khi bật, hạng vé này sẽ xuất hiện trong section Vé tham dự trên Landing Page nếu đang mở đăng ký.”

9. “Trạng thái”
   Radio cards:

* “Lưu nháp”
  Subtext: “Chưa hiển thị cho người tham dự”
* “Mở đăng ký ngay”
  Subtext: “Cho phép người tham dự chọn hạng vé này”
* “Tạm đóng”
  Subtext: “Tạm ngừng nhận đăng ký hạng vé này”

==================================================
LANDING PAGE PREVIEW
====================

Inside each expanded ticket tier card, add a preview block.

Title:
“Preview trên Landing Page”

Preview card example for free ticket:

* “Standard”
* “Miễn phí”
* “Còn 300 vé”
* Button: “Chọn vé”

Preview card example for paid ticket:

* “VIP”
* “499.000đ”
* “Còn 100 vé”
* Button: “Chọn vé”

If status is draft:
Show small note:
“Hạng vé bản nháp chưa hiển thị trên Landing Page.”

If visibility is off:
Show note:
“Hạng vé này đang tắt hiển thị trên Landing Page.”

==================================================
FOOTER ACTIONS
==============

Sticky footer at bottom of modal.

Buttons:

* “Hủy”
* “Lưu nháp”
* Primary: “Hoàn tất thiết lập Kho vé”

After clicking “Hoàn tất thiết lập Kho vé”:
Show toast:
“Thiết lập Kho vé thành công”

Then navigate to Kho vé detail screen.

==================================================
AFTER COMPLETE — KHO VÉ DETAIL
==============================

Show detail screen:

Title:
“Kho vé - NetEvent Demo Conference 2026”

Status badge:
“Đang hoạt động”

Summary cards:

* Tổng sức chứa: “400 vé”
* Đã phát hành: “0 vé”
* Còn lại trong kho: “400 vé”
* Quota vé còn lại: “1.000 vé”

Table:
“Danh sách hạng vé”

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

Rows:

1. Standard — Miễn phí — 0đ — 300 — 0 — 300 — Có — Đang mở
2. VIP — Trả phí — 499.000đ — 100 — 0 — 100 — Có — Đang mở

Actions:

* “+ Thêm hạng vé”
* “Chỉnh sửa Kho vé”

==================================================
VALIDATION RULES
================

Use these validation messages:

* “Cần có ít nhất một hạng vé để hoàn tất thiết lập.”
* “Tên hạng vé không được để trống.”
* “Giá vé trả phí phải lớn hơn 0.”
* “Số lượng vé phải lớn hơn 0.”
* “Thời gian đóng đăng ký phải sau thời gian mở đăng ký.”
* “Số lượng vé không được nhỏ hơn số vé đã phát hành.”

If user tries to complete without any ticket tier:
Show warning:
“Vui lòng thêm ít nhất một hạng vé.”

If all ticket tiers are draft:
Show warning:
“Bạn chưa có hạng vé nào đang mở đăng ký. Người tham dự sẽ chưa thể chọn vé trên Landing Page.”

==================================================
EDIT MODE RULES
===============

When editing an existing Hạng vé with issued tickets:
Show warning:
“Hạng vé này đã có vé được phát hành. Một số thay đổi có thể ảnh hưởng đến người tham dự mới.”

Rules:

* User can increase quantity.
* User cannot reduce quantity below issued count.
* If price changes after tickets were issued, show confirmation warning.
* If status changes to “Tạm đóng”, new attendees cannot select this tier.
* If “Hiển thị Landing Page” is turned off, the ticket tier disappears from public Landing Page.

==================================================
UX FIXES FROM CURRENT FLOW
==========================

Fix these current issues:

* Remove the 3-step stepper.
* Do not separate “Thêm hạng vé” and “Thiết lập hạng vé” into two screens.
* Do not ask for “Tên Kho vé” or “Mô tả Kho vé”.
* System should auto-create the Kho vé based on selected event.
* Main task should be setting up Hạng vé.
* Add “Quyền lợi hạng vé”.
* Use accordion cards for multiple Hạng vé.
* Update summary in real time.
* Keep the modal short, focused, and easy to complete.
* Make it clear that ticket quota is not consumed during setup.

==================================================
FINAL USER FLOW
===============

User opens Event Workspace
→ Goes to tab “Kho vé”
→ Clicks “Thiết lập Kho vé”
→ Modal opens
→ Event is already selected
→ User clicks “+ Thêm hạng vé”
→ User configures Standard ticket tier
→ User clicks “+ Thêm hạng vé”
→ User configures VIP ticket tier with its own price and quantity
→ Summary updates in real time
→ User clicks “Hoàn tất thiết lập Kho vé”
→ System creates Kho vé and saves all Hạng vé
→ Hạng vé with Landing visibility enabled appears on the public Landing Page
