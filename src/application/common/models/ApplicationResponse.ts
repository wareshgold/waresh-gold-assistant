export interface ApplicationResponse {

    type:
        "text"
        |
        "data";


    content:
        string;


    data?:
        unknown;


    metadata?:
        Record<string, unknown>;

}