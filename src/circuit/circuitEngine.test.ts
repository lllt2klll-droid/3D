import { analyzeCircuit, isSource, isLoad } from './circuitEngine';
import { createComponent } from './templates';
import { Wire } from '../types';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`❌ Test Failed: ${message}`);
  }
  console.log(`✅ Passed: ${message}`);
}

console.log('--- BẮT ĐẦU KIỂM THỬ HỆ THỐNG MẠCH ĐIỆN STEM 3D ---\n');

// Test 1: Empty Circuit
{
  const res = analyzeCircuit([], []);
  assert(!res.isClosedCircuit, 'Mạch trống không được coi là mạch kín');
  assert(!res.isShortCircuit, 'Mạch trống không bị chập mạch');
  assert(res.poweredComponentIds.length === 0, 'Không có linh kiện nào hoạt động');
}

// Test 2: Battery with Open Switch and Bulb (Switch OFF)
{
  const bat = createComponent('battery', 'bat-1', [-1, 0, 0]);
  const sw = createComponent('switch', 'sw-1', [0, 0, 0], { isOpen: true });
  const bulb = createComponent('bulb', 'bulb-1', [1, 0, 0]);

  const wires: Wire[] = [
    {
      id: 'w1',
      fromComponentId: 'bat-1',
      fromTerminalId: 'pos',
      toComponentId: 'sw-1',
      toTerminalId: 't1',
      color: 'red',
      hasCurrent: false,
      currentDirection: 1,
    },
    {
      id: 'w2',
      fromComponentId: 'sw-1',
      fromTerminalId: 't2',
      toComponentId: 'bulb-1',
      toTerminalId: 't1',
      color: 'red',
      hasCurrent: false,
      currentDirection: 1,
    },
    {
      id: 'w3',
      fromComponentId: 'bulb-1',
      fromTerminalId: 't2',
      toComponentId: 'bat-1',
      toTerminalId: 'neg',
      color: 'black',
      hasCurrent: false,
      currentDirection: 1,
    },
  ];

  const res = analyzeCircuit([bat, sw, bulb], wires);
  assert(!res.isClosedCircuit, 'Khi công tắc MỞ (OFF), mạch phải hở');
  assert(!res.poweredComponentIds.includes('bulb-1'), 'Bóng đèn phải tắt khi công tắc mở');
  assert(res.pedagogicalHint.includes('công tắc'), 'Gợi ý sư phạm phải nhắc đến việc đóng công tắc');
}

// Test 3: Battery with Closed Switch and Bulb (Switch ON)
{
  const bat = createComponent('battery', 'bat-1', [-1, 0, 0]);
  const sw = createComponent('switch', 'sw-1', [0, 0, 0], { isOpen: false }); // Closed!
  const bulb = createComponent('bulb', 'bulb-1', [1, 0, 0]);

  const wires: Wire[] = [
    {
      id: 'w1',
      fromComponentId: 'bat-1',
      fromTerminalId: 'pos',
      toComponentId: 'sw-1',
      toTerminalId: 't1',
      color: 'red',
      hasCurrent: false,
      currentDirection: 1,
    },
    {
      id: 'w2',
      fromComponentId: 'sw-1',
      fromTerminalId: 't2',
      toComponentId: 'bulb-1',
      toTerminalId: 't1',
      color: 'red',
      hasCurrent: false,
      currentDirection: 1,
    },
    {
      id: 'w3',
      fromComponentId: 'bulb-1',
      fromTerminalId: 't2',
      toComponentId: 'bat-1',
      toTerminalId: 'neg',
      color: 'black',
      hasCurrent: false,
      currentDirection: 1,
    },
  ];

  const res = analyzeCircuit([bat, sw, bulb], wires);
  assert(res.isClosedCircuit, 'Khi công tắc ĐÓNG và đủ dây, mạch phải kín hoàn toàn');
  assert(res.poweredComponentIds.includes('bulb-1'), 'Bóng đèn phải được cấp điện và phát sáng');
  assert(!res.isShortCircuit, 'Mạch có tải (bóng đèn) không bị chập mạch');
  assert(wires.every((w) => w.hasCurrent), 'Tất cả các đoạn dây trong mạch kín phải có dòng điện');
}

