export type User = {
    id: number;
    name: string;
    email: string;
    photo_url?: string | null;
    bio?: string | null;
    email_verified_at?: string | null;
    created_at?: string;
    updated_at?: string;
};

export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export type Task = {
    id: number;
    title: string;
    description: string;
    project_id: number;
    user_id: number;
    team_id: number;
    order: number;
    status: TaskStatus;
    priority: TaskPriority;
    due_date?: string | null;
    started_at?: string | null;
    completed_at?: string | null;
    progress: number;
    notes?: string | null;
    created_at: string;
    updated_at: string;
    user?: User;
    project?: Project;
    assigned_users?: User[];
};

export type FacetFilter = {
  column: string
  title: string
  options: {
    value: string
    label: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
}

export type ProjectStatus = 'planned' | 'in_progress' | 'completed' | 'archived';

export type Project = {
    id: number;
    name: string;
    description: string;
    user_id: number;
    team_id: number;
    status: ProjectStatus;
    deadline?: string | null;
    created_at: string;
    updated_at: string;
    user: User;
    team: Team;
    tasks_count
};

export type NotificationType = 'invitation' | 'task_update' | 'system';

export type Notification = {
    id: number;
    data: {
        type: NotificationType;
        title: string;
        message: string;
        action_url?: string;
        accept_url?: string;
        reject_url?: string;
    };
    read_at?: string | null;
    created_at: string;
    updated_at: string;
};

export type TeamInvitationStatus = 'pending' | 'accepted' | 'rejected';

export type TeamInvitation = {
    id: number;
    team_id: number;
    user_id?: number | null;
    email: string;
    role: string;
    accept_token: string;
    reject_token: string;
    message?: string | null;
    accepted_at?: string | null;
    rejected_at?: string | null;
    created_at: string;
    updated_at: string;
    status: TeamInvitationStatus;
    user?: User | null;
    team: Team;
};

export type TeamRole = 'owner' | 'admin' | 'member';

export type Team = {
    id: number;
    name: string;
    description: string;
    owner_id: number;
    currentUserRole: TeamRole;
    created_at: string;
    updated_at: string;
    members: User[];
    invitations: TeamInvitation[];
};

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
        currentTeam?: Team;
        teams: Team[];
        unreadNotifications: Notification[];
    };
    flash?: {
        success?: string;
        error?: string;
        info?: string;
    };
};