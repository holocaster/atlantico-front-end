import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserDTO } from '../model/user.dto';


const baseUrl = `${environment.serverUrl}/api/v1/users`;

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<UserDTO[]>(baseUrl);
    }

    getById(id: string) {
        return this.http.get<UserDTO>(`${baseUrl}/${id}`);
    }

    create(userDTO: UserDTO) {
        return this.http.post(baseUrl, userDTO);
    }

    update(id: string, userDTO: UserDTO) {
        return this.http.put(`${baseUrl}/${id}`, userDTO);
    }

    delete(id: string) {
        return this.http.delete(`${baseUrl}/${id}`);
    }
}