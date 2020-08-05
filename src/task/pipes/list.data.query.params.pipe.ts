import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from '@nestjs/common';
import {ListDataQueryParams} from '../dto/list.data.query.params';
import {Filter} from '../model/filter.model';
import {Sort} from '../model/sort.model';

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
                result.sort = value.sort instanceof Array
                    ? value.sort.map(this.mapSortParam)
                    : [this.mapSortParam(value.sort)];
            }

            if (value.hasOwnProperty('filter')) {
                result.filter = value.filter instanceof Array
                    ? value.filter.map(this.mapFilterParam)
                    : [this.mapFilterParam(value.filter)];
            }
        }

        return result;
    }

    mapFilterParam(rawValue: string): Filter {
        const value = decodeURIComponent(rawValue);
        const separatorIndex = value.indexOf('=');
        if (separatorIndex === -1) {
            throw new BadRequestException();
        }

        const property = value.substring(0, separatorIndex);
        const propertyValue = value.substring(separatorIndex + 1);

        if (!property.length || !propertyValue.length) {
            throw new BadRequestException();
        }

        return {
            property,
            value: propertyValue
        }
    }

    mapSortParam(rawValue: string): Sort {
        const value = decodeURIComponent(rawValue);
        const terms = value.split('=');

        if (terms.length !== 2 || !terms[0].length || terms[1] !== 'asc' && terms[1] !== 'desc') {
            throw new BadRequestException();
        }

        return {
            property: terms[0],
            direction: terms[1]
        }
    }
}