export interface ListDataResponse<T> {
    data: T[],
    offset: number;
    limit: number;
    total: number;
}