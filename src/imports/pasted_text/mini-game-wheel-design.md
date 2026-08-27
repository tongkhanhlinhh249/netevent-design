Thiết kế module “Mini Game - Vòng Quay May Mắn Công Khai” cho nền tảng NetEvent.

Bối cảnh:
NetEvent là nền tảng tạo và quản lý sự kiện, có landing page sự kiện, đăng ký/vé điện tử, QR check-in và quản lý người tham dự. Tính năng mới cho phép organizer tạo mini game vòng quay may mắn đi theo từng sự kiện. Ở bản MVP, vòng quay không có màn dành cho attendee/user. Vòng quay được vận hành công khai bởi organizer/staff trong lúc sự kiện diễn ra, có người tham dự chứng kiến trực tiếp tại sự kiện.

Mục tiêu thiết kế:
- Mini game nằm trong chi tiết từng sự kiện.
- Organizer cấu hình chương trình quay thưởng.
- Staff/operator vận hành vòng quay trên màn hình công khai.
- Người tham dự không cần mở điện thoại, không cần đăng nhập, không cần tự quay.
- Public display dùng để chiếu lên màn LED/projector tại sự kiện.
- Hệ thống ghi nhận kết quả, người vận hành, thời gian quay và trạng thái trao quà.

Thiết kế các màn CMS desktop:

1. Tab “Mini Game” trong chi tiết sự kiện
- Nếu chưa có mini game, hiển thị empty state:
  Title: “Chưa có mini game nào”
  Description: “Tạo vòng quay may mắn công khai để bốc thăm quà tặng trong lúc sự kiện diễn ra.”
  Button chính: “Tạo vòng quay”
- Nếu đã có mini game, hiển thị card/table gồm:
  + Tên mini game
  + Loại: Vòng quay công khai
  + Trạng thái: Draft, Scheduled, Live, Paused, Ended
  + Nguồn người tham gia
  + Số người đủ điều kiện
  + Số giải thưởng
  + Số người đã trúng
  + Số quà đã trao
  + Action: Quản lý, Vận hành, Xem kết quả

2. Flow tạo vòng quay dạng wizard 4 bước

Bước 1: Thông tin
- Tên chương trình quay thưởng
- Mô tả ngắn
- Thời gian bắt đầu
- Thời gian kết thúc
- Upload logo sự kiện hoặc logo chương trình
- Gợi ý text: “Vòng quay sẽ được vận hành công khai trong lúc sự kiện diễn ra.”

Bước 2: Người tham gia
- Chọn nguồn người tham gia:
  + Người đã check-in
  + Người đã đăng ký
  + Người thuộc hạng vé cụ thể
  + Danh sách import thủ công
- Hiển thị số người đủ điều kiện hiện tại
- Có search/filter danh sách người tham gia
- Có checkbox loại thủ công người khỏi pool nếu cần
- Có rule:
  + Một người chỉ được trúng một lần
  + Chỉ quay khi danh sách đã được khóa
  + Cho phép quay lại nếu người thắng không có mặt
- Có box khuyến nghị:
  “Khuyến nghị sử dụng danh sách người đã check-in để đảm bảo người thắng có mặt tại sự kiện.”

Bước 3: Giải thưởng
- Danh sách giải thưởng dạng table/card
- Mỗi giải thưởng gồm:
  + Tên giải: Giải nhất, Giải nhì, Giải may mắn
  + Tên phần thưởng
  + Số lượng người thắng
  + Hình ảnh/icon phần thưởng
  + Mô tả/hướng dẫn nhận quà
  + Trạng thái: Chưa quay, Đang quay, Đã quay xong
- Button: “Thêm giải thưởng”
- Không có cấu hình tỷ lệ trúng trong MVP
- Có thể sắp xếp thứ tự giải thưởng

Bước 4: Hiển thị & xuất bản
- Preview màn Public Display
- Cấu hình thông tin hiển thị:
  + Hiển thị logo sự kiện
  + Hiển thị tên chương trình
  + Hiển thị tên giải thưởng
  + Hiển thị số lượng người tham gia
  + Cách hiển thị người thắng: họ tên + mã vé, hoặc họ tên rút gọn + 4 số cuối SĐT
- Legal/transparency checklist:
  + Tôi xác nhận danh sách người tham gia và thể lệ quay thưởng đã được chuẩn bị
  + Tôi xác nhận chương trình được vận hành công khai trong lúc sự kiện diễn ra
  + Tôi xác nhận organizer chịu trách nhiệm về điều kiện pháp lý của chương trình
- Trường nhập link hoặc upload file thể lệ nếu có
- Button: “Lưu nháp” và “Xuất bản”

