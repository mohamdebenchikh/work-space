<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Page;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;

class PageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $team = auth()->user()->currentTeam;
        $pages = $team->pages()->with('user')->latest()->get();

        return Inertia::render('Pages/Index', [
            'pages' => $pages
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Pages/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'content' => 'required|string',
            'status' => 'required|in:draft,published',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $team = auth()->user()->currentTeam;

        if($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('images');
        }

        $team->pages()->create([
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']),
            'description' => $validated['description'],
            'content' => $validated['content'],
            'status' => $validated['status'],
            'user_id' => auth()->id(),
            'image' => $validated['image'],
        ]);

        return redirect()->route('pages.index')->with('success', 'Page created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $page = Page::where('team_id', auth()->user()->currentTeam->id)
            ->findOrFail($id);

        return Inertia::render('Pages/Show', [
            'page' => $page
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $page = Page::where('team_id', auth()->user()->currentTeam->id)
            ->findOrFail($id);

        return Inertia::render('Pages/Edit', [
            'page' => $page
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $page = Page::where('team_id', auth()->user()->currentTeam->id)
            ->findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'content' => 'required|string',
            'status' => 'required|in:draft,published',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('images');
        }

        $page->update([
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']),
            'description' => $validated['description'],
            'content' => $validated['content'],
            'status' => $validated['status'],
            'image' => $validated['image'],
        ]);

        return redirect()->route('pages.index')->with('success', 'Page updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $page = Page::where('team_id', auth()->user()->currentTeam->id)
            ->findOrFail($id);

        $page->delete();

        return redirect()->route('pages.index')->with('success', 'Page deleted successfully');
    }
}