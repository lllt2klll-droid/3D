# STEM 3D – Khám phá thế giới điện
### *Little STEM Lab – Interactive 3D Electricity*

Một ứng dụng web giáo dục STEM 3D tương tác hoàn chỉnh, được thiết kế chuyên biệt cho học sinh tiểu học (lớp 3 đến lớp 5), giúp các em học tập vật lý và điện học thông qua quan sát trực quan, tự tay nối mạch và thử nghiệm các mô hình năng lượng tái tạo.

Triển khai miễn phí 100% trên **GitHub Pages** không cần backend, không cần database hay API trả phí.

---

## 🌟 Tính năng nổi bật

### 1. Mô hình 3D tương tác chân thực
- **Three.js PBR Engine**: Sử dụng vật liệu đổ bóng mềm, bo góc tròn thân thiện, màu sắc tươi sáng theo phong cách *Playful 3D + Bright STEM Laboratory*.
- **Mô hình linh kiện đầy đủ**:
  - **Pin 1.5V**: Cực dương (+) có chốt vàng, cực âm (-) có đáy phẳng.
  - **Công tắc dao gạt**: Cần gạt bằng đồng chuyển động quay thực sự khi đóng/ngắt (kèm âm thanh cơ học chân thực).
  - **Bóng đèn dây tóc**: Vỏ thủy tinh trong suốt, dây tóc vonfram xoắn ốc rực sáng và tỏa ánh sáng vàng ấm áp khi mạch kín.
  - **Động cơ điện & Quạt STEM**: Trục động cơ và 3 cánh quạt khí động học quay tít khi được cấp điện.
  - **Tấm pin Mặt Trời**: Mảng tế bào quang điện màu xanh với khung gỗ và giá đỡ nghiêng đón nắng.
  - **Tuabin gió**: Tháp cao, vỏ máy (nacelle) màu xanh và 3 cánh quạt đón gió quay theo tốc độ gió thực.
  - **Điện trở & Đèn LED**: Mở rộng kiến thức về linh kiện cản dòng và phát quang bán dẫn.

### 2. Thuật toán mô phỏng mạch điện bằng đồ thị (Graph Simulation)
- Không chỉ đếm số dây dẫn mà duyệt đường đi thực tế từ cực dương (+) qua các tải tiêu thụ về cực âm (-).
- **Phát hiện chập mạch (đoản mạch)**: Tự động phát hiện khi cực (+) và (-) bị nối trực tiếp mà không qua tải, cảnh báo an toàn sư phạm bằng âm thanh và giao diện cảnh báo đỏ.
- **Chẩn đoán mạch hở**: Gợi ý chính xác vị trí mạch bị hở (công tắc chưa đóng, linh kiện mới nối 1 đầu, thiếu đường dây về cực âm).
- **Hạt dòng điện chuyển động**: Các hạt sáng chuyển động dọc theo đường cong dây dẫn 3D khi mạch kín để học sinh quan sát chiều dòng điện.

### 3. Âm thanh mô phỏng thời gian thực (Web Audio API Synth)
- Sử dụng công nghệ tổng hợp âm thanh trực tiếp của trình duyệt: tiếng "tách" công tắc, tiếng chuông ấm khi đèn bật, tiếng quạt gió quay, âm cảnh báo chập mạch và nhạc chiến thắng khi hoàn thành thử thách.
- 100% không phụ thuộc file MP3/WAV bên ngoài, không lo lỗi 404 khi triển khai.

---

## 🧭 4 Chế độ học tập

| Chế độ | Mô tả |
| :--- | :--- |
| 🔍 **1. Quan sát 3D** | Xoay 360°, phóng to/thu nhỏ, khám phá từng bộ phận, cấu tạo, nguyên lý và câu hỏi tư duy cho từng linh kiện. |
| ⚡ **2. Lắp mạch điện** | Bàn thí nghiệm tự do: chọn linh kiện, nối dây (đỏ, đen, vàng, xanh), bật/tắt công tắc, nạp các mẫu mạch có sẵn. |
| ☀️ **3. Năng lượng xanh** | Mô hình ốc đảo xanh diorama với ngôi nhà STEM, trượt chỉnh mức nắng (0-100%) và tốc độ gió (cấp 0-5) để quan sát chuyển hóa năng lượng sạch. |
| 🏆 **4. Thử thách STEM** | 6 nhiệm vụ theo lộ trình sư phạm: Thắp sáng đèn, Bác sĩ sửa mạch hở, Quạt điện mùa hè, Pin mặt trời, Tuabin gió và Cảnh sát an toàn điện. Có câu hỏi dự đoán trước khi làm! |

