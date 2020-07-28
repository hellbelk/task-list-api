import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from '@nestjs/common';
import {SortDto} from '../dto/sort.dto';
import {ListDataQueryParams} from '../dto/list.data.query.params';

@Injectable()
export class ListDataQueryParamsPipe implements PipeTransform<any, ListDataQueryParams> {
    transform(value: any, metadata: ArgumentMetadata): ListDataQueryParams {
        const result: ListDataQueryParams = {};
        if (value && metadata.type === 'query') {
            if (value.hasOwnProperty('offset') && value.hasOwnProperty('limit')) {
                result.offset = +value.offset;
                result.limit = +value.limit;
            }

            if (value.hasOwnProperty('sort')) {
                const rawSort = value.sort;
                result.sort = value.sort instanceof Array
                    ? value.sort.map(this.mapSortParam)
                    : this.mapSortParam(value.sort);
            }
        }

        return result;
    }

    mapSortParam(value: string): SortDto {
        const terms = value.split(',');

        if (terms.length !== 2 || terms[1] !== 'asc' && terms[1] !== 'desc') {
            throw new BadRequestException();
        }

        return {
            property: terms[0],
            direction: terms[1]
        }
    }
}