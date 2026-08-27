Redesign the current NetEvent “Quản lý thành viên” screen for MVP.

Use Vietnamese for all UI copy, labels, buttons, helper text, status badges, table columns, drawer content, modal content, validation messages, and empty states.

Product context:
NetEvent is a self-service event management platform. Each account can have multiple events. One user can join multiple events with different roles. For example:

* User A can be Event Admin in Event ABC
* User A can also be Event Staff in Event BCD
* User B can be Account Owner in one account, but Event Admin or Staff in another account

MVP scope:

* Do not create a separate “Phân quyền sự kiện” tab in Event Workspace.
* Keep all member and permission management inside one screen: “Quản lý thành viên”.
* Only Account Owner can access this screen.
* Only Account Owner can invite, lock, remove, and edit permissions of Admin/Staff.
* Admin cannot manage members.
* Event Staff cannot manage members.
* Event Staff only accesses Check-in / Check-out for assigned events.

Main UX direction:
The main table should stay clean. Do not show a long list of all events and roles directly in the table. Instead:

* Show a compact member list.
* Show highest role and number of assigned events.
* When clicking a member, open a right drawer to view detailed event assignments and roles.
* Allow quick actions in the drawer: edit role, remove from event, lock member, remove from account.

Design style:

* Modern B2B SaaS dashboard
* Clean light background
* Rounded cards
* Subtle borders and shadows
* Clear hierarchy
* Primary color: #FF8644
* Blue for selected/active state
* Green for active status
* Orange for invited/pending
* Red for locked/destructive actions
* Neutral colors: #F8FAFC, #F1F5F9, #64748B, #0F172A
* Font: Inter or Be Vietnam Pro
* Desktop width: 1440px
* Keep current NetEvent style but make permission management clearer and cleaner.

==================================================
SCREEN — QUẢN LÝ THÀNH VIÊN
===========================

Page title:
“Quản lý thành viên”

Subtitle:
“Quản lý nhân sự trong account và phân quyền theo từng sự kiện.”

Helper text near title:
“Chỉ Account Owner được mời, phân quyền, tạm khóa hoặc xóa thành viên.”

Top right CTA:
“+ Mời thành viên”

==================================================
SUMMARY CARDS
=============

Show compact summary cards:

Card 1:
“Tổng thành viên”
Value: “7”

Card 2:
“Đang hoạt động”
Value: “4”

Card 3:
“Đã mời”
Value: “2”

Card 4:
“Tạm khóa”
Value: “1”

==================================================
FILTER BAR
==========

Show filter bar above table.

Filters:

* Search input: “Tìm theo tên hoặc email”
* Dropdown: “Tất cả vai trò”
* Dropdown: “Tất cả trạng thái”
* Dropdown: “Tất cả sự kiện”

Role filter options:

* Tất cả vai trò
* Account Owner
* Event Admin
* Event Staff

Status filter options:

* Tất cả trạng thái
* Hoạt động
* Đã mời
* Chờ xác thực
* Tạm khóa

==================================================
MAIN TABLE — COMPACT MEMBER LIST
================================

Do not show full event-role list directly in the table.

Table columns:

1. “Thành viên”
2. “Vai trò cao nhất”
3. “Sự kiện tham gia”
4. “Trạng thái”
5. “Lần hoạt động gần nhất”
6. “Hành động”

Column details:

1. Thành viên
   Show:

* Avatar initials
* Full name
* Email

2. Vai trò cao nhất
   Show highest role badge:

* Account Owner
* Event Admin
* Event Staff

Role priority:
Account Owner > Event Admin > Event Staff

3. Sự kiện tham gia
   Show count only:

* “Toàn bộ sự kiện” for Account Owner
* “5 sự kiện”
* “2 sự kiện”
* “1 sự kiện”
* “Chưa phân công”

Do not show all event names in the table.

4. Trạng thái
   Status badges:

* Hoạt động
* Đã mời
* Chờ xác thực
* Tạm khóa

5. Lần hoạt động gần nhất
   Examples:

* “Hôm nay”
* “30/06/2026”
* “—” if invited but not accepted

6. Hành động
   Primary inline action:
   “Xem chi tiết”

More menu:

* Xem chi tiết
* Gửi lại lời mời
* Tạm khóa
* Mở khóa
* Xóa khỏi account

For Account Owner row:

* Disable destructive actions
* Show helper: “Không thể khóa hoặc xóa Account Owner.”

==================================================
EXAMPLE TABLE ROWS
==================

Row 1:
Name: “Nguyễn Thị Lan”
Email: “[owner@netevent.vn](mailto:owner@netevent.vn)”
Vai trò cao nhất: “Account Owner”
Sự kiện tham gia: “Toàn bộ sự kiện”
Trạng thái: “Hoạt động”
Lần hoạt động gần nhất: “Hôm nay”
Action: “Xem chi tiết”

Row 2:
Name: “Trần Văn Minh”
Email: “[admin@netevent.vn](mailto:admin@netevent.vn)”
Vai trò cao nhất: “Event Admin”
Sự kiện tham gia: “5 sự kiện”
Trạng thái: “Hoạt động”
Lần hoạt động gần nhất: “Hôm nay”
Action: “Xem chi tiết”

