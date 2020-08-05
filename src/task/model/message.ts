export enum MessageType {
    TASK_CREATED = 'TASK_CREATED',
    TASKS_CREATED = 'TASKS_CREATED'
}

export interface Message<T = any> {
    type: MessageType;
    body: T;
}