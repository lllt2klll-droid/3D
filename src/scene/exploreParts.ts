import { ComponentType } from '../types';

export interface ExplorePart {
  id: string;
  name: string;
  function: string;
  position: [number, number, number];
}

export const EXPLORE_PARTS: Record<ComponentType, ExplorePart[]> = {
  battery: [
    { id: 'casing', name: 'Vỏ pin', function: 'Bọc và bảo vệ các hoá chất tạo điện bên trong.', position: [0, 0.35, 0] },
    { id: 'positive-cap', name: 'Cực dương (+)', function: 'Đầu nhô bằng kim loại, nơi dòng điện quy ước đi ra.', position: [0.6, 0.35, 0] },
    { id: 'negative-cap', name: 'Cực âm (−)', function: 'Đầu phẳng, nơi dòng điện quy ước trở về pin.', position: [-0.57, 0.35, 0] },
    { id: 'support', name: 'Đế giữ pin', function: 'Giữ pin ổn định trên mặt bàn thí nghiệm.', position: [0, 0.06, 0.31] },
  ],
  battery_pack: [
    { id: 'cell-one', name: 'Viên pin thứ nhất', function: 'Cung cấp một phần điện áp cho bộ pin.', position: [0, 0.28, -0.32] },
    { id: 'cell-two', name: 'Viên pin thứ hai', function: 'Nối tiếp với viên thứ nhất để tăng điện áp.', position: [0, 0.28, 0.32] },
    { id: 'series-bridge', name: 'Cầu nối nối tiếp', function: 'Nối hai viên pin để tạo nguồn tổng 3V.', position: [-0.62, 0.28, 0] },
    { id: 'tray', name: 'Khay pin', function: 'Giữ hai viên pin và các điểm tiếp xúc đúng vị trí.', position: [0, 0.08, 0.52] },
    { id: 'voltage-label', name: 'Nhãn 3V', function: 'Cho biết điện áp danh định của bộ pin.', position: [0, 0.23, 0] },
  ],
  bulb: [
    { id: 'glass', name: 'Bóng thủy tinh', function: 'Bảo vệ dây tóc và cho ánh sáng truyền ra ngoài.', position: [0, 0.68, 0] },
    { id: 'filament', name: 'Dây tóc', function: 'Nóng lên khi có dòng điện chạy qua và phát sáng.', position: [0, 0.7, 0] },
    { id: 'socket', name: 'Đui đèn', function: 'Giữ bóng và cách điện cho các điểm tiếp xúc.', position: [0, 0.24, 0] },
    { id: 'terminals', name: 'Hai chân tiếp điện', function: 'Đưa dòng điện vào và ra khỏi dây tóc.', position: [0, 0.08, 0.3] },
    { id: 'base', name: 'Đế bóng đèn', function: 'Giữ các bộ phận của bóng đèn trên bàn.', position: [0, 0.07, 0.34] },
  ],
  switch: [
    { id: 'base', name: 'Đế cách điện', function: 'Giữ các tiếp điểm và cách chúng với mặt bàn.', position: [0, 0.06, 0.2] },
    { id: 'lever', name: 'Cần gạt', function: 'Nối hoặc tách hai tiếp điểm để đóng/mở mạch.', position: [0, 0.45, 0] },
    { id: 'pivot', name: 'Khớp quay', function: 'Làm điểm tựa để cần gạt chuyển động.', position: [-0.45, 0.22, 0] },
    { id: 'contact', name: 'Chốt tiếp điểm', function: 'Chạm vào cần gạt khi công tắc đóng để dẫn điện.', position: [0.45, 0.32, 0] },
  ],
  push_button: [
    { id: 'base', name: 'Đế nút bấm', function: 'Giữ cơ cấu nút và các điểm tiếp xúc.', position: [0, 0.06, 0.2] },
    { id: 'collar', name: 'Vòng đỡ', function: 'Dẫn hướng cho nút khi được nhấn xuống.', position: [0, 0.2, 0] },
    { id: 'button-cap', name: 'Nút nhấn', function: 'Khi nhấn, làm tiếp điểm bên trong đóng mạch.', position: [0, 0.35, 0] },
    { id: 'button-dome', name: 'Mặt nút', function: 'Bề mặt để tay nhấn và thao tác nút.', position: [0, 0.42, 0] },
  ],
  motor: [
    { id: 'motor-case', name: 'Vỏ động cơ', function: 'Bảo vệ cuộn dây và các bộ phận quay bên trong.', position: [0, 0.38, -0.05] },
    { id: 'front-plate', name: 'Nắp trước', function: 'Đỡ trục quay ở phía đầu ra của động cơ.', position: [0, 0.38, 0.28] },
    { id: 'shaft', name: 'Trục quay', function: 'Truyền chuyển động quay sang bánh xe hoặc cơ cấu khác.', position: [0, 0.38, 0.4] },
    { id: 'rotor', name: 'Rôto', function: 'Bộ phận quay khi có dòng điện chạy trong động cơ.', position: [0, 0.38, 0.48] },
    { id: 'terminals', name: 'Hai cực động cơ', function: 'Cấp dòng điện; đảo hai dây có thể đảo chiều quay.', position: [0, 0.2, 0.3] },
  ],
  fan: [
    { id: 'motor-case', name: 'Vỏ động cơ', function: 'Chứa động cơ tạo chuyển động quay cho quạt.', position: [0, 0.38, -0.05] },
    { id: 'front-plate', name: 'Nắp động cơ', function: 'Đỡ trục và giữ cụm cánh quạt phía trước.', position: [0, 0.38, 0.28] },
    { id: 'hub', name: 'Moay-ơ / tâm quạt', function: 'Gắn các cánh quạt vào trục động cơ.', position: [0, 0.38, 0.54] },
    { id: 'blades', name: 'Cánh quạt', function: 'Quay để đẩy không khí và tạo luồng gió.', position: [0, 0.92, 0.58] },
    { id: 'terminals', name: 'Hai cực cấp điện', function: 'Đưa điện đến động cơ để làm cánh quạt quay.', position: [0, 0.2, 0.2] },
  ],
  solar_panel: [
    { id: 'solar-cells', name: 'Tế bào quang điện', function: 'Hấp thụ ánh sáng và biến đổi thành điện năng.', position: [0, 0.68, 0.04] },
    { id: 'grid-lines', name: 'Lưới dẫn điện', function: 'Thu gom dòng điện sinh ra trên bề mặt tế bào.', position: [0.25, 0.68, 0.04] },
    { id: 'panel-frame', name: 'Khung tấm pin', function: 'Giữ và bảo vệ các tế bào quang điện.', position: [0, 0.65, -0.03] },
    { id: 'supports', name: 'Chân đỡ', function: 'Nâng và giữ tấm pin nghiêng về phía ánh sáng.', position: [0.55, 0.4, -0.1] },
    { id: 'base', name: 'Đế tấm pin', function: 'Giữ toàn bộ mô hình đứng vững trên mặt bàn.', position: [0, 0.05, 0.2] },
  ],
  wind_turbine: [
    { id: 'blades', name: 'Cánh tuabin', function: 'Đón gió và quay để truyền cơ năng vào máy phát.', position: [0, 3.3, 0.18] },
    { id: 'hub', name: 'Moay-ơ / trục cánh', function: 'Gắn các cánh và truyền chuyển động quay.', position: [0, 2.52, 0.18] },
    { id: 'nacelle', name: 'Vỏ máy phát', function: 'Chứa máy phát điện nối với trục cánh quạt.', position: [0, 2.52, -0.12] },
    { id: 'tower', name: 'Tháp đỡ', function: 'Nâng máy phát lên cao và đỡ toàn bộ tuabin.', position: [0, 1.32, 0] },
    { id: 'base', name: 'Đế tuabin', function: 'Giữ mô hình tuabin đứng vững trên mặt bàn.', position: [0, 0.06, 0.2] },
  ],
  buzzer: [
    { id: 'housing', name: 'Vỏ còi', function: 'Bảo vệ bộ rung và các chi tiết điện bên trong.', position: [0, 0.32, 0] },
    { id: 'sound-aperture', name: 'Lỗ phát âm', function: 'Cho âm thanh từ bộ rung truyền ra ngoài.', position: [0, 0.54, 0] },
    { id: 'grill', name: 'Vành loa', function: 'Tạo mặt thoát âm phía trên còi.', position: [0, 0.54, 0] },
    { id: 'sound-waves', name: 'Vòng sóng âm', function: 'Minh họa âm thanh lan ra khi còi được cấp điện.', position: [0, 0.72, 0] },
    { id: 'base', name: 'Đế còi', function: 'Đỡ còi và giữ các cực nối dây.', position: [0, 0.06, 0.2] },
  ],
  resistor: [
    { id: 'ceramic-body', name: 'Thân điện trở', function: 'Tạo điện trở để hạn chế dòng điện trong mạch.', position: [0, 0.25, 0] },
    { id: 'color-bands', name: 'Vòng màu', function: 'Mã hóa trị số điện trở và sai số của linh kiện.', position: [-0.06, 0.25, 0] },
    { id: 'left-lead', name: 'Chân nối bên trái', function: 'Kết nối điện trở với một điểm trong mạch.', position: [-0.42, 0.25, 0] },
    { id: 'right-lead', name: 'Chân nối bên phải', function: 'Kết nối điện trở với điểm còn lại trong mạch.', position: [0.42, 0.25, 0] },
    { id: 'base', name: 'Đế linh kiện', function: 'Giữ điện trở cố định trên bàn thí nghiệm.', position: [0, 0.05, 0.2] },
  ],
  potentiometer: [
    { id: 'case', name: 'Vỏ biến trở', function: 'Chứa lớp điện trở và các điểm tiếp xúc.', position: [0, 0.2, 0] },
    { id: 'knob', name: 'Núm xoay', function: 'Xoay để thay đổi điện trở trong mạch.', position: [0, 0.44, 0] },
    { id: 'pointer', name: 'Kim chỉ thị', function: 'Cho biết vị trí điều chỉnh hiện tại của núm.', position: [0, 0.58, 0.16] },
    { id: 'terminals', name: 'Các chân biến trở', function: 'Nối hai đầu điện trở và tiếp điểm trượt vào mạch.', position: [0, 0.15, 0.25] },
    { id: 'base', name: 'Đế biến trở', function: 'Giữ linh kiện ổn định khi xoay núm.', position: [0, 0.06, 0.3] },
  ],
  fuse: [
    { id: 'glass-tube', name: 'Ống cầu chì', function: 'Bao kín dây chảy và cho phép nhìn thấy bên trong.', position: [0, 0.25, 0] },
    { id: 'fuse-wire', name: 'Dây chảy', function: 'Nóng chảy để ngắt mạch khi dòng điện quá lớn.', position: [0, 0.25, 0] },
    { id: 'end-caps', name: 'Nắp kim loại', function: 'Tiếp xúc với kẹp để đưa cầu chì vào mạch.', position: [0.38, 0.25, 0] },
    { id: 'clips', name: 'Kẹp giữ cầu chì', function: 'Giữ hai đầu cầu chì và kết nối với dây dẫn.', position: [0.42, 0.2, 0] },
    { id: 'base', name: 'Đế cầu chì', function: 'Cách điện và giữ hai kẹp đúng vị trí.', position: [0, 0.06, 0.2] },
  ],
  led: [
    { id: 'epoxy-dome', name: 'Vỏ LED', function: 'Bảo vệ chip LED và giúp định hướng ánh sáng.', position: [0, 0.35, 0] },
    { id: 'light-emitter', name: 'Chip phát sáng', function: 'Phát ra ánh sáng khi dòng điện đi đúng chiều.', position: [0, 0.45, 0] },
    { id: 'anode', name: 'Chân dương / anode (+)', function: 'Nhận dòng điện quy ước để LED phát sáng.', position: [-0.25, 0.2, 0] },
    { id: 'cathode', name: 'Chân âm / cathode (−)', function: 'Cho dòng điện đi ra; LED sẽ không sáng nếu mắc ngược.', position: [0.25, 0.2, 0] },
    { id: 'base', name: 'Đế LED', function: 'Giữ LED và cách điện với mặt bàn.', position: [0, 0.05, 0.2] },
  ],
};