Row 3:
Name: “Phạm Đức Anh”
Email: “[staff@netevent.vn](mailto:staff@netevent.vn)”
Vai trò cao nhất: “Event Staff”
Sự kiện tham gia: “2 sự kiện”
Trạng thái: “Hoạt động”
Lần hoạt động gần nhất: “30/06/2026”
Action: “Xem chi tiết”

Row 4:
Name: “Hoàng Thị Mai”
Email: “[mai.hoang@company.vn](mailto:mai.hoang@company.vn)”
Vai trò cao nhất: “Event Staff”
Sự kiện tham gia: “1 sự kiện”
Trạng thái: “Đã mời”
Lần hoạt động gần nhất: “—”
Action: “Xem chi tiết”

Row 5:
Name: “Vũ Quang Huy”
Email: “[huy.vu@company.vn](mailto:huy.vu@company.vn)”
Vai trò cao nhất: “Event Admin”
Sự kiện tham gia: “3 sự kiện”
Trạng thái: “Tạm khóa”
Lần hoạt động gần nhất: “10/06/2026”
Action: “Xem chi tiết”

Row 6:
Name: “Bùi Thị Ngọc”
Email: “[ngoc.bui@company.vn](mailto:ngoc.bui@company.vn)”
Vai trò cao nhất: “Event Staff”
Sự kiện tham gia: “Chưa phân công”
Trạng thái: “Chờ xác thực”
Lần hoạt động gần nhất: “—”
Action: “Xem chi tiết”

==================================================
RIGHT DRAWER — CHI TIẾT NHÂN SỰ
===============================

When user clicks “Xem chi tiết”, open a right drawer.

Drawer title:
“Chi tiết nhân sự”

Header section:

* Avatar
* Full name
* Email
* Status badge
* Highest role badge
* Number of assigned events

Example:
“Trần Văn Minh”
“[admin@netevent.vn](mailto:admin@netevent.vn)”
Status: “Hoạt động”
Vai trò cao nhất: “Event Admin”
Tham gia: “5 sự kiện”

Drawer sections:

1. “Thông tin nhân sự”
   Show:

* Họ và tên
* Email
* Trạng thái
* Ngày tham gia
* Lần hoạt động gần nhất

2. “Sự kiện đang tham gia”
   Show event assignment list as cards.

3. “Thao tác tài khoản”
   Show account-level actions:

* Tạm khóa thành viên
* Xóa khỏi account

==================================================
DRAWER SECTION — SỰ KIỆN ĐANG THAM GIA
======================================

Use compact event cards. Each card shows one event assignment.

Event card content:

* Event name
* Event date
* Event status
* Role in event
* Staff permissions if applicable
* Assignment status
* Quick actions

Example event assignment card 1:
Event name:
“Hội thảo AI 2025”

Date:
“20/08/2026”

Event status:
“Đã publish”

Role:
“Event Admin”

Permission:
“Quản lý sự kiện”

Assignment status:
“Hoạt động”

Actions:

* “Đổi vai trò”
* “Gỡ khỏi sự kiện”

Example event assignment card 2:
Event name:
“Tech Summit”

Date:
“12/09/2026”

Event status:
“Bản nháp”

Role:
“Event Staff”

Permission:
“Check-in, Check-out”

Assignment status:
“Hoạt động”

Actions:

* “Đổi vai trò”
* “Gỡ khỏi sự kiện”

Example event assignment card 3:
Event name:
“Sun Festival 2026”

Date:
“01/08/2026”

Role:
“Event Staff”

Permission:
“Check-in”

Assignment status:
“Đã mời”

Actions:

* “Gửi lại lời mời”
* “Gỡ khỏi sự kiện”

Add CTA:
“+ Gán thêm sự kiện”

==================================================
ADD / EDIT EVENT ASSIGNMENT INSIDE DRAWER
=========================================

When clicking “+ Gán thêm sự kiện”, show inline form inside drawer or small modal.

Fields:

1. “Sự kiện”
   Dropdown:
   “Chọn sự kiện”

2. “Vai trò trong sự kiện”
   Radio cards:

* “Event Admin”
  Description: “Quản lý sự kiện được phân công.”
* “Event Staff”
  Description: “Chỉ truy cập Check-in / Check-out.”

3. “Quyền Staff”
   Only show if role = Event Staff.

Checkboxes:

* Check-in
* Check-out

Default:

* Check-in selected
* Check-out optional

Buttons:

* “Hủy”
* “Gán sự kiện”

When clicking “Đổi vai trò” on an event card:
Open same form with selected event prefilled.
Allow changing:

* Event Admin ↔ Event Staff
* Check-in / Check-out permissions if Staff

Success toast:
“Cập nhật phân quyền thành công.”

==================================================
REMOVE ROLE FROM EVENT
======================

When clicking “Gỡ khỏi sự kiện”, show confirmation modal.

Title:
“Gỡ thành viên khỏi sự kiện?”

