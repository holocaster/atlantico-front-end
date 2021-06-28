
export class UserDTO {
    id!: string;
    name!: string;
    login!: string;
    password!: string;
    email!: string;
    createdDate!: string;
    updateDate!: string;
    admin!: string;
    isDeleting: boolean = false;
}