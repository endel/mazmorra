import * as Config from "./utils/ProgressionConfig";

const labels = {
  "Total number of levels in the game": Config.MAX_LEVELS,
  "Number of levels between different maps": Config.NUM_LEVELS_PER_MAP,
  "Number levels between checkpoints": Config.NUM_LEVELS_PER_CHECKPOINT,
  "Max. Body Armor": Config.MAX_ARMOR_ARMOR,
  "Max. Shield Armor": Config.MAX_SHIELD_ARMOR,
  "Max. Boots Armor": Config.MAX_BOOTS_ARMOR,
  "Max. Helmet Armor": Config.MAX_HELMET_ARMOR,
  "Max. Boots Movement Speed": Config.MAX_BOOTS_MOVEMENT_SPEED,
  "Max. Melee Weapon Damage": Config.MAX_WEAPON_DAMAGE,
  "Max. Bow Damage": Config.MAX_BOW_DAMAGE,
  "Max. Staff Damage": Config.MAX_STAFF_DAMAGE,
  "Max. Bow Attack Distance": Config.MAX_BOW_ATTACK_DISTANCE,
  "Max. Bow Staff Distance": Config.MAX_STAFF_ATTACK_DISTANCE,
}

const markdown = Object.keys(labels).map((label => {
  return `- ${label}: ${labels[label]}`;
})).join("\n");

console.log(markdown);
