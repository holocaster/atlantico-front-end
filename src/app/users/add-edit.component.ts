import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { AlertService } from '../services/alert.service';
import { MustMatch } from '../_helpers';
import { AuthService } from '../auth/auth.service';


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
                email: ['', [Validators.required, Validators.email]],
                role: ['', Validators.required],
                password: ['', [Validators.minLength(6) ,  Validators.required]],
                confirmPassword: ['', Validators.required]
            }, formOptions);
        } else {
            this.form = this.formBuilder.group({
                name: ['', Validators.required],
                email: ['', [Validators.required, Validators.email]],
                role: ['', Validators.required],
                password: ['', [this.isAdmin ? Validators.minLength(6) : Validators.nullValidator, this.isAdmin ? Validators.required : Validators.nullValidator]],
                confirmPassword: ['', this.isAdmin ? Validators.required : Validators.nullValidator]
            }, this.isAdmin ? formOptions : null);
        }

        if (!this.isAddMode) {
            this.userService.getById(this.id)
                .pipe(first())
                .subscribe(x => {
                    console.log(x);
                    this.form.patchValue(x)
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
        console.log(this.form.invalid);
        if (this.form.invalid) {
            console.log(this.form.controls);
            return;
        }

        this.loading = true;
        if (this.isAddMode) {
            this.createUser();
        } else {
            this.updateUser();
        }
    }

    private createUser() {
        this.userService.create(this.form.value)
            .pipe(first())
            .subscribe(() => {
                this.alertService.success('User added', { keepAfterRouteChange: true });
                this.router.navigate(['../'], { relativeTo: this.route });
            })
            .add(() => this.loading = false);
    }

    private updateUser() {
        this.userService.update(this.id, this.form.value)
            .pipe(first())
            .subscribe(() => {
                this.alertService.success('User updated', { keepAfterRouteChange: true });
                this.router.navigate(['../../'], { relativeTo: this.route });
            })
            .add(() => this.loading = false);
    }
}