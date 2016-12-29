import Alea from 'alea';

export const r = new Alea();
export const coin = () => (r() * 100 < 50);

export default {
    playerActive: {},
};
