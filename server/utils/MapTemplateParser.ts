import { Entity } from "../entities/Entity";
import { Position } from "../core/Position";

export const EmptySpace = Symbol("EmptySpace");
export const WalkableSpace = Symbol("WalkableSpace");

export type SymbolsDictonary = {[s: string]: Symbol | Entity | Entity[]}

export const parseMapTemplate = (template: string, symbols: SymbolsDictonary, keys: string[]) => {
    const newLine = /\n/g;
    const keyLookup = new RegExp(`[${keys.join('')}]`, 'gu');

    template = template.trim();

    try {

        template
            .trim()
            .split(newLine)
            .map((row, y) => {
                const matchingCells = row.match(keyLookup);
                if (matchingCells.join('') !== row) {
                    throw new Error(`Row ${y} contains a character that is not an expected symbol`)
                }
                return matchingCells;
            })

        const parsed = template
            .trim()
            .split(newLine)
            .map((row, y) => {
                const matchingCells = row.match(keyLookup);
                if (matchingCells.join('') !== row) {
                    throw new Error(`Row ${y} contains a character that is not an expected symbol`)
                }
                return [...matchingCells];
            })
            .map((row, y) => {
                const symbolToValue = (cellSymbol: string, x: number) => {
                    console.log('>>>', cellSymbol, symbols[cellSymbol]);

                    const position = new Position();
                    position.x = x;
                    position.y = y;

                    const appendPosition = (entity: Entity) => {
                        entity.position = position;
                        return entity;                        
                    };

                    const value = symbols[cellSymbol];
                    if (value === EmptySpace) return 0;
                    if (value === WalkableSpace) return 1;
                    if (value instanceof Entity) return appendPosition(value);
                    if (value instanceof Array) return value.map(v => appendPosition(v));
                }
                return row.map(symbolToValue)
            });

            return parsed

    } catch (err) {
        console.error(`Unable to parse template`, err);
        console.error(`Dumping: `);
        console.error({keys, symbols, keyLookup, template});
        throw err;
    }

    return null;
}