import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        data?: PartyData[] | undefined;
        r: number;
        rows: number;
        dotsize: number;
        padding: number | [number, number] | [number, number, number, number];
        total_seats: number;
        color?: string | undefined;
        font_size?: string | number | undefined;
        arc?: number | undefined;
        text_position?: {
            x: number;
            y: number;
        } | null | undefined;
        display?: string[] | undefined;
        current_party?: PartyData | null;
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
