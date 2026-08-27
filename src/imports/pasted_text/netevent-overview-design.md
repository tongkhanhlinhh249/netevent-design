Thiết kế màn “Tổng quan” ở menu chính cho NetEvent.

Bối cảnh:
NetEvent là nền tảng quản lý sự kiện. Hiện tại trong menu chính có mục “Tổng quan”, mục này cần được thiết kế thành dashboard tổng quan cho tất cả sự kiện mà user có quyền truy cập, khác với tab “Tổng quan” trong chi tiết từng sự kiện.

Mục tiêu:
Màn Tổng quan ở menu chính giúp user theo dõi toàn bộ sự kiện mình đang quản lý hoặc được phân quyền tham gia. User có thể nhanh chóng biết sự kiện nào sắp diễn ra, sự kiện nào đang cần xử lý, sự kiện nào đang diễn ra, và truy cập nhanh vào các màn như chi tiết sự kiện, check-in, mini game, kho vé.

Thiết kế màn desktop theo style SaaS dashboard hiện tại của NetEvent.

Cấu trúc màn:

1. Header
- Title: “Tổng quan”
- Subtitle: “Theo dõi toàn bộ sự kiện bạn đang quản lý hoặc được phân quyền tham gia.”
- CTA bên phải: “+ Tạo sự kiện”
- CTA “+ Tạo sự kiện” chỉ nên là primary action của màn Tổng quan nếu user có quyền tạo sự kiện.

2. Bộ lọc chính dạng tab
Đặt ngay dưới header:
- Tất cả
- Của tôi
- Được phân quyền cho tôi

Hiển thị số lượng trên từng tab:
- Tất cả 12
- Của tôi 5
- Được phân quyền cho tôi 7

Logic:
- “Tất cả” hiển thị toàn bộ sự kiện user có quyền truy cập trong workspace hiện tại.
- “Của tôi” hiển thị sự kiện user là người tạo hoặc event owner.
- “Được phân quyền cho tôi” hiển thị sự kiện user được mời tham gia với vai trò admin/staff/operator/check-in staff.

3. Filter phụ
Bên dưới tab có hàng filter:
- Search theo tên sự kiện
- Dropdown trạng thái:
  + Tất cả trạng thái
  + Bản nháp
  + Sắp diễn ra
  + Đang diễn ra
  + Đã kết thúc
  + Đã hủy
- Dropdown thời gian:
  + Tất cả thời gian
  + Tuần này
  + Tháng này
  + 3 tháng tới
  + Tùy chỉnh
- Dropdown hình thức:
  + Offline
  + Online
  + Hybrid
- Dropdown vai trò:
  + Tất cả vai trò
  + Owner
  + Admin sự kiện
  + Staff check-in
  + Staff vận hành

4. Quick stats
Thiết kế 4–6 stat cards:
- Tổng sự kiện
- Sắp diễn ra
- Đang diễn ra
- Bản nháp cần xử lý
- Tổng người đăng ký
- Tổng check-in

Nếu có bán vé, có thể thêm card:
- Tổng doanh thu

Mỗi stat card gồm:
- Icon
- Label
- Số liệu lớn
- Mô tả ngắn
- Trạng thái tăng/giảm nếu cần

5. Khu vực nội dung chính dạng 2 cột
Cột trái chiếm 65–70%.
Cột phải chiếm 30–35%.

Cột trái:
A. Sự kiện cần chú ý
- Hiển thị các sự kiện có trạng thái cần hành động:
  + Bản nháp chưa xuất bản
  + Sắp diễn ra nhưng chưa bật check-in
  + Đang diễn ra
  + Có mini game cần vận hành
  + Có người thắng chưa trao quà
- Dạng table/list.
- Mỗi item hiển thị:
  + Tên sự kiện
  + Thời gian
  + Trạng thái
  + Vai trò của tôi
  + Lý do cần chú ý
  + CTA: “Xem chi tiết” hoặc “Xử lý ngay”

