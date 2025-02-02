import { useEffect, useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/Components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Laptop } from 'lucide-react';

export default function Appearance() {
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

    // Apply the theme to the body element
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
        if (savedTheme) {
            setTheme(savedTheme);
        }

        const applyTheme = (theme: 'light' | 'dark' | 'system') => {
            const body = document.body;
            body.classList.remove('light', 'dark');

            if (theme === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                body.classList.add(prefersDark ? 'dark' : 'light');
            } else {
                body.classList.add(theme);
            }
        };

        applyTheme(savedTheme || 'system');

        // Watch for theme changes in system preferences
        const themeWatcher = (e: MediaQueryListEvent) => {
            if (theme === 'system') {
                const body = document.body;
                body.classList.remove('light', 'dark');
                body.classList.add(e.matches ? 'dark' : 'light');
            }
        };

        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
        systemTheme.addEventListener('change', themeWatcher);

        return () => {
            systemTheme.removeEventListener('change', themeWatcher);
        };
    }, [theme]);

    const updateTheme = (newTheme: 'light' | 'dark' | 'system') => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);

        const body = document.body;
        body.classList.remove('light', 'dark');
        if (newTheme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            body.classList.add(prefersDark ? 'dark' : 'light');
        } else {
            body.classList.add(newTheme);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    {theme === 'light' && <Sun className="h-4 w-4" />}
                    {theme === 'dark' && <Moon className="h-4 w-4" />}
                    {theme === 'system' && <Laptop className="h-4 w-4" />}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => updateTheme('light')}>
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateTheme('dark')}>
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateTheme('system')}>
                    <Laptop className="mr-2 h-4 w-4" />
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