Description:
“Thành viên này sẽ mất quyền truy cập sự kiện “[Tên sự kiện]”, nhưng vẫn còn trong account và các sự kiện khác không bị ảnh hưởng.”

Buttons:

* “Hủy”
* Danger button: “Gỡ khỏi sự kiện”

Success toast:
“Đã gỡ thành viên khỏi sự kiện.”

Important:
This action only removes role from one event. It does not delete the user from the account.

==================================================
ACCOUNT-LEVEL ACTIONS
=====================

Inside drawer section “Thao tác tài khoản”, show:

For Active Admin/Staff:

* Button: “Tạm khóa thành viên”
* Danger button: “Xóa khỏi account”

For Locked user:

* Button: “Mở khóa”
* Danger button: “Xóa khỏi account”

For Invited user:

* Button: “Gửi lại lời mời”
* Button: “Thu hồi lời mời”

For Account Owner:
Hide or disable destructive buttons.
Show note:
“Không thể tạm khóa hoặc xóa Account Owner.”

==================================================
LOCK MEMBER CONFIRMATION
========================

Title:
“Tạm khóa thành viên?”

Description:
“Thành viên này sẽ không thể đăng nhập hoặc truy cập các sự kiện được phân công cho đến khi được mở khóa. Các phân quyền hiện tại vẫn được giữ lại.”

Buttons:

* “Hủy”
* Danger button: “Tạm khóa”

Success toast:
“Đã tạm khóa thành viên.”

==================================================
REMOVE MEMBER FROM ACCOUNT CONFIRMATION
=======================================

Title:
“Xóa thành viên khỏi account?”

Description:
“Thành viên này sẽ mất quyền truy cập account và toàn bộ sự kiện được phân công. Hành động này không ảnh hưởng đến dữ liệu sự kiện đã tạo trước đó.”

Buttons:

* “Hủy”
* Danger button: “Xóa thành viên”

Success toast:
“Đã xóa thành viên khỏi account.”

==================================================
MODAL — MỜI THÀNH VIÊN
======================

When Account Owner clicks “+ Mời thành viên”, open modal.

Modal title:
“Mời thành viên”

Subtitle:
“Mời Admin hoặc Staff tham gia vận hành sự kiện.”

Fields:

1. “Email”
   Placeholder:
   “Nhập email người được mời”

2. “Vai trò trong sự kiện”
   Radio cards:

* “Event Admin”
  Description:
  “Quản lý các sự kiện được phân công.”
* “Event Staff”
  Description:
  “Chỉ truy cập Check-in / Check-out.”

3. “Sự kiện phân công”
   Multi-select:
   “Chọn một hoặc nhiều sự kiện”

Options:

* Hội thảo AI 2025
* Tech Summit
* Sun Festival 2026
* NetEvent Demo Conference 2026

4. “Quyền Staff”
   Only show if Event Staff selected.

Checkboxes:

* Check-in
* Check-out

Default:

* Check-in selected

Helper text:
“Nếu email chưa có tài khoản NetEvent, người được mời sẽ tạo tài khoản từ link mời.”

Footer:

* “Hủy”
* Primary: “Gửi lời mời”

Validation:

* “Email không được để trống.”
* “Vui lòng chọn vai trò.”
* “Vui lòng chọn ít nhất một sự kiện.”
* “Staff cần có ít nhất quyền Check-in hoặc Check-out.”

Success toast:
“Đã gửi lời mời thành viên.”

==================================================
EMPTY STATE
===========

If only Account Owner exists:

Title:
“Chưa có thành viên nào khác”

Description:
“Mời Admin hoặc Staff để cùng vận hành sự kiện.”

Primary CTA:
“+ Mời thành viên”

==================================================
ROLE-BASED ACCESS RULES
=======================

Only Account Owner can see this screen.

Do not show “Quản lý thành viên” menu for Admin or Event Staff.

If Admin tries to access this screen:
Show 403 page:
“Bạn không có quyền truy cập Quản lý thành viên.”

If Event Staff tries to access:
Show 403 page:
“Bạn không có quyền truy cập khu vực này.”

==================================================
IMPORTANT UX RULES
==================

* Keep main member table compact.
* Do not show long event-role lists in the table.
* Show only highest role and event count in the table.
* Show detailed event-role assignments inside drawer.
* Allow quick actions inside drawer:

  * Đổi vai trò
  * Gỡ khỏi sự kiện
  * Tạm khóa thành viên
  * Xóa khỏi account
* Clearly separate “Gỡ khỏi sự kiện” and “Xóa khỏi account”.
* “Gỡ khỏi sự kiện” removes access to one event only.
* “Xóa khỏi account” removes all access in the account.
* Do not add a new “Phân quyền sự kiện” tab in Event Workspace for MVP.
* Keep all permission management in “Quản lý thành viên”.
* Only Account Owner can invite, lock, remove, and edit permissions.

Final MVP flow:
Account Owner opens Quản lý thành viên
→ Sees compact member list
→ Clicks a member
→ Drawer opens
→ Sees all events that member joins
→ Edits role per event
→ Removes role from specific event if needed
→ Locks or removes member from account if needed
