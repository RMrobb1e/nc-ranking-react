import {
  BowArrow,
  Shield,
  Swords,
  WandSparkles,
  Wand,
  Axe,
  Utensils,
  Slice,
  Sword,
} from "lucide-react";

export const weaponTypeMap: { [key: number]: string } = {
  0: "All",
  21: "Bow",
  13: "OneHanded",
  12: "TwinSword",
  31: "Staff",
  32: "Wand",
  11: "TwoHanded",
  14: "Spear",
  22: "Dagger",
  23: "Rapier",
};

export const weaponIcons: Record<string, React.ComponentType<any>> = {
  21: BowArrow,
  13: Shield,
  12: Swords,
  31: WandSparkles,
  32: Wand,
  11: Axe,
  14: Utensils,
  22: Slice,
  23: Sword,
};
