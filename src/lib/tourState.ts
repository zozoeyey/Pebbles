// While the coach-mark tour drives through real screens, side effects
// (analytics events, time-together tracking) must not fire.
let touring = false;

export const setTouring = (v: boolean) => { touring = v; };
export const isTouring = () => touring;
