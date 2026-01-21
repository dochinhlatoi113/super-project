<?php
/**
 * Class MakeDomainDDD
 *
 * Console command for CLI operations
 * Provides command-line interface functionality
 */
namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class MakeDomainDDD extends Command
{
    protected $signature = 'make:domain {name}';
    protected $description = 'Create a full DDD structure for a domain (Entity, Repo, Service, Controller, Request, Observer, Provider, Route)';

    public function handle()
    {
        $domain = Str::studly($this->argument('name'));
        $snake = Str::snake($domain);
        $pluralSnake = Str::plural($snake);
        $basePath = app_path("Domain/{$domain}");

        $this->info("Creating DDD structure for domain: {$domain}");

        // --- FOLDER STRUCTURE ---
        $folders = [
            "Entities",
            "Repositories",
            "Services",
            "Http/Controllers",
            "Http/Requests",
            "Providers",
            "Observers",
        ];

        foreach ($folders as $folder) {
            File::ensureDirectoryExists("{$basePath}/{$folder}");
        }

        // --- FILES ---
        $files = [
            "Entities/{$domain}.php" => "<?php
namespace App\\Domain\\{$domain}\\Entities;
use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\SoftDeletes;

class {$domain} extends Model
{
    use SoftDeletes;
    protected \$table = '{$pluralSnake}';
    protected \$fillable = ['name','slug','logo','has_promotion','order','status','parent_id'];
    protected \$casts = ['has_promotion' => 'boolean'];
}
",
            "Observers/{$domain}Observer.php" => "<?php
namespace App\\Domain\\{$domain}\\Observers;
use App\\Domain\\{$domain}\\Entities\\{$domain};

class {$domain}Observer
{
    public function dosomething(\$model) {}
}
",
            "Repositories/{$domain}RepositoryInterface.php" => "<?php
namespace App\\Domain\\{$domain}\\Repositories;
use App\\Domain\\{$domain}\\Entities\\{$domain};

interface {$domain}RepositoryInterface
{
    public function paginate(\$perPage = 15);
    public function find(\$id);
    public function create(\$data);
    public function update(\$id, \$data);
    public function delete(\$id);
}
",
            "Repositories/{$domain}Repository.php" => "<?php
namespace App\\Domain\\{$domain}\\Repositories;
use App\\Domain\\{$domain}\\Entities\\{$domain};

class {$domain}Repository implements {$domain}RepositoryInterface
{
    public function paginate(\$perPage = 15) { return {$domain}::orderBy('id')->paginate(\$perPage); }
    public function find(\$id) { return {$domain}::find(\$id); }
    public function create(\$data) { return {$domain}::create(\$data); }
    public function update(\$id, \$data) { \$item = {$domain}::findOrFail(\$id); \$item->update(\$data); return \$item; }
    public function delete(\$id) { return (bool) {$domain}::findOrFail(\$id)->delete(); }
}
",
            "Services/{$domain}Service.php" => "<?php
namespace App\\Domain\\{$domain}\\Services;
use App\\Domain\\{$domain}\\Repositories\\{$domain}RepositoryInterface;

class {$domain}Service
{
    protected \$repo;

    public function __construct({$domain}RepositoryInterface \$repo)
    {
        \$this->repo = \$repo;
    }

    public function list(\$perPage = 15)
    {
        return \$this->repo->paginate(\$perPage);
    }

    public function create(\$data)
    {
        \$data['logo'] = \$data['logo'] ?? 'images/no-image.png';
        return \$this->repo->create(\$data);
    }

    public function update(\$id, \$data)
    {
        \$data['logo'] = \$data['logo'] ?? 'images/no-image.png';
        return \$this->repo->update(\$id, \$data);
    }

    public function delete(\$id)
    {
        return \$this->repo->delete(\$id);
    }
}
",
            "Http/Controllers/{$domain}Controller.php" => "<?php
namespace App\\Domain\\{$domain}\\Http\\Controllers;
use App\\Http\\Controllers\\Controller;
use App\\Domain\\{$domain}\\Services\\{$domain}Service;
use App\\Domain\\{$domain}\\Http\\Requests\\Store{$domain}Request;
use App\\Domain\\{$domain}\\Http\\Requests\\Update{$domain}Request;

class {$domain}Controller extends Controller
{
    protected \$service;

    public function __construct({$domain}Service \$service)
    {
        \$this->service = \$service;
    }

    public function index()
    {
        return response()->json(\$this->service->list());
    }

    public function store(Store{$domain}Request \$request)
    {
        return response()->json(\$this->service->create(\$request->validated()), 201);
    }

    public function update(Update{$domain}Request \$request, \$id)
    {
        return response()->json(\$this->service->update(\$id, \$request->validated()));
    }

    public function destroy(\$id)
    {
        \$this->service->delete(\$id);
        return response()->json(['message' => 'Deleted successfully']);
    }
}
",
            "Http/Requests/Store{$domain}Request.php" => "<?php
namespace App\\Domain\\{$domain}\\Http\\Requests;
use Illuminate\\Foundation\\Http\\FormRequest;

class Store{$domain}Request extends FormRequest
{
    public function authorize() { return true; }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'logo' => 'nullable|string',
            'order' => 'nullable|integer',
            'has_promotion' => 'boolean',
            'status' => 'in:active,inactive',
            'parent_id' => 'nullable|integer|exists:{$pluralSnake},id',
        ];
    }
}
",
            "Http/Requests/Update{$domain}Request.php" => "<?php
namespace App\\Domain\\{$domain}\\Http\\Requests;
use Illuminate\\Foundation\\Http\\FormRequest;

class Update{$domain}Request extends FormRequest
{
    public function authorize() { return true; }

    public function rules()
    {
        return [
            'name' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|nullable|string|max:255',
            'logo' => 'nullable|string',
            'order' => 'nullable|integer',
            'has_promotion' => 'boolean',
            'status' => 'in:active,inactive',
            'parent_id' => 'nullable|integer|exists:{$pluralSnake},id',
        ];
    }
}
",
            "Providers/{$domain}ServiceProvider.php" => "<?php
namespace App\\Domain\\{$domain}\\Providers;
use Illuminate\\Support\\ServiceProvider;
use App\\Domain\\{$domain}\\Repositories\\{$domain}RepositoryInterface;
use App\\Domain\\{$domain}\\Repositories\\{$domain}Repository;

class {$domain}ServiceProvider extends ServiceProvider
{
    public function register()
    {
        \$this->app->bind({$domain}RepositoryInterface::class, {$domain}Repository::class);
    }

    public function boot()
    {
        \\App\\Domain\\{$domain}\\Entities\\{$domain}::observe(\\App\\Domain\\{$domain}\\Observers\\{$domain}Observer::class);
    }
}
",
        ];

        foreach ($files as $path => $content) {
            File::put("{$basePath}/{$path}", $content);
        }

        // --- ROUTES IN DOMAIN ---
        File::ensureDirectoryExists("{$basePath}/routes");
        $routeFile = "{$basePath}/routes/api.php";
        File::put($routeFile, "<?php

use Illuminate\\Support\\Facades\\Route;
use App\\Domain\\{$domain}\\Http\\Controllers\\{$domain}Controller;

Route::prefix('{$pluralSnake}')->group(function () {
    Route::get('/', [{$domain}Controller::class, 'index']);
    Route::post('/', [{$domain}Controller::class, 'store']);
    
    // CRUD routes with /detail/ prefix to avoid conflicts
    // Example: GET /api/v1/{$pluralSnake}/detail/some-slug
    Route::get('detail/{slug}', [{$domain}Controller::class, 'show'])->where('slug', '[a-zA-Z0-9\-]+');
    Route::put('detail/{slug}', [{$domain}Controller::class, 'update'])->where('slug', '[a-zA-Z0-9\-]+');
    Route::delete('detail/{slug}', [{$domain}Controller::class, 'destroy'])->where('slug', '[a-zA-Z0-9\-]+');
});
");

        // --- AUTO REGISTER PROVIDER IN config/app.php ---
        $appConfig = config_path('app.php');
        $providerClassLaravel = "App\\Domain\\{$domain}\\Providers\\{$domain}ServiceProvider::class,";

        if (File::exists($appConfig) && !str_contains(File::get($appConfig), $providerClassLaravel)) {
            $content = File::get($appConfig);
            $content = preg_replace('/(\'providers\'\s*=>\s*\[)/', "$1\n        {$providerClassLaravel}", $content);
            File::put($appConfig, $content);
        }

        $bootstrapProviders = base_path('bootstrap/providers.php');
        $providerClassBootstrap = "App\\Domain\\{$domain}\\Providers\\{$domain}ServiceProvider::class,";

        if (File::exists($bootstrapProviders)) {
            $content = File::get($bootstrapProviders);
            if (!str_contains($content, $providerClassBootstrap)) {
                $content = preg_replace('/return\s*\[\s*/', "return [\n    {$providerClassBootstrap}\n", $content);
                File::put($bootstrapProviders, $content);
            }
        }

        $this->info("Domain {$domain} fully created!");
    }
}
