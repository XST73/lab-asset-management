// constants/assetTypeConstants.ts

// 默认显示的计算机相关图标
export const defaultComputerIcons = [
  { value: "RectangleGoggles", label: "VR头显" },
  { value: "Glasses", label: "AR眼镜" },
  { value: "PcCase", label: "主机" },
  { value: "Monitor", label: "显示器" },
  { value: "Laptop", label: "笔记本电脑" },
  { value: "Smartphone", label: "智能手机" },
  { value: "Tablet", label: "平板电脑" },
  { value: "Server", label: "服务器" },
  { value: "HardDrive", label: "硬盘" },
  { value: "Headphones", label: "耳机" },
  { value: "Camera", label: "相机" },
  { value: "Archive", label: "默认" },
];

// 所有可搜索的图标选项
export const allIconOptions = [
  // 电子设备
  { value: "Monitor", label: "显示器" },
  { value: "Laptop", label: "笔记本电脑" },
  { value: "Smartphone", label: "智能手机" },
  { value: "Tablet", label: "平板电脑" },
  { value: "Tv", label: "电视" },
  { value: "Speaker", label: "音响" },
  { value: "Headphones", label: "耳机" },
  { value: "Glasses", label: "AR眼镜" },
  { value: "Watch", label: "智能手表" },
  { value: "Server", label: "服务器" },
  { value: "HardDrive", label: "硬盘" },
  { value: "Database", label: "数据库" },
  { value: "Usb", label: "USB设备" },
  { value: "Disc", label: "光盘" },
  { value: "PcCase", label: "主机" },
  // 实验设备
  { value: "Camera", label: "相机" },
  { value: "Microscope", label: "显微镜" },
  { value: "TestTube", label: "试管" },
  { value: "Beaker", label: "烧杯" },
  { value: "Scale", label: "天平" },
  { value: "Thermometer", label: "温度计" },
  { value: "Zap", label: "电子设备" },
  { value: "Activity", label: "监测设备" },
  // 游戏娱乐
  { value: "Gamepad2", label: "游戏手柄" },
  { value: "Joystick", label: "摇杆" },
  { value: "RectangleGoggles", label: "VR头显" },
  // 工具设备
  { value: "Wrench", label: "工具" },
  { value: "Hammer", label: "锤子" },
  { value: "Drill", label: "钻头" },
  { value: "Cog", label: "齿轮" },
  { value: "Settings", label: "设置" },
  // 办公设备
  { value: "Printer", label: "打印机" },
  { value: "Clipboard", label: "剪贴板" },
  { value: "FileText", label: "文档" },
  { value: "Folder", label: "文件夹" },
  // 其他
  { value: "Archive", label: "默认" },
];

// 颜色选项 - 按色相环顺序排列
export const colorOptions = [
  // 红色系
  { value: "from-red-500 to-rose-600", label: "红色" },
  { value: "from-orange-500 to-red-600", label: "橙红色" },
  { value: "from-pink-500 to-rose-600", label: "粉色" },
  
  // 橙黄色系
  { value: "from-yellow-500 to-orange-600", label: "黄色" },
  { value: "from-amber-500 to-yellow-600", label: "琥珀色" },
  
  // 绿色系
  { value: "from-lime-500 to-green-600", label: "绿色" },
  { value: "from-teal-500 to-cyan-600", label: "青色" },
  
  // 蓝色系
  { value: "from-blue-500 to-cyan-600", label: "蓝色" },
  { value: "from-indigo-500 to-blue-600", label: "靛蓝" },
  
  // 紫色系
  { value: "from-purple-500 to-indigo-600", label: "紫色" },
  
  // 中性色系
  { value: "from-gray-500 to-slate-600", label: "灰色" },
];

// 样式常量
export const STYLES = {
  dialog: "max-w-5xl max-h-[85vh] overflow-hidden backdrop-blur-xl bg-white/70 border border-white/20 shadow-2xl rounded-2xl",
  card: "backdrop-blur-xl bg-white/60 border border-white/20 shadow-xl rounded-2xl p-6",
  input: "backdrop-blur-sm bg-white/70 border-white/30 focus:border-blue-400 rounded-xl transition-all duration-300",
  select: "backdrop-blur-sm bg-white/70 border-white/30 focus:border-blue-400 rounded-xl transition-all duration-300 w-full",
  selectContent: "max-h-72 rounded-xl border-white/30 bg-white/95 backdrop-blur-xl",
  primaryButton: "bg-gradient-to-r from-[#003399] to-[#3366cc] hover:from-[#003399]/90 hover:to-[#3366cc]/90 text-white transition-all duration-300 rounded-xl px-8 py-3 font-semibold",
  outlineButton: "border-white/30 bg-white/50 hover:bg-white/70 transition-all duration-300",
  assetTypeItem: "backdrop-blur-sm bg-white/50 border border-white/30 rounded-xl p-4 hover:bg-white/70 hover:shadow-lg transition-all duration-300 group",
  iconButton: "p-3 flex justify-center cursor-pointer rounded-lg transition-all duration-200",
} as const;

// 默认资产类型数据
export const DEFAULT_ASSET_TYPE = {
  name: "",
  icon: "Archive",
  color: "from-gray-500 to-slate-600",
};
