import React from 'react';
import { SidebarTrigger, SidebarProvider } from '@/Components/ui/sidebar';
import { AppSidebar } from '@/Components/AppSidebar';
import Appearance from '@/Components/Appearance';
import { Toaster } from '@/Components/ui/toaster';
import TeamDropdown from '@/Components/TeamDropdown';
import NotificationsDropdown from '@/Components/NotificationsDropdown';

export default function AuthenticatedLayout({ header, children }: React.PropsWithChildren<{ header: React.ReactNode }>) {
    return (
        <SidebarProvider >
            <AppSidebar />

            <main className="min-h-screen w-full flex flex-col">
                <header className="px-4 border-b h-16 flex items-center">
                    <div className='flex w-full justify-between items-center'>
                        <div className='flex flex-1 items-center gap-2'>
                            <SidebarTrigger />
                            {header}
                        </div>
                        <div className='flex items-center gap-2'>
                            <TeamDropdown />
                            <NotificationsDropdown />
                            <Appearance />
                        </div>
                    </div>
                </header>

                <div className='py-4 sm:py-6 lg:py-12 flex-1'>
                    <div className="max-w-7xl mx-auto  px-4 sm:px-6 lg:px-8">
                        {children}
                        <Toaster />
                    </div>
                </div>

                <footer>
                    <div className="max-w-7xl border-t mx-auto sm:px-6 lg:px-8">
                        <div className="py-4 text-center text-sm text-muted-foreground">
                            &copy; 2025 Your Company
                        </div>
                    </div>
                </footer>

            </main>
        </SidebarProvider>
    )
}