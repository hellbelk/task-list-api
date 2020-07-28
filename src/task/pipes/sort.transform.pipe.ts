import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from '@nestjs/common';
import {SortDto} from '../dto/sort.dto';

@Injectable()
export class SortTransformPipe implements PipeTransform<string | string[], SortDto | SortDto[] | undefined> {
    transform(value: string | string[], metadata: ArgumentMetadata): SortDto | SortDto[] | undefined {
        if (value) {
            return value instanceof Array
                ? value.map(this.mapSortParam)
                : this.mapSortParam(value);
        }
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