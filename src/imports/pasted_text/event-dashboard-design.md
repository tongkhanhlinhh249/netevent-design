Thiết kế màn “Dashboard tổng quan sự kiện” cho nền tảng NetEvent.

Bối cảnh:
NetEvent là nền tảng tạo và quản lý sự kiện, có các module như Trang sự kiện, Kho vé/Form đăng ký, Người tham dự, Check-in, Mini Game, Email và Báo cáo. Dashboard tổng quan nằm trong chi tiết từng sự kiện và là màn đầu tiên user nhìn thấy khi mở một sự kiện.

Mục tiêu:
Dashboard không chỉ hiển thị số liệu mà còn đóng vai trò là trung tâm điều phối sự kiện. Organizer cần biết sự kiện đã sẵn sàng chưa, có bao nhiêu người đăng ký, check-in đang thế nào, có việc gì cần xử lý trước/sau/trong khi sự kiện diễn ra.

Thiết kế màn desktop dashboard cho chi tiết sự kiện.

Cấu trúc màn:

1. Header sự kiện
- Hiển thị tên sự kiện lớn.
- Badge trạng thái sự kiện:
  + Bản nháp
  + Sắp diễn ra
  + Đang diễn ra
  + Đã kết thúc
- Hiển thị thời gian diễn ra.
- Hiển thị địa điểm hoặc Online.
- Hiển thị CTA cấp sự kiện ở góc phải:
  + Nếu sự kiện Draft: “Xuất bản sự kiện”
  + Nếu sự kiện đã publish: “Xem trang sự kiện”
  + Có secondary action “Chỉnh sửa sự kiện”
- CTA cấp sự kiện phải tách biệt rõ với CTA của các module như Mini Game hoặc Email.

2. Quick stats
Đặt ngay dưới header, gồm 4–6 stat cards:
- Người đăng ký
- Vé đã phát hành
- Doanh thu, chỉ hiển thị nếu sự kiện có bán vé
- Check-in
- Trang sự kiện
- Mini Game

Mỗi stat card gồm:
- Icon nhỏ
- Label
- Số liệu chính
- Mô tả ngắn hoặc trạng thái
- Empty state nếu chưa có dữ liệu

Ví dụ:
Người đăng ký: 328
Check-in: 142 / 328
Trang sự kiện: Đã xuất bản
Mini Game: 1 bốc thăm đang hoạt động

3. Khu vực nội dung chính dạng grid 2 cột
Cột trái chiếm khoảng 65–70%.
Cột phải chiếm khoảng 30–35%.

Cột trái gồm:
A. Biểu đồ đăng ký / check-in
- Nếu sự kiện chưa diễn ra: hiển thị biểu đồ đăng ký theo ngày.
- Nếu sự kiện đang diễn ra: hiển thị biểu đồ check-in theo thời gian.
- Nếu sự kiện đã kết thúc: hiển thị so sánh đăng ký và tham dự thực tế.
- Có tab hoặc switch nhỏ: “Đăng ký” / “Check-in” nếu cần.
- Có empty state khi chưa có dữ liệu.

B. Vé và doanh thu
- Hiển thị breakdown theo hạng vé.
- Vé đã bán/đã phát hành/còn lại.
- Doanh thu nếu có.
- Nếu sự kiện miễn phí, đổi thành “Tình hình đăng ký” thay vì doanh thu.
- CTA: “Quản lý kho vé”.

C. Người tham dự mới nhất
- Table/list nhỏ gồm:
  + Họ tên
  + Email/SĐT đã masking nếu cần
  + Hạng vé
  + Trạng thái đăng ký/check-in
  + Thời gian đăng ký
- CTA: “Xem tất cả người tham dự”.

