import type { Model } from 'spinal-core-connectorjs';
import type { InfoModel } from './InfoModel';
export interface SpinalNodeObject {
    info: InfoModel;
    element?: Model;
    [key: string]: any;
}
