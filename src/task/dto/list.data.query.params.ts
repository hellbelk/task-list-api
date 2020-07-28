import {SortDto} from '../dto/sort.dto';

export interface ListDataQueryParams {
    offset?: number;
    limit?: number;
    sort?: SortDto[];
}