Cột phải gồm:
A. Checklist cần xử lý
Title: “Việc cần xử lý”
Hiển thị các item tùy trạng thái sự kiện:
- Chưa xuất bản trang sự kiện
- Chưa cấu hình form đăng ký/kho vé
- Chưa có nội dung giới thiệu sự kiện
- Chưa bật email nhắc lịch
- Chưa mở check-in
- Mini game chưa xuất bản nếu đã tạo

Mỗi item gồm:
- Icon trạng thái: chưa làm, đã xong, cảnh báo
- Tiêu đề
- Mô tả ngắn
- CTA nhỏ đi tới màn tương ứng

B. Module status cards
Hiển thị các card nhỏ:
- Trang sự kiện
- Kho vé/Form
- Check-in
- Mini Game
- Email

Mỗi card gồm:
- Tên module
- Trạng thái
- Chỉ số ngắn nếu có
- CTA nhỏ:
  + Chỉnh sửa
  + Quản lý
  + Vận hành
  + Cấu hình

C. CTA nhanh
Các action nhanh:
- Xem trang sự kiện
- Quản lý vé
- Mở check-in
- Tạo bốc thăm
- Cấu hình email nhắc lịch

4. Logic theo trạng thái sự kiện
Thiết kế dashboard có thể thích ứng theo 4 trạng thái:

A. Draft
- Ưu tiên checklist hoàn thiện sự kiện.
- Quick stats có nhiều empty state.
- CTA chính: “Xuất bản sự kiện”.
- Cảnh báo: “Sự kiện chưa được xuất bản”.

B. Đã xuất bản, chưa diễn ra
- Ưu tiên số đăng ký, vé, email nhắc lịch, chuẩn bị check-in.
- CTA chính: “Xem trang sự kiện”.
- Checklist nhắc bật email nhắc lịch và chuẩn bị check-in.

C. Đang diễn ra
- Ưu tiên check-in real-time.
- CTA chính: “Mở check-in” hoặc “Theo dõi check-in”.
- Nếu có mini game live, hiển thị CTA “Vận hành mini game”.
- Biểu đồ chuyển sang check-in theo thời gian.

D. Đã kết thúc
- Ưu tiên tổng kết.
- Hiển thị tổng đăng ký, tổng check-in, tỷ lệ tham dự, doanh thu.
- CTA chính: “Xuất báo cáo”.
- Hiển thị export danh sách người tham dự.

5. State cần thiết kế
Thiết kế đầy đủ:
- Empty state cho sự kiện mới tạo.
- Loading skeleton cho stat cards và chart.
- Error state khi không tải được dữ liệu.
- Warning state cho cấu hình chưa hoàn thiện.
- Disabled state cho các CTA chưa đủ điều kiện.

6. Visual style
- Giữ style SaaS dashboard hiện đại của NetEvent.
- Màu chủ đạo xanh.
- Background sáng.
- Card bo góc 14–16px.
- Border nhẹ #E5E7EB.
- Shadow rất nhẹ.
- Spacing thoáng 16–24px.
- Typography rõ hierarchy.
- Không dùng quá nhiều màu nổi cùng lúc.
- Chỉ một CTA primary nổi bật trong header theo từng trạng thái sự kiện.
- Các CTA trong module card dùng secondary/ghost button để không tranh chấp CTA chính.

7. UX writing gợi ý
- “Tổng quan sự kiện”
- “Việc cần xử lý”
- “Sự kiện chưa được xuất bản”
- “Hoàn thiện trang sự kiện để người tham dự có thể đăng ký.”
- “Chưa có người đăng ký”
- “Số liệu sẽ hiển thị sau khi có người đăng ký tham gia.”
- “Check-in chưa mở”
- “Bật email nhắc lịch để nhắc người tham dự trước khi sự kiện diễn ra.”

8. Responsive direction
- Desktop: layout 2 cột, chart lớn bên trái, checklist bên phải.
- Tablet: quick stats 2 cột, nội dung chính xếp dọc.
- Mobile: header, stats, checklist, chart, module cards theo thứ tự dọc.