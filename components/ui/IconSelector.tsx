// components/ui/IconSelector.tsx

import { useState, useCallback, useMemo, memo, useRef } from "react";
import { icons, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  defaultComputerIcons,
  allIconOptions,
  STYLES,
} from "@/constants/assetTypeConstants";

interface IconSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// 动态图标组件
const DynamicIcon = ({
  name,
  className,
}: {
  name: string;
  className?: string;
}) => {
  const Icon = icons[name as keyof typeof icons] || icons.Archive;
  return <Icon className={className} />;
};

// 图标选择项组件
const IconSelectItem = memo(
  ({
    value,
    children,
    isSelected,
  }: {
    value: string;
    children: React.ReactNode;
    isSelected?: boolean;
  }) => {
    return (
      <SelectItem
        value={value}
        className={`${STYLES.iconButton} [&>span.absolute]:hidden ${
          isSelected
            ? "bg-blue-100 hover:bg-blue-200 ring-2 ring-blue-400 text-blue-900"
            : "hover:bg-white/70 text-gray-600"
        }`}
      >
        {children}
      </SelectItem>
    );
  }
);

IconSelectItem.displayName = "IconSelectItem";

// 图标网格组件
const IconGrid = memo(
  ({
    icons,
    selectedIcon,
    keyPrefix,
  }: {
    icons: typeof allIconOptions;
    selectedIcon: string;
    keyPrefix: string;
  }) => (
    <>
      {icons.map((option) => (
        <IconSelectItem
          key={`${keyPrefix}-${option.value}`}
          value={option.value}
          isSelected={selectedIcon === option.value}
        >
          <DynamicIcon
            name={option.value}
            className={`h-5 w-5 transition-colors duration-200 ${
              selectedIcon === option.value ? "text-blue-700" : "text-gray-600"
            }`}
          />
        </IconSelectItem>
      ))}
    </>
  )
);

IconGrid.displayName = "IconGrid";

function IconSelector({
  value,
  onValueChange,
  placeholder = "选择图标",
  className,
}: IconSelectorProps) {
  const [iconSearch, setIconSearch] = useState("");
  const [showAllIcons, setShowAllIcons] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // 过滤图标选项
  const filteredIcons = useMemo(() => {
    if (iconSearch.trim() !== "") {
      return allIconOptions.filter(
        (icon) =>
          icon.label.toLowerCase().includes(iconSearch.toLowerCase()) ||
          icon.value.toLowerCase().includes(iconSearch.toLowerCase())
      );
    }
    return showAllIcons ? allIconOptions : defaultComputerIcons;
  }, [iconSearch, showAllIcons]);

  // 切换显示所有图标
  const handleToggleAllIcons = useCallback(() => {
    setShowAllIcons((prev) => !prev);
  }, []);

  // 防止搜索框失去焦点
  const preventBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setTimeout(() => {
      if (e.target && document.activeElement !== e.target) {
        e.target.focus();
      }
    }, 0);
  }, []);

  // 处理搜索框键盘事件
  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation();
      if (e.key === "Escape") {
        e.preventDefault();
      }
    },
    []
  );

  // 生成唯一的key前缀
  const keyPrefix = useMemo(
    () => `icon-${Math.random().toString(36).substr(2, 9)}`,
    []
  );

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className || STYLES.select}>
        <SelectValue placeholder={placeholder}>
          <div className="flex items-center">
            <DynamicIcon name={value} className="h-4 w-4" />
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className={STYLES.selectContent}>
        <div
          className="p-3 border-b border-white/20"
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            <Input
              ref={searchRef}
              placeholder="搜索图标..."
              value={iconSearch}
              onChange={(e) => setIconSearch(e.target.value)}
              onMouseDown={(e) => e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={handleSearchKeyDown}
              onBlur={preventBlur}
              autoComplete="off"
              className="pl-9 text-sm rounded-lg border-white/30 bg-white/70"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleAllIcons();
            }}
            onMouseDown={(e) => e.preventDefault()}
            className="w-full mt-2 text-xs text-gray-600 hover:text-gray-900 hover:bg-white/50"
          >
            {showAllIcons ? "显示常用图标" : "显示所有图标"}
          </Button>
        </div>
        <div className="grid grid-cols-6 gap-2 p-3 max-h-48 overflow-y-auto">
          <IconGrid
            icons={filteredIcons}
            selectedIcon={value}
            keyPrefix={keyPrefix}
          />
        </div>
      </SelectContent>
    </Select>
  );
}

export { IconSelector, DynamicIcon };