---

## 🛠️ Công nghệ sử dụng

- **Frontend Core**: React 19 + TypeScript + Vite 6
- **3D Graphics**: Three.js + OrbitControls + Custom Bezier Wire Renderer
- **Icons**: Lucide React
- **Audio Engine**: Web Audio API Procedural Synthesizer
- **Typography**: Google Font `Quicksand` (hỗ trợ font fallback hệ thống)
- **Deployment**: GitHub Pages qua GitHub Actions

---

## 💻 Hướng dẫn chạy trên máy tính cá nhân (Local)

### Bước 1: Chuẩn bị môi trường
Yêu cầu đã cài đặt **Node.js** (khuyến nghị phiên bản 18, 20 hoặc 22+).

### Bước 2: Cài đặt thư viện
Mở Terminal hoặc PowerShell tại thư mục dự án và chạy:
```bash
npm install
```

### Bước 3: Chạy môi trường phát triển
```bash
npm run dev
```
Trình duyệt sẽ tự động mở tại địa chỉ `http://localhost:3000` (hoặc cổng hiển thị trên terminal).

### Bước 4: Chạy kiểm thử tự động (Unit Tests)
```bash
npm run test
```
Kiểm tra 7 bộ test về phân tích đồ thị mạch kín, mạch hở, chập mạch, pin mặt trời và tuabin gió.

### Bước 5: Build sản phẩm hoàn chỉnh
```bash
npm run build
```
Thư mục `dist/` sẽ được tạo ra với các đường dẫn tương đối `./` sẵn sàng cho triển khai web.

---

## 🚀 Hướng dẫn triển khai miễn phí lên GitHub Pages

Dự án đã được cấu hình sẵn tệp workflow `.github/workflows/deploy.yml` tự động build và deploy lên GitHub Pages mỗi khi bạn đẩy code lên nhánh `main`.

### Các bước thực hiện:

