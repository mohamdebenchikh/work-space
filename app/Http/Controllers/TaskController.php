<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Gate;

class TaskController extends Controller
{
    public function index()
    {
        $team = auth()->user()->currentTeam;
        $tasks = $team->tasks()
            ->with(['user', 'project', 'assignedUsers'])
            ->latest()
            ->get();

        return Inertia::render('Tasks/Index', [
            'tasks' => $tasks
        ]);
    }

    public function create()
    {
        Gate::authorize('create', Task::class);

        return Inertia::render('Tasks/Create', [
            'projects' => auth()->user()->currentTeam->projects,
            'teamMembers' => auth()->user()->currentTeam->members
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'due_date' => 'nullable|date',
            'priority' => 'required|in:low,medium,high',
            'status' => 'required|in:todo,in_progress,done',
            'project_id' => 'required|exists:projects,id',
            'notes' => 'nullable|string|max:1000',
            'assigned_user_ids' => 'array',
            'assigned_user_ids.*' => 'exists:users,id,team_id,' . auth()->user()->currentTeam->id,
            'progress' => 'nullable|integer|min:0|max:100',
            'started_at' => 'nullable|date',
            'completed_at' => 'nullable|date',
        ]);

        $validated['slug'] = Str::slug($validated['title']);
        $validated['user_id'] = auth()->id();
        $validated['team_id'] = auth()->user()->currentTeam->id;

        $task = Task::create($validated);
        $task->assignedUsers()->sync($validated['assigned_user_ids'] ?? []);

        return redirect()
            ->route('tasks.show', $task->id)
            ->with('success', 'Task created successfully.');
    }

    public function show(Task $task)
    {
        Gate::authorize('view', $task);

        return Inertia::render('Tasks/Show', [
            'task' => $task->load(['user', 'project', 'team', 'assignedUsers'])
        ]);
    }

    public function edit(Task $task)
    {
        Gate::authorize('update', $task);

        return Inertia::render('Tasks/Edit', [
            'task' => $task->load(['user', 'project', 'team', 'assignedUsers']),
            'projects' => auth()->user()->currentTeam->projects,
            'teamMembers' => auth()->user()->currentTeam->members
        ]);
    }

    public function update(Request $request, Task $task)
    {
        Gate::authorize('update', $task);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'project_id' => 'required|exists:projects,id',
            'due_date' => 'nullable|date',
            'priority' => 'required|in:low,medium,high',
            'status' => 'required|in:todo,in_progress,done',
            'notes' => 'nullable|string|max:1000',
            'progress' => 'nullable|integer|min:0|max:100',
            'started_at' => 'nullable|date',
            'completed_at' => 'nullable|date',
            'assigned_user_ids' => 'array',
            'assigned_user_ids.*' => 'exists:users,id,team_id,' . auth()->user()->currentTeam->id
        ]);

        if ($task->title !== $validated['title']) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $task->update($validated);
        $task->assignedUsers()->sync($validated['assigned_user_ids'] ?? []);

        return redirect()
            ->route('tasks.show', $task->id)
            ->with('success', 'Task updated successfully.');
    }

    public function destroy(Task $task)
    {
        Gate::authorize('delete', $task);

        $task->delete();

        return redirect()
            ->route('tasks.index')
            ->with('success', 'Task deleted successfully.');
    }
}