// User

export interface UserData {
    username: string,
    password: string,
    email: string,
    _id: string
}

export type UserPassword = Pick<UserData, 'password'>
export type UserEmail = Pick<UserData, 'email'>
export type UserName = Pick<UserData, 'username'>
export type UserId = Pick<UserData, '_id'>

export type RegisterData = Omit<UserData, '_id'>
export type LoginData = Omit<UserData, '_id' | 'username'>

// Endpoints

export interface EndpointsAll {
    data: EndpointsData
}

export type EndpointsData = Array<Endpoint>;

export interface Endpoint {
    _id?: string,
    body: EndpointBody,
    headers: EndpointHeader,
    name: string,
    path: string,
    method: string,
    statusCode: number,
    queryParams: EndpointQueryParams,
    description: string,
    isActive: boolean,
    responseDelay: number,
    responseBody: EndpointBody,
    responseHeaders: EndpointHeader
}

export type EndpointBody = { [key: string]: string };
export type EndpointHeader = { [key: string]: string };
export type EndpointQueryParams = { [key: string]: string | number | boolean | Array };

export interface BodyItem {
    name: string;
    type: string;
    id: string;
}