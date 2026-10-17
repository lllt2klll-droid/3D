import { Challenge } from '../types';
import { createComponent } from './templates';

export const STEM_CHALLENGES: Challenge[] = [
  {
    id: 1,
    title: 'Nhiệm vụ 1: Thắp sáng bóng đèn',
    subtitle: 'Lắp ráp mạch điện cơ bản khép kín',
    description:
      'Chào mừng nhà khoa học nhí! Hãy nối các dây dẫn từ Pin qua Công tắc tới Bóng đèn, sau đó gạt đóng công tắc để thắp sáng căn phòng nhé.',
    objective: 'Nối kín mạch điện và đóng công tắc sao cho bóng đèn phát sáng rực rỡ.',
    hint: 'Cần có 1 dây từ cực (+) của pin tới công tắc, 1 dây từ công tắc tới bóng đèn, và 1 dây từ bóng đèn trở về cực (−) của pin.',
    mode: 'circuit',
    predictionQuestion: 'Theo em, khi công tắc đang MỞ (nhấc lên), bóng đèn có sáng được không?',
    predictionOptions: [
      'Không sáng, vì mạch điện đang bị hở không có dòng điện chạy qua.',
      'Vẫn sáng, vì bóng đèn đã được cắm vào mạch rồi.',
    ],
    correctPredictionIndex: 0,
    predictionExplanation:
      'Chính xác! Khi công tắc mở, có một khoảng cách không khí ngăn cản các electron di chuyển, mạch bị hở nên đèn không thể sáng.',
    setupComponents: [
      createComponent('battery', 'bat-1', [-1.6, 0, 0]),
      createComponent('switch', 'sw-1', [0, 0, -1.2], { isOpen: true }),
      createComponent('bulb', 'bulb-1', [1.5, 0, 0]),
    ],
    setupWires: [],
    checkCondition: (analysis, components) => {
      const hasBulb = analysis.poweredComponentIds.some((id) => {
        const c = components.find((item) => item.id === id);
        return c?.type === 'bulb';
      });
      return analysis.isClosedCircuit && hasBulb;
    },
    successMessage: 'Tuyệt đỉnh! Em đã hoàn thành mạch điện kín đầu tiên. Bóng đèn đã tỏa sáng rực rỡ!',
    educationalTakeaway:
      'Bài học: Dòng điện chỉ có thể chạy qua khi mạch tạo thành một vòng khép kín không bị đứt đoạn từ cực dương về cực âm của nguồn.',
  },

  {
    id: 2,
    title: 'Nhiệm vụ 2: Bác sĩ sửa mạch hở',
    subtitle: 'Tìm và khắc phục đoạn dây bị thiếu',
    description:
      'Ôi không! Đèn của trạm nghiên cứu bỗng nhiên bị tắt. Em hãy quan sát kỹ mạch điện xem bị hở ở đâu và bổ sung dây dẫn còn thiếu nhé!',
    objective: 'Tìm vị trí bị hở mạch, nối thêm dây dẫn để khép kín mạch điện cho bóng đèn sáng.',
    hint: 'Hãy nhìn vào cực âm (-) của pin xem đã có dây nào nối từ bóng đèn quay về chưa nhé!',
    mode: 'circuit',
    predictionQuestion: 'Tại sao bóng đèn trong mạch này lại chưa sáng?',
    predictionOptions: [
      'Vì dây dẫn từ bóng đèn chưa nối về cực âm của pin (mạch bị hở).',
      'Vì pin đã hết điện hoàn toàn.',
    ],
    correctPredictionIndex: 0,
    predictionExplanation:
      'Đúng rồi! Cực âm của pin chưa được nối dây, vòng tuần hoàn của dòng điện bị đứt quãng.',
    setupComponents: [
      createComponent('battery', 'bat-1', [-1.6, 0, 0]),
      createComponent('switch', 'sw-1', [0, 0, -1.2], { isOpen: false }), // Switch already closed
      createComponent('bulb', 'bulb-1', [1.5, 0, 0]),
    ],
    setupWires: [
      {
        id: 'w-ch2-1',
        fromComponentId: 'bat-1',
        fromTerminalId: 'pos',
        toComponentId: 'sw-1',
        toTerminalId: 't1',
        color: 'red',
        hasCurrent: false,
        currentDirection: 1,
      },
      {
        id: 'w-ch2-2',
        fromComponentId: 'sw-1',
        fromTerminalId: 't2',
        toComponentId: 'bulb-1',
        toTerminalId: 't1',
        color: 'red',
        hasCurrent: false,
        currentDirection: 1,
      },
      // Missing return wire to negative terminal!
    ],
    checkCondition: (analysis, components) => {
      return (
        analysis.isClosedCircuit &&
        analysis.poweredComponentIds.some((id) => components.find((c) => c.id === id)?.type === 'bulb')
      );
    },
    successMessage: 'Bác sĩ mạch điện tài ba! Em đã tìm đúng chỗ hở và cứu trạm nghiên cứu có ánh sáng!',
    educationalTakeaway:
      'Bài học: Mạch điện luôn cần đường đi ra từ cực dương và đường trở về cực âm. Thiếu 1 trong 2 đường thì mạch sẽ bị hở.',
  },

  {
    id: 3,
    title: 'Nhiệm vụ 3: Cơn gió mùa hè',
    subtitle: 'Chuyển hóa điện năng thành cơ năng',
    description:
      'Hôm nay trời rất nóng! Em hãy lắp một chiếc quạt điện mini bằng cách nối Pin với Động cơ quạt qua Công tắc để xua tan cái nóng nhé.',
    objective: 'Nối hoàn chỉnh mạch quạt điện và đóng công tắc để cánh quạt quay tít.',
    hint: 'Nối từ cực dương pin -> công tắc -> chân quạt điện -> về cực âm pin, rồi nhấn vào công tắc để bật!',
    mode: 'circuit',
    predictionQuestion: 'Động cơ điện biến đổi điện năng của pin thành dạng năng lượng gì?',
    predictionOptions: [
      'Cơ năng (lực làm quay cánh quạt tạo gió).',
      'Nhiệt năng (làm lạnh không khí trực tiếp).',
    ],
    correctPredictionIndex: 0,
    predictionExplanation:
      'Chính xác 100%! Động cơ điện biến điện năng thành cơ năng chuyển động quay của trục quạt.',
    setupComponents: [
      createComponent('battery', 'bat-1', [-1.6, 0, 0]),
      createComponent('switch', 'sw-1', [0, 0, -1.2], { isOpen: true }),
      createComponent('fan', 'fan-1', [1.5, 0, 0]),
    ],
    setupWires: [],
    checkCondition: (analysis, components) => {
      return (
        analysis.isClosedCircuit &&
        analysis.poweredComponentIds.some((id) => components.find((c) => c.id === id)?.type === 'fan')
      );
    },
    successMessage: 'Gió mát quá! Cánh quạt đang quay vù vù tạo luồng gió mát rượi!',
    educationalTakeaway:
      'Bài học: Năng lượng không tự nhiên sinh ra mà chuyển hóa từ dạng này sang dạng khác (Điện năng -> Cơ năng quay).',
  },

  {
    id: 4,
    title: 'Nhiệm vụ 4: Năng lượng từ Mặt Trời',
    subtitle: 'Khám phá năng lượng sạch tái tạo',
    description:
      'Tấm pin mặt trời đã được nối với bóng đèn, nhưng trời đang nhiều mây nên đèn chưa sáng. Em hãy điều chỉnh tăng ánh sáng mặt trời để thắp sáng đèn nhé!',
    objective: 'Tăng cường độ ánh sáng mặt trời lên trên 60% để pin quang điện tạo đủ điện thắp sáng đèn.',
    hint: 'Kéo thanh trượt "Cường độ ánh sáng mặt trời" về phía bên phải để mặt trời tỏa sáng rực rỡ.',
    mode: 'energy',
    predictionQuestion: 'Tấm pin năng lượng mặt trời chuyển hóa dạng năng lượng nào thành điện năng?',
    predictionOptions: [
      'Quang năng (ánh sáng mặt trời) thành Điện năng.',
      'Gió trời thành Điện năng.',
    ],
    correctPredictionIndex: 0,
    predictionExplanation:
      'Đúng rồi! Các hạt photon ánh sáng mặt trời khi chiếu vào tế bào quang điện sẽ tạo ra dòng điện sạch.',
    setupComponents: [
      createComponent('solar_panel', 'solar-1', [-1.5, 0, 0], { sunlight: 0.1 }),
      createComponent('bulb', 'bulb-1', [1.5, 0, 0]),
    ],
    setupWires: [
      {
        id: 'w-s1',
        fromComponentId: 'solar-1',
        fromTerminalId: 'pos',
        toComponentId: 'bulb-1',
        toTerminalId: 't1',
        color: 'red',
        hasCurrent: false,
        currentDirection: 1,
      },
      {
        id: 'w-s2',
        fromComponentId: 'bulb-1',
        fromTerminalId: 't2',
        toComponentId: 'solar-1',
        toTerminalId: 'neg',
        color: 'black',
        hasCurrent: false,
        currentDirection: 1,
      },
    ],
    checkCondition: (analysis, _components, _wires, energyEnv) => {
      return (energyEnv?.sunlight ?? 0) >= 0.6 && analysis.isClosedCircuit;
    },
    successMessage: 'Ánh nắng ngập tràn! Tấm pin mặt trời đã tạo ra dòng điện sạch thắp sáng bóng đèn!',
    educationalTakeaway:
      'Bài học: Năng lượng mặt trời là nguồn năng lượng tái tạo vô tận, sạch và thân thiện với môi trường Trái Đất.',
  },

  {
    id: 5,
    title: 'Nhiệm vụ 5: Tuabin gió đón gió lớn',
    subtitle: 'Biến sức gió thành dòng điện',
    description:
      'Mô hình tuabin gió đã được nối với quạt làm mát. Hiện tại trời đang lặng gió (cấp 0). Hãy tăng tốc độ gió để tuabin quay và phát điện nhé!',
    objective: 'Điều chỉnh tốc độ gió lên cấp 3 trở lên để tuabin phát điện làm quay cánh quạt.',
    hint: 'Kéo thanh trượt "Tốc độ gió" lên mức 3, 4 hoặc 5 để luồng gió mạnh thổi vào cánh tuabin.',
    mode: 'energy',
    predictionQuestion: 'Sự khác biệt căn bản giữa Tuabin gió và Quạt điện là gì?',
    predictionOptions: [
      'Tuabin gió nhận gió để tạo ra điện, còn quạt nhận điện để tạo ra gió.',
      'Cả hai đều dùng pin để quay cánh quạt giống hệt nhau.',
    ],
    correctPredictionIndex: 0,
    predictionExplanation:
      'Rất chuẩn xác! Tuabin là máy phát điện dùng gió tự nhiên, còn quạt điện là thiết bị tiêu thụ điện để thổi gió.',
    setupComponents: [
      createComponent('wind_turbine', 'wind-1', [-1.6, 0, 0], { windSpeed: 0 }),
      createComponent('fan', 'fan-1', [1.5, 0, 0]),
    ],
    setupWires: [
      {
        id: 'w-w1',
        fromComponentId: 'wind-1',
        fromTerminalId: 'pos',
        toComponentId: 'fan-1',
        toTerminalId: 't1',
        color: 'blue',
        hasCurrent: false,
        currentDirection: 1,
      },
      {
        id: 'w-w2',
        fromComponentId: 'fan-1',
        fromTerminalId: 't2',
        toComponentId: 'wind-1',
        toTerminalId: 'neg',
        color: 'black',
        hasCurrent: false,
        currentDirection: 1,
      },
    ],
    checkCondition: (_analysis, _components, _wires, energyEnv) => {
      return (energyEnv?.windSpeed ?? 0) >= 3;
    },
    successMessage: 'Gió mạnh thổi qua! Tuabin quay tít và máy phát đã tạo ra điện năng tuyệt vời!',
    educationalTakeaway:
      'Bài học: Động năng của khối không khí chuyển động (gió) có thể được chuyển hóa thành điện năng thông qua máy phát điện.',
  },

  {
    id: 6,
    title: 'Nhiệm vụ 6: Cảnh sát an toàn điện',
    subtitle: 'Phát hiện và loại trừ chập mạch (đoản mạch)',
    description:
      'CẢNH BÁO! Một bạn học sinh vô tình nối tắt trực tiếp 2 cực (+) và (-) của pin bằng một sợi dây đồng mà không qua bóng đèn. Hãy ngắt dây chập mạch và mắc đúng qua bóng đèn!',
    objective: 'Xóa dây nối tắt giữa 2 cực pin và nối lại mạch an toàn qua bóng đèn.',
    hint: 'Bấm chọn sợi dây đang nối trực tiếp từ cực (+) sang cực (-) của pin rồi bấm "Xóa dây", sau đó nối lại qua bóng đèn.',
    mode: 'circuit',
    predictionQuestion: 'Tại sao nối tắt trực tiếp 2 cực của pin mà không qua bóng đèn lại nguy hiểm?',
    predictionOptions: [
      'Dòng điện tăng vọt cực lớn, làm pin nóng ran, hỏng hóc hoặc có nguy cơ cháy nổ.',
      'Chỉ làm bóng đèn sáng quá mức mà thôi.',
    ],
    correctPredictionIndex: 0,
    predictionExplanation:
      'Chính xác! Đoản mạch (chập điện) không có điện trở cản trở, dòng điện cực đại sinh ra nhiệt lượng rất lớn gây hỏa hoạn.',
    setupComponents: [
      createComponent('battery', 'bat-1', [-1.6, 0, 0]),
      createComponent('switch', 'sw-1', [0, 0, -1.2], { isOpen: false }),
      createComponent('bulb', 'bulb-1', [1.5, 0, 0]),
    ],
    setupWires: [
      // Dangerous short circuit wire directly connecting + and - of battery!
      {
        id: 'w-danger',
        fromComponentId: 'bat-1',
        fromTerminalId: 'pos',
        toComponentId: 'bat-1',
        toTerminalId: 'neg',
        color: 'red',
        hasCurrent: true,
        currentDirection: 1,
      },
    ],
    checkCondition: (analysis, components) => {
      const hasBulb = analysis.poweredComponentIds.some(
        (id) => components.find((c) => c.id === id)?.type === 'bulb'
      );
      return !analysis.isShortCircuit && analysis.isClosedCircuit && hasBulb;
    },
    successMessage: 'Xuất sắc! Em đã loại trừ nguy cơ chập mạch và lắp mạch điện an toàn, bóng đèn đã sáng!',
    educationalTakeaway:
      'Bài học an toàn: Luôn đảm bảo trong mạch điện có thiết bị tiêu thụ điện (như bóng đèn, quạt, điện trở) trước khi đóng mạch.',
  },
];
