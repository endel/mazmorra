import TrueHell from './truehell';

const customMapsList = {
    "truehell": TrueHell,
    "dotinha": TrueHell,
};

export default customMapsList;

export type CustomMapName = keyof typeof customMapsList;