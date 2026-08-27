Redesign the current NetEvent “Checklist cấu hình sự kiện” card.

Use Vietnamese for all UI copy, labels, buttons, helper text, checklist items, status text, and notes.

Product context:
NetEvent is an event management platform. Users create an event, create a public event page, configure ticket tiers, preview, and publish the event.

MVP scope:

* Remove “Form đăng ký” as a separate checklist item.
* The registration form should be configured inside “Trang sự kiện”.
* Remove “Email xác nhận” as a separate checklist item.
* Confirmation email with QR ticket is sent automatically by the system after successful registration or ticket purchase.
* Users do not need to configure email template in MVP.
* Keep the checklist simple and focused on the required publish setup.

Current checklist has:

* Thông tin sự kiện
* Trang sự kiện
* Form đăng ký
* Kho vé
* Email xác nhận
* Xem trước & Xuất bản

New checklist should have only:

1. Thông tin sự kiện
2. Trang sự kiện
3. Kho vé
4. Xem trước & Xuất bản

==================================================
CARD TITLE
==========

Title:
“Checklist cấu hình sự kiện”

Progress text:
“1/4 hoàn tất”

Progress bar:
Show progress based on completed items.

Helper description:
“Hoàn tất các bước cần thiết để sự kiện sẵn sàng publish.”

==================================================
CHECKLIST ITEMS
===============

Item 1:
Title:
“Thông tin sự kiện”

Status:
“Đã hoàn tất”

State:
Completed

Icon:
Green check circle

Action:
“Chỉnh sửa”

Description tooltip or small subtext:
“Tên sự kiện, thời gian, địa điểm và đơn vị tổ chức.”

==================================================

Item 2:
Title:
“Trang sự kiện”

Status:
“Chưa tạo”

State:
Incomplete

Icon:
Empty circle

Action button:
“Tạo trang sự kiện”

Subtext:
“Bao gồm trang public, nội dung giới thiệu, form đăng ký và địa điểm.”

Important:
This item replaces the old separate “Form đăng ký” item.

==================================================

Item 3:
Title:
“Kho vé”

Status:
“Chưa cấu hình”

State:
Incomplete

Icon:
Empty circle

Action button:
“Tạo kho vé”

Subtext:
“Thiết lập hạng vé, giá vé, số lượng và trạng thái hiển thị.”

==================================================

Item 4:
Title:
“Xem trước & Xuất bản”

Status:
“Chưa sẵn sàng”

State:
Disabled or incomplete until required items are done

Icon:
Empty circle

Action button:
“Kiểm tra xuất bản”

Subtext:
“Kiểm tra trang sự kiện, vé và điều kiện publish.”

==================================================
EMAIL AUTO NOTE
===============

At the bottom of the checklist card, add a small info note.

Text:
“Email xác nhận kèm mã QR sẽ được gửi tự động sau khi người tham dự đăng ký thành công.”

Style:

* Light blue or neutral info background
* Small info icon
* Text size smaller than checklist items
* Do not make it a checklist task
* Do not add a “Cấu hình email” button

==================================================
VISUAL STYLE
============

Keep the current card structure but make it cleaner.

Design style:

* White card
* Rounded corners: 16px
* Light border
* Subtle shadow
* Clear row separation
* Compact spacing
* Primary color: #FF8644
* Green for completed
* Blue for active action
* Gray for incomplete
* Disabled style for unavailable actions
* Font: Inter or Be Vietnam Pro

Checklist row style:

* Left: status icon
* Middle: title + status/subtext
* Right: action button
* Divider between rows

==================================================
INTERACTION STATES
==================

Completed item:

* Green check icon
* Title normal
* Status: “Đã hoàn tất”
* Action: “Chỉnh sửa”

Incomplete item:

* Empty circle icon
* Status: “Chưa tạo” or “Chưa cấu hình”
* Action button active

Disabled item:

* Empty circle icon
* Status: “Chưa sẵn sàng”
* Action button disabled or secondary
* Tooltip/helper:
  “Hoàn tất Trang sự kiện và Kho vé trước khi publish.”

==================================================
PUBLISH READINESS RULES
=======================

The event can be published only when:

* Thông tin sự kiện is completed
* Trang sự kiện is created
* Registration block exists inside Trang sự kiện
* Kho vé is configured if the event uses tickets
* At least one ticket tier is active if ticket mode is enabled

Do not require:

* Separate Form đăng ký module
* Separate Email xác nhận configuration

==================================================
EMPTY / WARNING STATES
======================

If Trang sự kiện exists but registration block is missing:
Show item status:
“Thiếu form đăng ký”

Action:
“Chỉnh sửa trang”

If Kho vé exists but no ticket tier is active:
Show item status:
“Chưa có hạng vé hoạt động”

Action:
“Chỉnh sửa kho vé”

If all required items are complete:
Progress:
“4/4 hoàn tất”

Bottom message:
“Sự kiện đã sẵn sàng để publish.”

Primary action:
“Xuất bản sự kiện”

==================================================
FINAL UI COPY
=============

Use this exact checklist copy:

Title:
“Checklist cấu hình sự kiện”

Progress:
“1/4 hoàn tất”

Intro:
“Hoàn tất các bước cần thiết để sự kiện sẵn sàng publish.”

Rows:

1.

“Thông tin sự kiện”
“Đã hoàn tất”
Button: “Chỉnh sửa”

2.

“Trang sự kiện”
“Chưa tạo”
Subtext: “Tạo trang public, nội dung giới thiệu và form đăng ký.”
Button: “Tạo trang sự kiện”

3.

“Kho vé”
“Chưa cấu hình”
Subtext: “Thiết lập hạng vé, giá vé và số lượng vé phát hành.”
Button: “Tạo kho vé”

4.

“Xem trước & Xuất bản”
“Chưa sẵn sàng”
Subtext: “Kiểm tra trang sự kiện trước khi publish.”
Button: “Kiểm tra xuất bản”

Bottom note:
“Email xác nhận kèm mã QR sẽ được gửi tự động sau khi đăng ký thành công.”

==================================================
IMPORTANT UX RULES
==================

* Do not show “Form đăng ký” as a separate checklist item.
* Do not show “Email xác nhận” as a separate checklist item.
* Do not show “Cấu hình email” button.
* Registration form belongs inside “Trang sự kiện”.
* Email QR is automatic in MVP.
* Keep checklist short: 4 items only.
* Reduce cognitive load.
* Make the publish flow simple and clear.