3. Màn quản lý chi tiết mini game
- Header có tên chương trình, badge trạng thái, thời gian diễn ra
- Quick stats:
  + Người đủ điều kiện
  + Người trong danh sách đã khóa
  + Tổng giải thưởng
  + Người đã trúng
  + Quà đã trao
  + Quà chưa trao
- Tabs:
  + Tổng quan
  + Vận hành
  + Người tham gia
  + Giải thưởng
  + Kết quả
  + Nhật ký thao tác

4. Màn Operator / Vận hành vòng quay
Thiết kế layout desktop chia 2 vùng:
- Bên trái là bảng điều khiển
- Bên phải là preview màn công khai

Bảng điều khiển bên trái gồm:
- Chọn giải thưởng cần quay
- Hiển thị phần thưởng và số lượng người thắng còn lại
- Hiển thị số người đủ điều kiện trong pool
- Trạng thái danh sách: Chưa khóa / Đã khóa
- Button “Khóa danh sách”
- Button chính “Bắt đầu quay”
- Button “Quay lại”
- Button “Người thắng không có mặt”
- Button “Xác nhận người thắng”
- Button “Kết thúc chương trình”
- Lịch sử lượt quay gần nhất

Preview bên phải gồm:
- Vòng quay animation
- Logo sự kiện
- Tên chương trình
- Tên giải đang quay
- Số lượng người trong pool
- Người thắng hiện tại
- Trạng thái: Đang chờ, Đang quay, Chờ xác nhận, Đã xác nhận

5. Màn Public Display fullscreen
Đây là màn để chiếu lên LED/projector tại sự kiện.
Thiết kế nổi bật, sân khấu, dễ nhìn từ xa.
Nội dung gồm:
- Logo sự kiện ở đầu màn
- Title lớn: “Vòng quay may mắn”
- Tên giải thưởng đang quay
- Hình ảnh phần thưởng
- Vòng quay lớn ở giữa màn hình
- Khi đang quay: hiển thị hiệu ứng tên/mã vé chạy nhanh
- Khi có kết quả: hiển thị “Chúc mừng!” và người thắng
- Thông tin người thắng hiển thị an toàn:
  + Họ tên
  + Mã vé
  + Không hiển thị đầy đủ email/SĐT
- Footer nhỏ: “Kết quả được ghi nhận trên hệ thống NetEvent”

6. Màn Kết quả
- Table danh sách kết quả gồm:
  + Thời gian quay
  + Giải thưởng
  + Người thắng
  + Mã vé
  + Trạng thái: Chờ xác nhận, Đã xác nhận, Không có mặt, Đã trao quà, Hủy kết quả
  + Người vận hành
  + Người xác nhận trao quà
- Filter theo giải thưởng, trạng thái, thời gian
- Search theo tên/mã vé/SĐT/email
- Button Export CSV
- Button “Xác nhận đã trao quà”
- Modal xác nhận trao quà:
  “Bạn chắc chắn đã trao phần thưởng này cho người thắng?”
- Nếu hủy kết quả hoặc đánh dấu không có mặt, bắt buộc nhập lý do

7. Màn Nhật ký thao tác
- Ghi lại các hành động:
  + Tạo vòng quay
  + Sửa cấu hình
  + Xuất bản
  + Khóa danh sách
  + Bắt đầu quay
  + Xác nhận người thắng
  + Đánh dấu không có mặt
  + Xác nhận trao quà
  + Hủy kết quả
- Hiển thị người thực hiện và thời gian thực hiện

Style UI:
- CMS desktop clean, SaaS dashboard hiện đại, rõ hierarchy.
- Public Display có visual nổi bật hơn, phù hợp trình chiếu sân khấu nhưng vẫn chuyên nghiệp.
- Màu chủ đạo xanh NetEvent, có thể thêm gradient nhẹ cho màn public.
- Card bo góc 12-16px, shadow nhẹ, spacing thoáng.
- Badge trạng thái rõ ràng:
  + Draft màu xám
  + Scheduled màu xanh dương nhạt
  + Live màu hồng/đỏ nhạt
  + Paused màu cam nhạt
  + Ended màu xám nhạt
- Tránh thiết kế quá carnival hoặc game casino.
- Ưu tiên cảm giác minh bạch, công khai, chuyên nghiệp.

Lưu ý UX:
- Không thiết kế màn dành cho attendee/user.
- Không thiết kế flow attendee tự quay trên điện thoại.
- Vòng quay được vận hành bởi staff/operator tại sự kiện.
- Public Display là màn trình chiếu cho người tham dự cùng xem.
- MVP không cần cấu hình tỷ lệ trúng; hệ thống quay người thắng từ pool hợp lệ.
- Khi danh sách đã khóa, cần hiển thị rõ để tăng tính minh bạch.
- Kết quả quay phải được ghi nhận bởi hệ thống, không chỉ là animation.