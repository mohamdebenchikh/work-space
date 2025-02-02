import { DropdownMenu, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { PageProps } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import { ChevronsUpDown, PlusIcon, SettingsIcon } from "lucide-react";


export default function TeamDropdown() {

    const { teams, currentTeam } = usePage<PageProps>().props.auth;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={'outline'} className="flex items-center justify-between w-[200px] gap-2">
                    <span>{currentTeam ? currentTeam.name : 'Select Team'}</span>
                    <ChevronsUpDown className=" h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-[200px]" align="start">
                <DropdownMenuLabel className="text-xs">Teams</DropdownMenuLabel>
                {teams.length !== 0 && teams.map((team) => (
                    <DropdownMenuItem className="flex items-center justify-between" key={team.id} onClick={() => { }}>
                        <span>{team.name}</span>
                        {team.id === currentTeam?.id && (
                            <span className="text-xs text-muted-foreground">Current</span>
                        )}
                    </DropdownMenuItem>
                ))}

                {currentTeam && (currentTeam.currentUserRole === 'owner' || currentTeam.currentUserRole === 'admin') && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={route('teams.edit', currentTeam.id)}>
                                <SettingsIcon className=" h-4 w-4" aria-hidden="true" />
                                Settings
                            </Link>
                        </DropdownMenuItem>
                    </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={route('teams.create')}>
                        <PlusIcon className=" h-4 w-4" aria-hidden="true" />
                        Create Team
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>

        </DropdownMenu>
    )
}