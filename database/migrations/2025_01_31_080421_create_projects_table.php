<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->constrained()
                ->onDelete('cascade')
                ->comment('Project owner or creator');
            
            $table->foreignId('team_id')
                ->constrained()
                ->onDelete('cascade')
                ->comment('Associated team');
            
            $table->string('name', 255);
            $table->text('description')->nullable();
            
            $table->enum('status', ['planned', 'in_progress', 'completed', 'archived'])
                ->default('planned')
                ->comment('Project status');
            
            $table->dateTime('deadline')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Add indexes for frequently searched columns
            $table->index('title');
            $table->index('status');
            $table->index('deadline');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};