1. **Tạo repository mới trên GitHub**:
   - Truy cập [GitHub](https://github.com/new) và tạo một repo mới (ví dụ: `stem-3d-electricity` hoặc `3D`).
   - Đặt quyền xem là **Public**.

2. **Đẩy mã nguồn lên GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: complete 3D STEM electricity educational web app"
   git branch -M main
   git remote add origin https://github.com/<tai-khoan-cua-ban>/<ten-repository>.git
   git push -u origin main
   ```

3. **Kích hoạt GitHub Pages**:
   - Truy cập vào trang repository trên GitHub của bạn.
   - Nhấn vào tab **Settings** > chọn mục **Pages** ở thanh menu bên trái.
   - Tại phần **Build and deployment** > **Source**, chọn:
     👉 **GitHub Actions**
   - Không cần chọn branch nào khác vì workflow `.github/workflows/deploy.yml` sẽ tự động xử lý.

4. **Xem thành quả**:
   - Chờ khoảng 1-2 phút cho workflow chạy xong trong tab **Actions**.
   - Website của bạn sẽ hoạt động tại đường dẫn:
     `https://<tai-khoan-cua-ban>.github.io/<ten-repository>/`

> **Lưu ý**: Nhờ cấu hình `base: './'` trong `vite.config.ts`, trang web sẽ luôn tải đúng tất cả hình ảnh, icon và script trên bất kỳ tên miền hoặc thư mục con nào mà không bao giờ gặp lỗi đường dẫn 404!

---

## 📂 Cấu trúc thư mục

```
3D/
├── .github/workflows/deploy.yml    # Workflow tự động deploy lên GitHub Pages
├── index.html                      # Tệp HTML chính nạp Font Quicksand
├── package.json                    # Cấu hình gói và script
├── vite.config.ts                  # Cấu hình Vite với base: './'
├── src/
│   ├── main.tsx                    # Điểm khởi đầu ứng dụng
│   ├── App.tsx                     # Điều phối giao diện và 4 chế độ học tập
│   ├── index.css                   # Hệ thống kiểu dáng UI, nút 3D, hiệu ứng
│   ├── types/
│   │   └── index.ts                # Định nghĩa kiểu dữ liệu mạch điện, linh kiện
│   ├── audio/
│   │   └── soundEffects.ts         # Bộ tổng hợp âm thanh Web Audio API
│   ├── circuit/
│   │   ├── circuitEngine.ts        # Thuật toán duyệt đồ thị phân tích mạch kín/hở/chập
│   │   ├── circuitEngine.test.ts   # 7 bộ kiểm thử tự động
│   │   ├── componentCatalog.ts     # Dữ liệu giáo dục sư phạm cho 9 linh kiện
│   │   ├── templates.ts            # Các mẫu mạch có sẵn
│   │   └── challenges.ts           # 6 thử thách STEM sư phạm
│   ├── scene/
│   │   ├── ThreeViewer.ts          # Quản lý WebGL, camera, ánh sáng và raycasting
│   │   ├── materials.ts            # Bảng màu vật liệu PBR tươi sáng
│   │   ├── WireRenderer.ts         # Vẽ dây dẫn 3D Bezier & hạt dòng điện chuyển động
│   │   └── models/
│   │       ├── BaseDiorama.ts      # Đảo 3D nổi, ngôi nhà STEM và rặng cây xanh
│   │       ├── BatteryModel.ts     # Mô hình pin 1.5V & 9V
│   │       ├── BulbModel.ts        # Mô hình bóng đèn dây tóc phát sáng
│   │       ├── SwitchModel.ts      # Mô hình công tắc dao gạt cơ học
│   │       ├── MotorFanModel.ts    # Mô hình động cơ và cánh quạt quay
│   │       ├── SolarPanelModel.ts  # Mô hình tấm pin năng lượng mặt trời
│   │       ├── WindTurbineModel.ts # Mô hình tuabin gió 3 cánh
│   │       ├── ResistorModel.ts    # Mô hình điện trở vạch màu
│   │       └── LedModel.ts         # Mô hình đi-ốt phát quang LED
│   └── components/
│       ├── Navbar.tsx              # Thanh điều hướng và tiện ích
│       ├── CircuitToolbar.tsx      # Thanh công cụ thêm linh kiện & màu dây
│       ├── CircuitStatusAlert.tsx  # Thanh chẩn đoán trạng thái mạch thời gian thực
│       ├── ComponentInfoModal.tsx  # Hộp thoại giải thích cấu tạo và nguyên lý
│       ├── TemplatesModal.tsx      # Hộp thoại chọn mẫu mạch có sẵn
│       ├── EnergyControls.tsx      # Bảng điều khiển thanh trượt nắng & gió
│       ├── MissionPanel.tsx        # Bảng câu hỏi dự đoán & nhiệm vụ thử thách
│       ├── HelpGuideModal.tsx      # Hướng dẫn thao tác 3D và an toàn điện
│       └── ConfettiCelebration.tsx # Hiệu ứng pháo hoa chúc mừng
└── dist/                           # Bản build production sẵn sàng triển khai
```

---

## 🎓 Tính sư phạm & An toàn

1. **Chu trình khám phá khoa học 5 bước**:
   - **Quan sát**: Nhìn cấu tạo 3D của các chốt cực kim loại, dây tóc, cuộn dây rotor.
   - **Dự đoán**: Trả lời câu hỏi phán đoán trước khi gạt công tắc.
   - **Thao tác**: Tự tay bấm nối các đầu dây.
   - **Kiểm tra**: Quan sát đèn bật sáng, quạt quay hoặc âm thanh phản hồi.
   - **Giải thích**: Đọc giải thích nguyên lý khoa học dễ hiểu.
2. **Ý thức an toàn điện**:
   - Cảnh báo trực quan ngay khi học sinh mắc lỗi chập mạch (nối tắt 2 cực pin).
   - Nhắc nhở quy tắc an toàn: tuyệt đối không nghịch hoặc cắm que sắt vào ổ điện gia đình 220V ngoài đời thực.

---
© 2026 **Little STEM Lab – Khám phá thế giới điện**. Được thiết kế và phát triển với tình yêu khoa học dành cho các bạn nhỏ!
