<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Domain\Brand\Entities\Brand;
use Illuminate\Support\Str;

class BrandSeeder extends Seeder
{
    public function run(): void
    {
        $brands = [
            'A.O. Smith', 'Acer', 'Alienware', 'Amazfit', 'Anker', 'Apple', 'Aqua', 'Asanzo', 'Asia', 'Asus',
            'Audio-Technica', 'B&O (Bang & Olufsen)', 'Beats', 'Beko', 'Blueair', 'Bluestone', 'Bosch', 'Bose',
            'Canon', 'Canzy', 'Carrier', 'Casper', 'Changhong', 'Coocaa', 'Coway', 'Cuckoo', 'Daikin', 'Darling',
            'Dell', 'DJI', 'Dyson', 'Ecovacs', 'Electrolux', 'Fitbit', 'Fujifilm', 'Funiki', 'Garmin', 'Gigabyte',
            'Google Pixel', 'GoPro', 'Gree', 'Haier', 'Harman Kardon', 'Hatari', 'Hitachi', 'Hisense', 'Honeywell',
            'HP (Hewlett-Packard)', 'Huawei', 'Hydrogen', 'iRobot', 'JBL', 'Kangaroo', 'Karofi', 'KDK', 'Konka',
            'Korihome', 'Lenovo', 'LG', 'Lock&Lock', 'Marshall', 'Midea', 'Microsoft', 'Mitsubishi Electric',
            'Mitsubishi Heavy Industries', 'Mitsubishi Cleansui', 'Motorola', 'MSI', 'Nagakawa', 'Nikon', 'Nokia',
            'OnePlus', 'Oppo', 'Panasonic', 'Philips', 'Razer', 'Realme', 'Reetech', 'Roborock', 'Saijo Denki',
            'Samsung', 'Sanaky', 'Sennheiser', 'Senko', 'Sharp', 'Skyworth', 'Sony', 'Sunhouse', 'Supor', 'TCL',
            'Tefal', 'Teka', 'Tiger', 'Toshiba', 'Vivo', 'Vsmart', 'Xiaomi', 'Zojirushi'
        ];

        foreach ($brands as $index => $base) {
            Brand::firstOrCreate(
                ['slug' => Str::slug($base)],
                [
                    'name' => $base,
                    'logo' => 'images/no-image.png',
                    'has_promotion' => false,
                    'order' => $index + 1,
                    'status' => 'active',
                ]
            );
        }
    }
}

