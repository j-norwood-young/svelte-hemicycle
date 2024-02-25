import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        data: any;
        r: number;
        rows: number;
        dotsize: number;
        padding: number;
        total_seats: number;
        color?: string | undefined;
        font_size?: number | undefined;
        voronoi_stroke?: string | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type HemicycleProps = typeof __propDef.props;
export type HemicycleEvents = typeof __propDef.events;
export type HemicycleSlots = typeof __propDef.slots;
export default class Hemicycle extends SvelteComponent<HemicycleProps, HemicycleEvents, HemicycleSlots> {
}
export {};
