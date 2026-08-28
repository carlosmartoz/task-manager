import { IconDeviceDesktop, IconMoon, IconSun } from '@tabler/icons-react'

import { Button } from '@/components/ui/button'
import type { Theme } from '@/hooks/useTheme'

const OPTIONS: Record<Theme, { Icon: typeof IconSun; label: string }> = {
  light: { Icon: IconSun, label: 'Tema claro' },
  dark: { Icon: IconMoon, label: 'Tema oscuro' },
  system: { Icon: IconDeviceDesktop, label: 'Tema del sistema' },
}

type ThemeToggleProps = {
  theme: Theme
  onCycle: () => void
}

export function ThemeToggle({ theme, onCycle }: ThemeToggleProps) {
  const { Icon, label } = OPTIONS[theme]

  return (
    <Button variant="ghost" size="icon-sm" onClick={onCycle} aria-label={label}>
      <Icon />
    </Button>
  )
}
