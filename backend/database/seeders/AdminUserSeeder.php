<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $existing_admins = User::with('roles')->get()->filter(
            fn ($user) => $user->roles->where('name', 'Super Admin')->toArray()
        )->count();

        if ($existing_admins <= 0 ) {
            $new_admin = new User([
                'first_name' => 'Admin',
                'email' => 'admin@99technologies.com',
                'password' => bcrypt('99admin'),
            ]);

            // Assign admin role to this user;
            if ($new_admin->save()) {
                $role = Role::findByName('admin', 'api');
                $new_admin->assignRole($role);
            }
        }
    }
}
