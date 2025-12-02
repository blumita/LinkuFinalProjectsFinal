export interface ApiResponseType {
    success: boolean;
    message: string;
    data: {
        id: string | number;
        cardId?: string | number;
        modelType?: string;
        [key: string]: any;
    };
}