// Test 4: Short Circuit Detection (Dangerous directly shorted battery)
{
  const bat = createComponent('battery', 'bat-1', [-1, 0, 0]);
  const dangerousWire: Wire = {
    id: 'w-danger',
    fromComponentId: 'bat-1',
    fromTerminalId: 'pos',
    toComponentId: 'bat-1',
    toTerminalId: 'neg',
    color: 'red',
    hasCurrent: false,
    currentDirection: 1,
  };

  const res = analyzeCircuit([bat], [dangerousWire]);
  assert(res.isShortCircuit, 'Hệ thống phải phát hiện chập mạch khi nối tắt 2 cực của pin');
  assert(!res.isClosedCircuit, 'Mạch chập không được tính là mạch hoạt động bình thường');
  assert(res.statusType === 'error', 'Mức độ cảnh báo phải là error');
}

// Test 5: Missing Negative Return Wire (Open Circuit)
{
  const bat = createComponent('battery', 'bat-1', [-1, 0, 0]);
  const bulb = createComponent('bulb', 'bulb-1', [1, 0, 0]);

  // Only 1 wire from pos to bulb
  const wires: Wire[] = [
    {
      id: 'w1',
      fromComponentId: 'bat-1',
      fromTerminalId: 'pos',
      toComponentId: 'bulb-1',
      toTerminalId: 't1',
      color: 'red',
      hasCurrent: false,
      currentDirection: 1,
    },
  ];

  const res = analyzeCircuit([bat, bulb], wires);
  assert(!res.isClosedCircuit, 'Chỉ có 1 dây thì mạch bị hở, bóng không sáng');
  assert(!res.poweredComponentIds.includes('bulb-1'), 'Bóng đèn tắt');
}

// Test 6: Solar Panel with varying sunlight
{
  const solar = createComponent('solar_panel', 'solar-1', [0, 0, 0], { sunlight: 0.8 });
  const bulb = createComponent('bulb', 'bulb-1', [1, 0, 0]);

  const wires: Wire[] = [
    {
      id: 'w1',
      fromComponentId: 'solar-1',
      fromTerminalId: 'pos',
      toComponentId: 'bulb-1',
      toTerminalId: 't1',
      color: 'red',
      hasCurrent: false,
      currentDirection: 1,
    },
    {
      id: 'w2',
      fromComponentId: 'bulb-1',
      fromTerminalId: 't2',
      toComponentId: 'solar-1',
      toTerminalId: 'neg',
      color: 'black',
      hasCurrent: false,
      currentDirection: 1,
    },
  ];

  // Strong sunlight (80%) -> Powers bulb
  const resSunny = analyzeCircuit([solar, bulb], wires, { sunlight: 0.8, windSpeed: 0 });
  assert(resSunny.isClosedCircuit, 'Khi có ánh nắng mặt trời đủ mạnh, tấm pin phát điện làm sáng đèn');

  // Dark / Cloud (5%) -> Does not power
  const resDark = analyzeCircuit([solar, bulb], wires, { sunlight: 0.05, windSpeed: 0 });
  assert(!resDark.isClosedCircuit, 'Khi trời tối hoặc mây đen, tấm pin không tạo đủ điện');
}