B. Danh sách sự kiện
Thiết kế table/list gồm các cột:
- Sự kiện: tên, hình thức, thời gian
- Vai trò của tôi: Owner, Admin, Staff check-in, Staff vận hành
- Trạng thái
- Người đăng ký
- Check-in
- Vé/Doanh thu nếu có quyền xem
- Module cần chú ý: Email, Check-in, Mini Game
- Thao tác: Xem chi tiết, Theo dõi check-in, Vận hành

Cột phải:
A. Việc cần xử lý
Card title: “Việc cần xử lý”
Các item ví dụ:
- 3 sự kiện bản nháp chưa xuất bản
- 2 sự kiện sắp diễn ra nhưng chưa bật check-in
- 1 sự kiện chưa bật email nhắc lịch
- 1 mini game đã tạo nhưng chưa publish
- 4 người thắng chưa xác nhận trao quà

Mỗi item có:
- Icon trạng thái
- Tiêu đề
- Mô tả ngắn
- CTA nhỏ

B. Hoạt động gần đây
Hiển thị activity log ngắn:
- Nguyễn Thị Lan đã tạo sự kiện A
- Trần Staff A đã check-in 24 người cho sự kiện B
- Admin đã bật email nhắc lịch cho sự kiện C
- Staff đã xác nhận trao quà cho sự kiện D

C. Cảnh báo quota nếu có
Hiển thị khi workspace gần hết quota:
- Số sự kiện còn lại
- Số email còn lại
- Số mini game còn lại
CTA: “Xem quota”

6. Empty states
Thiết kế empty state cho từng tab:
- Nếu không có sự kiện nào:
  Title: “Bạn chưa có sự kiện nào”
  Description: “Tạo sự kiện đầu tiên để bắt đầu quản lý đăng ký, vé và check-in trên NetEvent.”
  CTA: “+ Tạo sự kiện”

- Nếu tab “Của tôi” rỗng:
  Title: “Bạn chưa sở hữu sự kiện nào”
  Description: “Các sự kiện bạn tạo hoặc được gán làm owner sẽ hiển thị tại đây.”

- Nếu tab “Được phân quyền cho tôi” rỗng:
  Title: “Bạn chưa được phân quyền vào sự kiện nào”
  Description: “Khi có người mời bạn tham gia quản lý hoặc vận hành sự kiện, sự kiện đó sẽ hiển thị tại đây.”

7. Permission logic
Thiết kế UI thể hiện được quyền truy cập:
- Nếu user là Owner/Admin, hiển thị đầy đủ số liệu và CTA quản lý.
- Nếu user là Staff, chỉ hiển thị các sự kiện được phân quyền.
- Nếu user không có quyền xem doanh thu, ẩn doanh thu hoặc thay bằng dấu “Không có quyền xem”.
- Nếu user không có quyền tạo sự kiện, ẩn CTA “+ Tạo sự kiện”.

8. Visual style
- Giữ style hiện tại của NetEvent.
- Background sáng.
- Card bo góc 14–16px.
- Border nhẹ #E5E7EB.
- Shadow rất nhẹ.
- Màu chủ đạo xanh.
- Badge trạng thái rõ ràng:
  + Bản nháp màu cam/xám
  + Sắp diễn ra màu xanh dương
  + Đang diễn ra màu hồng/đỏ nhạt
  + Đã kết thúc màu xám
- CTA primary chỉ dùng cho hành động chính.
- Các CTA phụ dùng outline hoặc ghost button.
- Không để quá nhiều button xanh cạnh nhau.

9. UX goal
Màn Tổng quan phải giúp user trả lời nhanh:
- Tôi có bao nhiêu sự kiện?
- Sự kiện nào của tôi?
- Sự kiện nào tôi được phân quyền?
- Sự kiện nào cần xử lý ngay?
- Tôi cần vào đâu để vận hành check-in, mini game hoặc xem chi tiết?