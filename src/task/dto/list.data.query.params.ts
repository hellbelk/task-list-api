import {Sort} from '../model/sort.model';
import {Filter} from '../model/filter.model';

export interface ListDataQueryParams {
    offset?: number;
    limit?: number;
    sort?: Sort[];
    filter?: Filter[];
}