// Test 7: Wind Turbine
{
  const turbine = createComponent('wind_turbine', 'wind-1', [0, 0, 0], { windSpeed: 4 });
  const fan = createComponent('fan', 'fan-1', [1, 0, 0]);

  const wires: Wire[] = [
    {
      id: 'w1',
      fromComponentId: 'wind-1',
      fromTerminalId: 'pos',
      toComponentId: 'fan-1',
      toTerminalId: 't1',
      color: 'blue',
      hasCurrent: false,
      currentDirection: 1,
    },
    {
      id: 'w2',
      fromComponentId: 'fan-1',
      fromTerminalId: 't2',
      toComponentId: 'wind-1',
      toTerminalId: 'neg',
      color: 'black',
      hasCurrent: false,
      currentDirection: 1,
    },
  ];

  // Wind speed 4 -> Fan spins
  const resWindy = analyzeCircuit([turbine, fan], wires, { sunlight: 0, windSpeed: 4 });
  assert(resWindy.isClosedCircuit, 'Khi có gió cấp 4, tuabin quay phát điện làm quạt quay');
  assert(resWindy.poweredComponentIds.includes('fan-1'), 'Quạt điện được cấp năng lượng');

  // Calm wind (0) -> No power
  const resCalm = analyzeCircuit([turbine, fan], wires, { sunlight: 0, windSpeed: 0 });
  assert(!resCalm.isClosedCircuit, 'Khi lặng gió (cấp 0), tuabin không phát điện');
}

// Test 8: Push Button & Buzzer (Doorbell circuit)
{
  const pack = createComponent('battery_pack', 'pack-1', [-1, 0, 0]);
  const btn = createComponent('push_button', 'btn-1', [0, 0, 0], { isPressed: false });
  const buzzer = createComponent('buzzer', 'buzzer-1', [1, 0, 0]);

  const wires: Wire[] = [
    {
      id: 'w1',
      fromComponentId: 'pack-1',
      fromTerminalId: 'pos',
      toComponentId: 'btn-1',
      toTerminalId: 't1',
      color: 'red',
      hasCurrent: false,
      currentDirection: 1,
    },
    {
      id: 'w2',
      fromComponentId: 'btn-1',
      toComponentId: 'buzzer-1',
      fromTerminalId: 't2',
      toTerminalId: 'pos',
      color: 'red',
      hasCurrent: false,
      currentDirection: 1,
    },
    {
      id: 'w3',
      fromComponentId: 'buzzer-1',
      toComponentId: 'pack-1',
      fromTerminalId: 'neg',
      toTerminalId: 'neg',
      color: 'black',
      hasCurrent: false,
      currentDirection: 1,
    },
  ];

  // Button released -> Circuit open
  const resOpen = analyzeCircuit([pack, btn, buzzer], wires);
  assert(!resOpen.isClosedCircuit, 'Khi nút bấm chưa nhấn, mạch chuông phải hở');

  // Button pressed -> Circuit closed, buzzer sounds
  btn.state.isPressed = true;
  const resPressed = analyzeCircuit([pack, btn, buzzer], wires);
  assert(resPressed.isClosedCircuit, 'Khi nhấn nút bấm, mạch chuông phải kín hoàn toàn');
  assert(resPressed.poweredComponentIds.includes('buzzer-1'), 'Còi báo động được cấp điện');
}

// Test 9: Safety Fuse Protection on Short Circuit
{
  const bat = createComponent('battery', 'bat-1', [-1, 0, 0]);
  const fuse = createComponent('fuse', 'fuse-1', [0, 0, 0], { isBlown: false });

  const shortWires: Wire[] = [
    {
      id: 'w1',
      fromComponentId: 'bat-1',
      fromTerminalId: 'pos',
      toComponentId: 'fuse-1',
      toTerminalId: 't1',
      color: 'red',
      hasCurrent: false,
      currentDirection: 1,
    },
    {
      id: 'w2',
      fromComponentId: 'fuse-1',
      fromTerminalId: 't2',
      toComponentId: 'bat-1',
      toTerminalId: 'neg',
      color: 'black',
      hasCurrent: false,
      currentDirection: 1,
    },
  ];

  const resShort = analyzeCircuit([bat, fuse], shortWires);
  assert(!!fuse.state.isBlown, 'Khi xảy ra chập mạch qua cầu chì, cầu chì phải tự đứt để bảo vệ mạch');
}

console.log('\n🎉 TẤT CẢ 9 BỘ TEST MẠCH ĐIỆN ĐÃ VƯỢT QUA 100%!');
