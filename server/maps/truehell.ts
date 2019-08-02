import {DIRECTION} from "../../shared/helpers";
import { defaultSymbols, SymbolsDictonary, CustomMapObject } from "../utils/MapTemplateParser";
import { MapKind } from "../utils/ProgressionConfig";
import { Door, DoorDestiny } from "../entities/interactive/Door";
import { Enemy } from "../entities/Enemy";
import { Jail } from "../entities/interactive/Jail";
import { Lever } from "../entities/interactive/Lever";
import { InfernoPortal } from "../entities/interactive/InfernoPortal";
import { TrueHellSpawner } from "../entities/interactive/TrueHellSpawner";
import { DungeonState } from "../rooms/states/DungeonState";
import { Boss } from "../entities/Boss";
import { Unit, StatsModifiers } from "../entities/Unit";
import { TrueHellResult } from "../db/TrueHellResult";

const symbols: SymbolsDictonary = {
    ...defaultSymbols,
    [`🔷`]: ({x, y}, state) => {
        const lever = new Lever({x, y});
        lever.id = `🔷`;
        return lever;
    },
    [`⛔`]: ({x, y}, state) => {
        const jail = new Jail({x, y}, DIRECTION.NORTH, false);
        jail.id = `jail${x}${y}`;
        // TODO: Remove this workaround (not much performatic)
        jail.unlock(state);
        return jail;
    },
    [`👺`]: ({x, y}, state) => {
        const portal = new TrueHellSpawner({x, y});
        portal.id = `spawner${x}${y}`;
        portal.state = state;
        return portal;
    },
    [`🤡`]: ({x, y}, state) => {
        const portal = new TrueHellSpawner({x, y});
        portal.id = `boss-spawner`;
        portal.state = state;
        return portal;
    },
    [`🚪`]: ({x, y}, state) => 
        new Door({x, y}, new DoorDestiny({room: "dungeon", progress: 1}))
};

/*
      WEST
NORTH      SOUTH
      EAST
*/
const template = `
⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱⬜⬜⬜⬜⬜
⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜🧱🧱⬛⬛⬛⬛⬛⬛⬛⬛🧱🧱⬜⬜⬜⬜
⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜🧱🧱⬛⬛⬛⬛⬛👺⬛⬛⬛⬛🧱🧱⬜⬜⬜
⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜🧱⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛🧱⬜⬜⬜
⬜🧱🧱🧱🧱🧱🧱⬜⬜⬜⬜⬜⬜⬜⬜⬜🧱🧱⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛🧱🧱⬜⬜
⬜🧱⬛⬛⬛⬛🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛🧱🧱⬜
⬜🧱⬛⬛⬛⬛⛔⬛⬛⬛⬛⬛⬛⬛⬛⬛⛔⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛🧱⬜
⬜🧱🚪⬛⬛⬛⛔⬛⬛⬛⬛⬛⬛⬛⬛⬛⛔⬛⬛⬛⬛🔷⬛⬛⬛⬛⬛⬛⬛🤡⬛⬛🧱⬜
⬜🧱⬛⬛⬛⬛⛔⬛⬛⬛⬛⬛⬛⬛⬛⬛⛔⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛🧱⬜
⬜🧱⬛⬛⬛⬛🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛🧱🧱⬜
⬜🧱🧱🧱🧱🧱🧱⬜⬜⬜⬜⬜⬜⬜⬜⬜🧱🧱⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛🧱🧱⬜⬜
⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜🧱⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛🧱⬜⬜⬜
⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜🧱🧱⬛⬛⬛⬛⬛👺⬛⬛⬛⬛🧱🧱⬜⬜⬜
⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜🧱🧱⬛⬛⬛⬛⬛⬛⬛⬛🧱🧱⬜⬜⬜⬜
⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱⬜⬜⬜⬜⬜


`;

const bossTypes = ['scorpion-boss', 'necromancer', 'monkey-king'];
const enemyTypes = ['skeleton-4', 'lava-ogre', 'skeleton-2', 'lava-totem', 'beholder', 'golem', 'demon', 'winged-demon']

