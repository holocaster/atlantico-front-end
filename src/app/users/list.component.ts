import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { UserDTO } from '../model/user.dto';
import { UserService } from '../services/user.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { AuthService } from '../auth/auth.service';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {

    displayedColumns: string[] = ['name', 'email', 'perfil', 'action'];
    users = new MatTableDataSource<UserDTO>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private userService: UserService,
        private authService: AuthService) {
    }

  ngAfterViewInit() {
    this.users.paginator = this.paginator;
    
  }

    ngOnInit() {
        this.searchUsers();
    }

    private searchUsers() {
        this.userService.getAll()
            .pipe(first())
            .subscribe( (users: any) =>  {
                const lista : UserDTO[] = [];
                users.content.forEach((user:any) => {
                    lista.push(user);
                })
                this.paginator.length = users.totalElement;
                this.users.data = (lista)
            });
    }

    deleteUser(id: string) {
        const user = this.users.data.find(x => x.id === id);
        if (!user) return;
        user.isDeleting = true;
        this.userService.delete(id)
            .pipe(first())
            .subscribe(() =>  {
                this.users.data = this.users.data.filter(x => x.id !== id);
                this.searchUsers();
            });

        
    }

    logout() {
        this.authService.logout();
    }
}