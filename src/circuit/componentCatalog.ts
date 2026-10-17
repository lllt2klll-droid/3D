import { ComponentCatalogItem, ComponentType } from '../types';

export const COMPONENT_CATALOG: Record<ComponentType, ComponentCatalogItem> = {
  battery: {
    type: 'battery',
    name: 'Pin 1.5V',
    vietnameseName: 'Cục Pin (Nguồn điện)',
    iconName: 'Battery',
    category: 'source',
    shortDesc: 'Cung cấp năng lượng điện cho toàn bộ mạch.',
    fullDesc:
      'Pin là một thiết bị lưu trữ năng lượng hóa học và chuyển hóa thành điện năng. Mỗi viên pin có hai cực: cực dương (+) có núm nhô lên và cực âm (-) có đáy phẳng.',
    howItWorks:
      'Khi nối dây dẫn từ cực dương qua thiết bị tiêu thụ và về cực âm, phản ứng hóa học bên trong pin đẩy các hạt electron chuyển động tạo thành dòng điện.',
    funFact:
      'Viên pin đầu tiên trên thế giới được nhà bác học Alessandro Volta phát minh vào năm 1800 bằng cách xếp chồng các đĩa đồng và kẽm!',
    challengeQuestion: 'Nếu em chỉ nối 1 dây vào cực dương thì bóng đèn có sáng không? Tại sao?',
    specs: 'Điện áp: 1.5V DC | Dung lượng: AA Alkaline',
    defaultState: { voltage: 1.5 },
    terminals: [
      { id: 'pos', label: '+', polarity: 'positive', relativePosition: [0.65, 0.4, 0] },
      { id: 'neg', label: '−', polarity: 'negative', relativePosition: [-0.65, 0.4, 0] },
    ],
  },

  switch: {
    type: 'switch',
    name: 'Công tắc dao gạt',
    vietnameseName: 'Công tắc (Cầu dao)',
    iconName: 'ToggleLeft',
    category: 'control',
    shortDesc: 'Đóng hoặc ngắt dòng điện một cách an toàn.',
    fullDesc:
      'Công tắc là người bảo vệ điều khiển dòng điện trong gia đình em. Khi đóng công tắc, thanh kim loại chạm vào chốt giúp mạch kín. Khi mở công tắc, thanh kim loại nhấc lên tạo khe hở không khí làm mạch hở.',
    howItWorks:
      'Không khí bình thường không dẫn điện. Khi nhấc cần gạt lên (MỞ/OFF), mạch bị ngắt quãng nên dòng điện lập tức dừng lại.',
    funFact:
      'Công tắc đèn trong phòng em hoạt động cùng một nguyên lý với chiếc cầu dao dao gạt đồ chơi này đấy!',
    challengeQuestion: 'Tại sao chúng ta không nên chạm vào công tắc điện khi tay đang ướt?',
    specs: 'Điện áp chịu tải tối đa: 12V | Trạng thái: Gạt tay',
    defaultState: { isOpen: true }, // Starts open (OFF)
    terminals: [
      { id: 't1', label: 'A', polarity: 'neutral', relativePosition: [-0.6, 0.25, 0] },
      { id: 't2', label: 'B', polarity: 'neutral', relativePosition: [0.6, 0.25, 0] },
    ],
  },

  bulb: {
    type: 'bulb',
    name: 'Bóng đèn dây tóc',
    vietnameseName: 'Bóng đèn sợi đốt',
    iconName: 'Lightbulb',
    category: 'load',
    shortDesc: 'Biến điện năng thành quang năng (ánh sáng).',
    fullDesc:
      'Bóng đèn gồm một vỏ thủy tinh trong suốt, bên trong có sợi dây vonfram mảnh xoắn ốc gọi là dây tóc đèn. Khi dòng điện chạy qua, dây tóc nóng rực lên và phát ra ánh sáng vàng ấm áp.',
    howItWorks:
      'Dòng điện đi vào một chân tiếp xúc ở đui đèn, chạy qua sợi dây tóc làm nó nóng lên hơn 2000°C và phát sáng, sau đó thoát ra ở chân tiếp xúc thứ hai.',
    funFact:
      'Thomas Edison đã thử nghiệm hơn 6.000 vật liệu khác nhau trước khi tìm ra sợi carbon và vonfram để tạo ra bóng đèn thương mại đầu tiên.',
    challengeQuestion: 'Điều gì sẽ xảy ra nếu sợi dây tóc bên trong bóng đèn bị đứt?',
    specs: 'Điện áp định mức: 1.5V - 3V | Công suất: 0.5W',
    defaultState: { isLit: false, brightness: 0 },
    terminals: [
      { id: 't1', label: '1', polarity: 'neutral', relativePosition: [-0.45, 0.2, 0] },
      { id: 't2', label: '2', polarity: 'neutral', relativePosition: [0.45, 0.2, 0] },
    ],
  },

  motor: {
    type: 'motor',
    name: 'Động cơ điện mini',
    vietnameseName: 'Động cơ DC mini',
    iconName: 'Zap',
    category: 'load',
    shortDesc: 'Biến đổi điện năng thành cơ năng chuyển động quay.',
    fullDesc:
      'Động cơ điện có mặt ở khắp mọi nơi: đồ chơi xe điều khiển, máy sấy tóc, máy giặt và xe điện. Khi có dòng điện chạy qua cuộn dây bên trong, nam châm sẽ tạo ra lực đẩy làm trục quay liên tục.',
    howItWorks:
      'Nguyên lý cảm ứng điện từ: dòng điện tạo ra từ trường quanh cuộn dây, từ trường này tương tác với nam châm vĩnh cửu tạo ra lực quay xoay trục.',
    funFact:
      'Nếu em đảo ngược 2 dây nối cực của động cơ, trục sẽ quay theo chiều ngược lại!',
    challengeQuestion: 'Kể tên 3 đồ vật trong nhà em có sử dụng động cơ điện?',
    specs: 'Điện áp: 1.5V - 6V DC | Vòng quay: 3000 RPM',
    defaultState: { isSpinning: false, speed: 0 },
    terminals: [
      { id: 't1', label: '+', polarity: 'neutral', relativePosition: [-0.4, 0.2, 0.3] },
      { id: 't2', label: '−', polarity: 'neutral', relativePosition: [0.4, 0.2, 0.3] },
    ],
  },

  fan: {
    type: 'fan',
    name: 'Quạt điện STEM',
    vietnameseName: 'Quạt gió động cơ',
    iconName: 'Fan',
    category: 'load',
    shortDesc: 'Cánh quạt quay đẩy luồng không khí tạo gió mát.',
    fullDesc:
      'Chiếc quạt này được gắn cánh quạt khí động học trực tiếp vào trục động cơ điện. Khi được nối đúng mạch kín, quạt sẽ quay tít tạo luồng gió mát lành.',
    howItWorks:
      'Điện năng từ pin làm quay rotor động cơ, các cánh quạt nghiêng góc đẩy các phân tử không khí về phía trước tạo thành gió.',
    funFact:
      'Cánh quạt máy bay trực thăng hoạt động theo nguyên lý tương tự như cánh quạt điện nhỏ này, nhưng nâng cả chiếc máy bay lên trời!',
    challengeQuestion: 'Làm thế nào để chiếc quạt quay nhanh hơn bằng cách thêm pin?',
    specs: 'Số cánh: 3 cánh cong | Đường kính: 70mm',
    defaultState: { isSpinning: false, speed: 0 },
    terminals: [
      { id: 't1', label: '1', polarity: 'neutral', relativePosition: [-0.5, 0.2, 0.2] },
      { id: 't2', label: '2', polarity: 'neutral', relativePosition: [0.5, 0.2, 0.2] },
    ],
  },

  solar_panel: {
    type: 'solar_panel',
    name: 'Tấm pin năng lượng mặt trời',
    vietnameseName: 'Tấm pin Mặt Trời (Quang điện)',
    iconName: 'Sun',
    category: 'source',
    shortDesc: 'Biến ánh sáng mặt trời sạch thành dòng điện miễn phí.',
    fullDesc:
      'Tấm pin mặt trời gồm các tế bào quang điện bằng vật liệu silic màu xanh sẫm. Khi các hạt photon ánh sáng mặt trời chiếu vào, chúng kích thích các electron giải phóng tạo thành dòng điện sạch.',
    howItWorks:
      'Hiệu ứng quang điện: Cường độ ánh sáng càng mạnh (trời càng nắng) thì tấm pin tạo ra dòng điện càng lớn để chạy quạt hoặc thắp sáng đèn.',
    funFact:
      'Trạm vũ trụ Quốc tế ISS bay ngoài không gian sử dụng các tấm pin mặt trời khổng lồ dài bằng cả sân bay để hoạt động!',
    challengeQuestion: 'Vào ban đêm hoặc khi trời mưa mây đen, tấm pin mặt trời có tạo ra điện không?',
    specs: 'Điện áp cực đại: 3V | Công nghệ: Monocrystalline',
    defaultState: { sunlight: 0.8, energyOutput: 2.4 },
    terminals: [
      { id: 'pos', label: '+', polarity: 'positive', relativePosition: [0.55, 0.2, 0.4] },
      { id: 'neg', label: '−', polarity: 'negative', relativePosition: [-0.55, 0.2, 0.4] },
    ],
  },

  wind_turbine: {
    type: 'wind_turbine',
    name: 'Tuabin gió phát điện',
    vietnameseName: 'Máy phát điện sức gió',
    iconName: 'Wind',
    category: 'source',
    shortDesc: 'Đón luồng gió tự nhiên để quay máy phát sinh ra điện.',
    fullDesc:
      'Tuabin gió là một tháp cao đón gió với 3 cánh quạt lớn màu trắng. Khác với quạt điện (dùng điện để tạo gió), tuabin gió dùng lực của gió để quay cánh quạt và tạo ra điện sạch.',
    howItWorks:
      'Gió thổi làm quay 3 cánh quạt -> trục quay kéo máy phát điện (dynamo) bên trong thân tuabin quay theo -> biến động năng thành điện năng.',
    funFact:
      'Một tuabin gió khổng lồ hiện đại ngoài biển có thể cung cấp đủ điện cho một gia đình dùng cả năm chỉ sau 1 vòng quay!',
    challengeQuestion: 'Sự khác biệt lớn nhất giữa Quạt điện và Tuabin gió là gì?',
    specs: 'Chiều cao mô hình: 180mm | Cánh quạt: 3 cánh khí động học',
    defaultState: { windSpeed: 3, energyOutput: 2.0 },
    terminals: [
      { id: 'pos', label: '+', polarity: 'positive', relativePosition: [0.35, 0.15, 0] },
      { id: 'neg', label: '−', polarity: 'negative', relativePosition: [-0.35, 0.15, 0] },
    ],
  },

  resistor: {
    type: 'resistor',
    name: 'Điện trở',
    vietnameseName: 'Điện trở cố định',
    iconName: 'Activity',
    category: 'passive',
    shortDesc: 'Cản trở và điều tiết cường độ dòng điện trong mạch.',
    fullDesc:
      'Điện trở giống như một đoạn đường gồ ghề làm giảm tốc độ của dòng điện, giúp bảo vệ các linh kiện nhạy cảm như đèn LED khỏi bị cháy khi điện áp quá cao.',
    howItWorks:
      'Vật liệu bên trong điện trở cản trở sự chuyển động của các electron, tiêu tán bớt năng lượng dưới dạng nhiệt nhỏ.',
    funFact:
      'Các vạch màu sơn trên thân điện trở chính là một bảng mật mã màu quốc tế để đọc giá trị điện trở!',
    challengeQuestion: 'Nếu tăng giá trị điện trở lên rất lớn thì bóng đèn sẽ sáng hơn hay mờ đi?',
    specs: 'Trị số: 100 Ohm | Sai số: 5% (Vạch vàng - tím - nâu)',
    defaultState: { resistance: 100 },
    terminals: [
      { id: 't1', label: '1', polarity: 'neutral', relativePosition: [-0.4, 0.15, 0] },
      { id: 't2', label: '2', polarity: 'neutral', relativePosition: [0.4, 0.15, 0] },
    ],
  },

  led: {
    type: 'led',
    name: 'Đèn LED siêu sáng',
    vietnameseName: 'Đi-ốt phát quang (LED)',
    iconName: 'Sparkles',
    category: 'load',
    shortDesc: 'Đèn bán dẫn hiện đại, tiết kiệm điện năng.',
    fullDesc:
      'LED là viết tắt của Light Emitting Diode. Đèn LED chỉ cho dòng điện chạy qua theo một chiều duy nhất: từ chân dài (Anode +) sang chân ngắn (Cathode -).',
    howItWorks:
      'Khi các electron rơi vào các lỗ trống trong chất bán dẫn, chúng phát ra các hạt photon ánh sáng rực rỡ mà tỏa rất ít nhiệt.',
    funFact:
      'Đèn pin điện thoại, màn hình tivi và đèn giao thông ngày nay hầu như đều dùng công nghệ LED siêu bền!',
    challengeQuestion: 'Nếu nối ngược cực của đèn LED thì nó có phát sáng không?',
    specs: 'Màu: Đỏ / Xanh | Điện áp ngưỡng: 2.0V',
    defaultState: { isLit: false, color: '#ef4444' },
    terminals: [
      { id: 'anode', label: '+', polarity: 'anode', relativePosition: [-0.25, 0.2, 0] },
      { id: 'cathode', label: '−', polarity: 'cathode', relativePosition: [0.25, 0.2, 0] },
    ],
  },

  battery_pack: {
    type: 'battery_pack',
    name: 'Hộp 2 Pin 3V',
    vietnameseName: 'Bộ nguồn 2 Pin mắc nối tiếp',
    iconName: 'BatteryCharging',
    category: 'source',
    shortDesc: 'Cung cấp nguồn điện 3V mạnh gấp đôi pin đơn.',
    fullDesc:
      'Hộp 2 viên pin AA được mắc nối tiếp với nhau. Cực âm của viên pin thứ nhất nối với cực dương của viên pin thứ hai, làm tổng điện áp tăng lên: 1.5V + 1.5V = 3V!',
    howItWorks:
      'Khi mắc nối tiếp hai nguồn điện, năng lượng đẩy electron của hai viên pin cộng gộp lại, tạo ra điện áp lớn hơn giúp bóng đèn sáng rực rỡ và động cơ quay tít hơn.',
    funFact:
      'Chiếc điều khiển tivi ở nhà em thường dùng 2 viên pin AA hoặc AAA mắc nối tiếp để đạt điện áp 3V đấy!',
    challengeQuestion: 'Nếu lắp ngược cực 1 trong 2 viên pin trong hộp thì điều gì sẽ xảy ra?',
    specs: 'Điện áp: 3.0V DC (2x 1.5V AA) | Mắc nối tiếp',
    defaultState: { voltage: 3.0 },
    terminals: [
      { id: 'pos', label: '+', polarity: 'positive', relativePosition: [0.65, 0.28, 0.32] },
      { id: 'neg', label: '−', polarity: 'negative', relativePosition: [-0.65, 0.28, -0.32] },
    ],
  },

  push_button: {
    type: 'push_button',
    name: 'Nút bấm chuông',
    vietnameseName: 'Công tắc nút nhấn (Nhấn nhả)',
    iconName: 'Radio',
    category: 'control',
    shortDesc: 'Nhấn giữ để đóng mạch, nhả tay ra để ngắt mạch.',
    fullDesc:
      'Khác với công tắc gạt dao (gạt xong giữ nguyên vị trí), nút bấm có lò xo đàn hồi bên trong. Khi em nhấn ngón tay xuống, hai tiếp điểm chạm nhau làm mạch kín; khi buông tay, lò xo đẩy nút lên làm mạch hở ngay lập tức.',
    howItWorks:
      'Dùng trong chuông cửa nhà hoặc phím bấm còi xe: chỉ khi nào người dùng nhấn giữ nút thì chuông/còi mới kêu, buông tay là dừng lại.',
    funFact:
      'Bàn phím máy tính em đang gõ cũng gồm hàng trăm chiếc nút bấm tí hon hoạt động theo nguyên lý này!',
    challengeQuestion: 'Tại sao chuông cửa lại dùng nút bấm nhấn nhả mà không dùng công tắc gạt giữ nguyên?',
    specs: 'Loại: Nút ấn Momentary | Tải tối đa: 12V 1A',
    defaultState: { isPressed: false },
    terminals: [
      { id: 't1', label: '1', polarity: 'neutral', relativePosition: [-0.45, 0.2, 0] },
      { id: 't2', label: '2', polarity: 'neutral', relativePosition: [0.45, 0.2, 0] },
    ],
  },

  buzzer: {
    type: 'buzzer',
    name: 'Còi báo động',
    vietnameseName: 'Còi chip / Chuông điện Piezo',
    iconName: 'Volume2',
    category: 'load',
    shortDesc: 'Phát ra âm thanh tiếng kêu bíp bíp vui tai khi có điện.',
    fullDesc:
      'Còi báo động sử dụng đĩa gốm thạch anh áp điện (piezoelectric) hoặc màng loa điện từ tí hon. Khi dòng điện đi qua, màng loa rung động cực nhanh trong không khí tạo nên sóng âm thanh phát ra tiếng bíp.',
    howItWorks:
      'Còi có phân biệt cực: dây dương (+) nối vào cực dương còi, dây âm (-) nối về cực âm. Khi mạch kín, còi rung liên tục phát tiếng kêu cảnh báo.',
    funFact:
      'Tiếng bíp bíp khi lò vi sóng nấu xong hay khi máy quét mã vạch ở siêu thị kêu "tít" đều do chiếc còi nhỏ này phát ra đấy!',
    challengeQuestion: 'Em có thể kết hợp Nút bấm và Còi báo để làm mô hình chiếc chuông cửa không?',
    specs: 'Tần số âm thanh: 880Hz (Nốt La) | Âm lượng: 80dB',
    defaultState: { isBeeping: false },
    terminals: [
      { id: 'pos', label: '+', polarity: 'positive', relativePosition: [0.45, 0.2, 0] },
      { id: 'neg', label: '−', polarity: 'negative', relativePosition: [-0.45, 0.2, 0] },
    ],
  },

  potentiometer: {
    type: 'potentiometer',
    name: 'Biến trở xoay',
    vietnameseName: 'Chiết áp / Núm vặn điều tốc',
    iconName: 'SlidersHorizontal',
    category: 'passive',
    shortDesc: 'Vặn núm để tăng giảm độ sáng đèn hoặc tốc độ quạt.',
    fullDesc:
      'Biến trở là một điện trở có thể thay đổi trị số bằng cách xoay núm vặn. Bên trong có một con chạy trượt trên dải vật liệu dẫn điện: vặn núm làm thay đổi chiều dài đoạn đường dòng điện đi qua.',
    howItWorks:
      'Đường đi càng ngắn -> Điện trở càng nhỏ -> Dòng điện qua càng mạnh (đèn sáng hơn). Đường đi càng dài -> Điện trở càng lớn -> Dòng điện yếu đi (đèn mờ đi).',
    funFact:
      'Núm vặn chỉnh âm lượng to nhỏ trên loa đài chính là một chiếc biến trở xoay như thế này!',
    challengeQuestion: 'Muốn chiếc quạt quay nhanh nhất, em nên vặn biến trở về mức điện trở lớn hay nhỏ?',
    specs: 'Dải điện trở: 0 - 200 Ohm | Góc xoay: 270 độ',
    defaultState: { resistance: 50 },
    terminals: [
      { id: 't1', label: '1', polarity: 'neutral', relativePosition: [-0.5, 0.2, 0] },
      { id: 't2', label: '2', polarity: 'neutral', relativePosition: [0.5, 0.2, 0] },
    ],
  },

  fuse: {
    type: 'fuse',
    name: 'Cầu chì an toàn',
    vietnameseName: 'Cầu chì ống bảo vệ quá tải',
    iconName: 'ShieldCheck',
    category: 'control',
    shortDesc: 'Tự động đứt dây khi chập mạch để bảo vệ toàn bộ hệ thống.',
    fullDesc:
      'Cầu chì là thiết bị bảo vệ an toàn quan trọng nhất trong mọi mạch điện. Bên trong ống thủy tinh có sợi dây chì mảnh với nhiệt độ nóng chảy thấp.',
    howItWorks:
      'Khi xảy ra hiện tượng chập mạch (đoản mạch), dòng điện tăng vọt cực lớn làm sợi dây chì nóng rực và đứt lìa ngay lập tức. Mạch điện bị ngắt, cứu pin khỏi bị nổ và ngăn ngừa cháy nhà!',
    funFact:
      'Trong hộp cầu chì gia đình và trên xe ô tô luôn có hàng chục chiếc cầu chì để bảo vệ các thiết bị đắt tiền.',
    challengeQuestion: 'Tại sao khi cầu chì bị đứt, chúng ta tuyệt đối không được dùng sợi dây đồng dày để thay thế?',
    specs: 'Dòng điện định mức: 1.0A | Ống thủy tinh bảo vệ',
    defaultState: { isBlown: false },
    terminals: [
      { id: 't1', label: '1', polarity: 'neutral', relativePosition: [-0.55, 0.2, 0] },
      { id: 't2', label: '2', polarity: 'neutral', relativePosition: [0.55, 0.2, 0] },
    ],
  },
};