const mapObject: CustomMapObject = {
    symbols,
    template,
    startPosition: {
        x: 3,
        y: 7
    },
    config: {
        mapkind: MapKind.INFERNO,
        daylight: false
    },
    afterPopulate: (state) => {
        //console.log(state.entities)
        console.log('>>>>', Object.keys(state.entities));

        const lever: Lever = state.entities[`🔷`];
        const jails: Jail[] = Object.keys(state.entities).filter(key => key.startsWith(`jail`)).map(key => state.entities[key]);
        const enemySpawners: TrueHellSpawner[] = Object.keys(state.entities).filter(key => key.startsWith(`spawner`)).map(key => state.entities[key]);
        const bossSpawner: TrueHellSpawner = state.entities[`boss-spawner`];
        const allSpawners: TrueHellSpawner[] = [bossSpawner, ...enemySpawners];

        let currentLevel = 0;
        lever.interact = (moveEvent, player, state: DungeonState) => {
            if (lever.active) return;
            
            lever.active = true;
            jails.forEach(jail => jail.lock(state));

            // START WAVE
            let spawnInterval = 1500;
            let enemiesByPortal = 5;
            const enemyType = enemyTypes[currentLevel % enemyTypes.length];
            const progressDifficulty = Math.ceil(120 / 4) + (currentLevel * 4)
            const allEnemies: Unit[] = [];
            
            const modifier: Partial<StatsModifiers> = {
                aiDistance: 99,
                hp: 3000 + (currentLevel * Math.ceil(currentLevel*.25) * 100),
                armor: 200,
                attackSpeed: 5 + (currentLevel)
            };

            const activateSpawner = (spawner: TrueHellSpawner) => {
                spawner.units = [];
                spawner.spawnInterval = spawnInterval;
                for (let i = 0; i < enemiesByPortal; i += 1) {
                    const enemy = state.roomUtils.createEnemy(enemyType, Enemy, progressDifficulty, modifier);
                    enemy.dropOptions = null;
                    allEnemies.push(enemy);
                    spawner.units.push(enemy);
                }
            };

            let modifierText = ``;
            // Define modifiers for the wave
            if (currentLevel > 0) {
                if (currentLevel % 3 === 0) {
                    // FASTER UNITS
                    spawnInterval = 1000
                    modifier.movementSpeed = 15;
                    modifier.attackSpeed = modifier.attackSpeed * 2;
                    modifierText += ` Quick `;
                }
                if (currentLevel % 5 === 0) {
                    // CRIT DAMAGE
                    modifier.criticalStrikeChance = 25;
                    modifierText += ` Precise `;
                }
                if (currentLevel % 7 === 0) {
                    // SWARM (units spawn faster, more numeorous, but less health)
                    spawnInterval = 50;
                    modifierText += ` Swarming`;
                    enemiesByPortal = enemiesByPortal * 3;
                    modifier.movementSpeed = 20;
                    modifier.attackSpeed = 30;
                    modifier.hp = Math.ceil(modifier.hp / 10);
                }
                if (currentLevel % 8 === 0) {
                    // HEAVY UNITS
                    modifierText += ` Vigorous `;
                    modifier.movementSpeed = -5;
                    modifier.attackSpeed = -30;
                    enemiesByPortal = Math.ceil(enemiesByPortal / 3);
                    spawnInterval = spawnInterval * 3;
                    modifier.hp = modifier.hp * 5;
                }
                if (currentLevel % 9 === 0) {
                    // EVASION
                    modifier.evasion = 35;
                    modifierText += ` Elusive `;
                }
                if (currentLevel % 10 === 0) {
                    // BOSS LVL
                    const bossType = bossTypes[(currentLevel / 10) % bossTypes.length];
                    const boss = state.roomUtils.createEnemy(bossType, Boss, progressDifficulty, modifier);
                    bossSpawner.spawnInterval = spawnInterval;
                    bossSpawner.units = [boss];
                    allEnemies.push(boss);
                } else {
                    activateSpawner(bossSpawner);
                }
            }

            enemySpawners.forEach(activateSpawner);

            let deathCount = 0;
            const onDie = () => {
                deathCount += 1;
                if (deathCount >= allEnemies.length) {
                    lever.active = false;
                    state.createTextEvent("Wave cleared!!!", lever.position, "blue", 2000);
                }

            }

            allEnemies.forEach(enemy => enemy.onDie = () => {
                setTimeout(() => {
                    state.removeEntity(enemy);
                }, 5000);
                onDie();
                return [];
            })

            state.createTextEvent(`Wave ${currentLevel + 1} | ${enemyType}`, lever.position, "yellow", 1000);
            setTimeout(() => {
                state.createTextEvent(modifierText, lever.position, "red", 1000);
            }, 2000);

            setTimeout(() => {
                allSpawners.forEach(s => s.activated = true);
            }, 3000);
            
            for (let playerId in state.players) {
                const player = state.players[playerId];
                player.onDie = () => {
                    //player.hero.id;
                    TrueHellResult.create({
                        level: currentLevel,
                        heroes: [player.hero.id],
                        releaseVersion: "alpha"
                    });
                    
                    return [];
                }
            }

            currentLevel += 1;
        };
    }
}

export default mapObject;