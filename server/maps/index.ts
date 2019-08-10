import TrueHell from './truehell';

const customMapsList = {
    "truehell": TrueHell,
    "dotinha": TrueHell,
};

export default customMapsList;
export const customMapsKeys = Object.keys(customMapsList) as CustomMapName[];
export type CustomMapName = keyof typeof customMapsList;