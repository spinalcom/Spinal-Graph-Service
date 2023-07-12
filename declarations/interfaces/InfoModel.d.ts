import type { Model } from 'spinal-core-connectorjs';
export interface InfoModel extends Model {
    id: string | spinal.Str;
    [key: string]: any;
}
