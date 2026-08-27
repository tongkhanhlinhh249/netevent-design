Create a high-fidelity NetEvent “Danh sách sự kiện” screen using a timeline card layout inspired by the uploaded reference.

Use Vietnamese for all UI copy, labels, buttons, status badges, empty states, filters, and helper text.

Product context:
NetEvent is a self-service event management platform. Customers can create event drafts, configure landing pages, registration forms, ticket inventory, issue QR tickets, check in attendees, and view reports.

Design direction:

* Minimal, clean, Luma-inspired event-first UI
* Events are displayed as timeline cards grouped by event date
* Soft background
* Large whitespace
* Rounded event cards
* Subtle shadows
* Clear event status and actions
* Primary color: #FF8644
* Use blue for selected/active states, green for success, orange/red for live or warning
* Font: Inter or Be Vietnam Pro
* Desktop layout: 1440px

==================================================
SCREEN — DANH SÁCH SỰ KIỆN THEO TIMELINE
========================================

Page title:
“Sự kiện”

Subtitle:
“Quản lý sự kiện theo thời gian tổ chức.”

Top navigation:

* Logo: NetEvent
* Menu: Sự kiện, Lịch, Khám phá
* Right side: Gói hiện tại, Tìm kiếm, Thông báo, User avatar
* Primary CTA: “+ Tạo sự kiện”

Tabs:

* Sắp diễn ra
* Bản nháp
* Đã qua
* Tất cả

Search and filters:

* Search input: “Tìm sự kiện”
* Filter: “Tất cả trạng thái”
* Filter: “Tất cả hình thức”
* Filter: “Tháng này”

Package quota mini card:
Show compact card:
“Gói Professional”
“4 / 10 sự kiện đã publish”
“402 / 1.000 vé đã phát hành”
“Còn hạn đến 03/08/2026”

Helper text:
“Bản nháp chưa tính vào quota. Quota sự kiện chỉ được tính khi publish lần đầu.”

==================================================
TIMELINE LAYOUT
===============

Use a two-column timeline layout:

Left column:

* Date label
* Day of week
* Timeline dot
* Vertical dashed line

Right column:

* Event cards grouped by date

Example date groups:

Group 1:
Date label:
“Hôm nay”
Day:
“Thứ Hai”

Group 2:
Date label:
“01 Thg 7”
Day:
“Thứ Tư”

Group 3:
Date label:
“12 Thg 7”
Day:
“Chủ Nhật”

Group 4:
Date label:
“30 Thg 8”
Day:
“Thứ Bảy”

==================================================
EVENT CARD STRUCTURE
====================

Each event card should include:

Left content:

* Event status badge
* Event time
* Event name
* Location / online link
* Number of guests / registrations
* Setup progress if draft
* Quick actions

Right content:

* Event cover thumbnail
* More menu

Card fields:

* Status
* Time
* Event name
* Organizer
* Location
* Registration count
* Check-in count
* Landing page status
* Setup progress

==================================================
EVENT CARD EXAMPLES
===================

Card 1 — Live event today:

Status:
“LIVE”

Time:
“16:00”

Event name:
“NetEvent Demo Conference 2026”

Location:
“NetSpace — Công ty Công nghệ & Truyền thông”

Guests:
“328 người đăng ký”

Check-in:
“138 đã check-in”

Buttons:

* Primary: “Check-in”
* Secondary: “Quản lý”

Thumbnail:
Use a bold event poster image placeholder.

Style:

* LIVE badge in orange/red
* Card border slightly highlighted
* Check-in button dark/primary

---

Card 2 — Upcoming published event:

Status:
“Đã publish”

Time:
“18:30”

Event name:
“Sun Festival 2026”

Location:
“SECC, Quận 7, TP.HCM”

Guests:
“402 người đăng ký”

Buttons:

* “Quản lý sự kiện”
* “Xem landing”

Thumbnail:
Bright event poster placeholder.

---

Card 3 — Draft event:

Status:
“Bản nháp”

Time:
“Chưa publish”

Event name:
“Workshop Marketing Automation”

Location:
“Online”

Setup progress:
“2/6 cấu hình hoàn tất”

Buttons:

* Primary: “Tiếp tục cấu hình”
* Secondary: “Preview”

Thumbnail:
Soft placeholder poster.

Show missing checklist chips:

* “Chưa có Landing Page”
* “Chưa có Form”
* “Chưa có Kho vé”

---

Card 4 — Ended event:

Status:
“Đã kết thúc”

Time:
“09:00”

Event name:
“Masterise Pre-launch VIP”

Location:
“TP.HCM”

Guests:
“250 người đăng ký”

Check-in:
“198 đã check-in”

Buttons:

* “Xem báo cáo”
* “Nhân bản”

Thumbnail:
Muted poster style.

==================================================
CARD ACTION LOGIC
=================

If event status = LIVE:
Show primary action:
“Check-in”

If event status = Bản nháp:
Show primary action:
“Tiếp tục cấu hình”

If event status = Đã publish and upcoming:
Show primary action:
“Quản lý sự kiện”

If event status = Đã kết thúc:
Show primary action:
“Xem báo cáo”

More menu actions:

* Mở workspace
* Chỉnh sửa thông tin
* Nhân bản sự kiện
* Xem Landing Page
* Lưu trữ

==================================================
EMPTY STATE
===========

If no upcoming events:

Title:
“Chưa có sự kiện sắp diễn ra”

Description:
“Tạo sự kiện đầu tiên để bắt đầu thiết lập landing page, form đăng ký, kho vé và check-in.”

Primary CTA:
“+ Tạo sự kiện”

Illustration:
Soft event card illustration with number 0.

==================================================
TIMELINE UX DETAILS
===================

* Sort events by event start date ascending.
* Group events by date.
* Show “Hôm nay” for events happening today.
* Show time prominently in the card.
* Show LIVE badge if current time is within event start and end time.
* Show vertical dashed line connecting date groups.
* Timeline dot should align with the event group.
* Event cards should be wide and easy to scan.
* Poster thumbnail should sit on the right side of each card.
* Use compact status badges to avoid clutter.
* Keep actions clear and contextual.

==================================================
STATUS BADGES
=============

Use these statuses:

* LIVE
* Bản nháp
* Sẵn sàng publish
* Đã publish
* Đang diễn ra
* Đã kết thúc
* Đã lưu trữ

Badge colors:

* LIVE: orange/red
* Bản nháp: gray
* Sẵn sàng publish: blue
* Đã publish: green/blue
* Đang diễn ra: orange
* Đã kết thúc: dark gray
* Đã lưu trữ: gray

==================================================
IMPORTANT NETEVENT LOGIC
========================

Keep NetEvent workflow clear:

User flow:
Danh sách sự kiện
→ Tạo sự kiện draft
→ Vào Event Workspace
→ Hoàn tất checklist
→ Tạo Landing Page
→ Tạo Form đăng ký
→ Tạo Kho vé
→ Preview
→ Publish
→ Attendee đăng ký
→ Check-in
→ Báo cáo

Business rules:

* Draft events do not consume event quota.
* Event quota is consumed only when event is published for the first time.
* Each event has one active Landing Page in MVP.
* Each event has one active Kho vé in MVP.
* Staff users should only see assigned events and only access Check-in / Check-out actions.
