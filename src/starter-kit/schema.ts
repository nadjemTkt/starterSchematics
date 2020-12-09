export interface Schema {
    project?: string;
    name: string;
    module: string;
    path: string;
    withService: boolean;
    withModule: boolean;
    dataName?:string
    properties?:string
    props?:any
}