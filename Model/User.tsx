export class User {
    partitionKey: string;
    rowKey: string;
    familyName: string;
    idNumber: string;
    age: number;
    phoneNumber: string;
    userType: string;

    constructor(familyName: string, idNumber: string, age: number, phoneNumber: string, userType: string) {
        this.partitionKey = "userPartition";
        this.rowKey = idNumber;
        this.familyName = familyName;
        this.idNumber = idNumber;
        this.age = age;
        this.phoneNumber = phoneNumber;
        this.userType = userType;
    }
}
