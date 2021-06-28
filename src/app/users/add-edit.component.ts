import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../auth/auth.service';
import { UserDTO } from '../model/user.dto';


@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form!: FormGroup;
    id!: string;
    isAddMode!: boolean;
    isAdmin!: boolean;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private alertService: AlertService,
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;
        this.isAdmin = this.authService.isAdmin();
        
        // password not required in edit mode
        const passwordValidators = [Validators.minLength(6)];
        if (this.isAddMode) {
            passwordValidators.push(Validators.required);
        }

        const formOptions: AbstractControlOptions = { validators: MustMatch('password', 'confirmPassword') };
        if (this.isAddMode) {
            this.form = this.formBuilder.group({
                name: ['', Validators.required],
                login: ['', Validators.required],
                email: ['', [Validators.required, Validators.email]],
                role: ['', Validators.required],
                password: ['', [Validators.minLength(6) ,  Validators.required]],
                confirmPassword: ['', Validators.required]
            }, formOptions);
        } else {
            this.form = this.formBuilder.group({
                name: ['', Validators.required],
                login: ['', Validators.required],
                email: ['', [Validators.required, Validators.email]],
                role: ['', Validators.required],
                password: ['', [Validators.nullValidator, Validators.nullValidator]],
                confirmPassword: ['', Validators.nullValidator]
            });
        }

        if (!this.isAddMode) {
            this.userService.getById(this.id)
                .pipe(first())
                .subscribe(x => {
                    this.form.patchValue(x);
                    if (x.admin == 'SIM') {
                        this.form.controls.role.setValue('Admin');
                    } else {
                        this.form.controls.role.setValue('User');
                    }
                });
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        const password = this.form.controls.password.value;
        if (password != null) {
            const matchingControl = this.form.controls['confirmPassword'];
            if (password !== matchingControl.value) {
                matchingControl.setErrors({ mustMatch: true });
                return;
            } else {
                matchingControl.setErrors(null);
            }
        }

        this.loading = true;
        if (this.isAddMode) {
            this.createUser();
        } else {
            this.updateUser();
        }
    }

    private createUserDTO() : UserDTO {
        return  {
            admin: this.form.controls.role.value == 'Admin' ? 'SIM': 'NAO',
            email: this.form.controls.email.value,
            id: this.id,
            login: this.form.controls.login.value,
            name: this.form.controls.name.value,
            password: this.form.controls.password.value
        };
    }

    private createUser() {
        this.userService.create(this.createUserDTO())
            .pipe(first())
            .subscribe(() => {
                this.alertService.success('Usuário adicionado', { keepAfterRouteChange: true });
                this.router.navigate(['../'], { relativeTo: this.route });
            })
            .add(() => this.loading = false);
    }

    private updateUser() {
        this.userService.update(this.id, this.createUserDTO())
            .pipe(first())
            .subscribe(() => {
                this.alertService.success('Usuário alterado', { keepAfterRouteChange: true });
                this.router.navigate(['../../'], { relativeTo: this.route });
            })
            .add(() => this.loading = false);
    }
}

// custom validator to check that two fields match
export function MustMatch(controlName: string, matchingControlName: string) {
    return (group: AbstractControl) => {
        const formGroup = <FormGroup>group;
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return null;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }

        return null;
    }
}