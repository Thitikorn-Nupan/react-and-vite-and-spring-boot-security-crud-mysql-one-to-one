/*    {
        "cid": 1,
        "email": "json@gmail.com",
        "password": "12345",
        "image": "profiles/1001.jpeg",
        "timeCreateId": "2024-11-15T04:59:22.000+00:00",
        "detail": {
            "did": 1,
            "birthday": "2008-11-10T17:00:00.000+00:00",
            "maritalStatus": false,
            "salary": 26000.0,
            "phone": "0645322123"
        }
    }*/
export class Detail {
    public declare did: number;
    public declare birthday:Date;
    public declare maritalStatus:boolean;
    public declare salary:number;
    public declare phone:string;
}