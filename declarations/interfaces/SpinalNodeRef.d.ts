import type { Model } from 'spinal-core-connectorjs';
import type { SpinalNodePointer, SpinalSet } from 'spinal-model-graph';
export interface SpinalNodeRef extends Model {
    childrenIds: string[];
    contextIds: SpinalSet;
    element: SpinalNodePointer<Model>;
    hasChildren: boolean;
    [key: string]: any;
}
