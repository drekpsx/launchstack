-- ============================================================================
-- Launchstack — AI E-commerce OS — full schema
-- No AI API tables/columns: this system stores rules, templates and profiles
-- only. All "personalization" happens client-side via deterministic rules.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0. Foundations: roles and a shared updated_at trigger function
-- ----------------------------------------------------------------------------
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    role public.app_role not null default 'user',
    unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1
        from public.user_roles
        where user_id = _user_id
          and role = _role
    )
$$;

create policy "Admins can view all roles" on public.user_roles
    for select using (public.has_role(auth.uid(), 'admin'));
create policy "Admins can manage roles" on public.user_roles
    for all using (public.has_role(auth.uid(), 'admin'));

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- 1. profiles — one row per auth user (plan / billing cache lives here)
-- ----------------------------------------------------------------------------
create table public.profiles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null unique,
    first_name text,
    email text,
    plan text not null default 'free' check (plan in ('free', 'pro')),
    subscription_status text not null default 'inactive'
        check (subscription_status in ('inactive', 'trialing', 'active', 'past_due', 'canceled')),
    stripe_customer_id text,
    stripe_subscription_id text,
    onboarding_completed boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile" on public.profiles
    for select using (auth.uid() = user_id);
create policy "Users can update their own profile" on public.profiles
    for update using (auth.uid() = user_id);
create policy "Users can insert their own profile" on public.profiles
    for insert with check (auth.uid() = user_id);
create policy "Admins can view all profiles" on public.profiles
    for select using (public.has_role(auth.uid(), 'admin'));
create policy "Admins can update all profiles" on public.profiles
    for update using (public.has_role(auth.uid(), 'admin'));

create trigger update_profiles_updated_at before update on public.profiles
    for each row execute function public.update_updated_at_column();

-- ----------------------------------------------------------------------------
-- 2. business_profiles — the questionnaire output, one per user
-- ----------------------------------------------------------------------------
create table public.business_profiles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null unique,

    -- Section A — Business
    business_type text,
    target_country text,
    target_language text,
    monthly_revenue text,
    primary_goal text,

    -- Section B — Product
    product text,
    niche text,
    average_price text,
    product_cost text,
    unique_selling_point text,

    -- Section C — Customer
    target_customer text,
    customer_problem text,
    purchase_reason text,
    main_objection text,

    -- Section D — Acquisition
    acquisition_channels text[] not null default '{}',
    marketing_budget text,
    content_types text[] not null default '{}',

    -- Section E — Goals
    revenue_goal text,
    goal_90_days text,
    main_problem text,
    desired_result text,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.business_profiles enable row level security;

create policy "Users can view their own business profile" on public.business_profiles
    for select using (auth.uid() = user_id);
create policy "Users can insert their own business profile" on public.business_profiles
    for insert with check (auth.uid() = user_id);
create policy "Users can update their own business profile" on public.business_profiles
    for update using (auth.uid() = user_id);
create policy "Users can delete their own business profile" on public.business_profiles
    for delete using (auth.uid() = user_id);
create policy "Admins can view all business profiles" on public.business_profiles
    for select using (public.has_role(auth.uid(), 'admin'));

create trigger update_business_profiles_updated_at before update on public.business_profiles
    for each row execute function public.update_updated_at_column();

-- ----------------------------------------------------------------------------
-- 3. modules — the 12 workspace categories (Product Research, Meta Ads, ...)
-- ----------------------------------------------------------------------------
create table public.modules (
    id uuid primary key default gen_random_uuid(),
    slug text not null unique,
    name text not null,
    description text,
    icon text not null default 'sparkles',
    sort_order integer not null default 0,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.modules enable row level security;

create policy "Anyone can view active modules" on public.modules
    for select using (true);
create policy "Admins can manage modules" on public.modules
    for all using (public.has_role(auth.uid(), 'admin'));

create trigger update_modules_updated_at before update on public.modules
    for each row execute function public.update_updated_at_column();

-- ----------------------------------------------------------------------------
-- 4. prompt_templates — the personalized-prompt content, admin editable
-- ----------------------------------------------------------------------------
create table public.prompt_templates (
    id uuid primary key default gen_random_uuid(),
    module_id uuid references public.modules(id) on delete cascade not null,
    title text not null,
    description text,
    objective text,
    difficulty text not null default 'beginner'
        check (difficulty in ('beginner', 'intermediate', 'advanced')),
    content text not null,
    required_variables text[] not null default '{}',
    tags text[] not null default '{}',
    -- Empty array = compatible with every value (no filtering on that axis)
    business_types text[] not null default '{}',
    channels text[] not null default '{}',
    goals text[] not null default '{}',
    problems text[] not null default '{}',
    premium boolean not null default false,
    version integer not null default 1,
    is_active boolean not null default true,
    sort_order integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.prompt_templates enable row level security;

create policy "Anyone can view active templates" on public.prompt_templates
    for select using (true);
create policy "Admins can manage templates" on public.prompt_templates
    for all using (public.has_role(auth.uid(), 'admin'));

create trigger update_prompt_templates_updated_at before update on public.prompt_templates
    for each row execute function public.update_updated_at_column();

create index prompt_templates_module_id_idx on public.prompt_templates(module_id);

-- ----------------------------------------------------------------------------
-- 5. workflows & workflow_steps — guided multi-prompt sequences
-- ----------------------------------------------------------------------------
create table public.workflows (
    id uuid primary key default gen_random_uuid(),
    slug text not null unique,
    title text not null,
    description text,
    icon text not null default 'route',
    business_types text[] not null default '{}',
    channels text[] not null default '{}',
    goals text[] not null default '{}',
    problems text[] not null default '{}',
    premium boolean not null default false,
    sort_order integer not null default 0,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.workflows enable row level security;

create policy "Anyone can view active workflows" on public.workflows
    for select using (true);
create policy "Admins can manage workflows" on public.workflows
    for all using (public.has_role(auth.uid(), 'admin'));

create trigger update_workflows_updated_at before update on public.workflows
    for each row execute function public.update_updated_at_column();

create table public.workflow_steps (
    id uuid primary key default gen_random_uuid(),
    workflow_id uuid references public.workflows(id) on delete cascade not null,
    template_id uuid references public.prompt_templates(id) on delete set null,
    title text not null,
    description text,
    sort_order integer not null default 0,
    created_at timestamptz not null default now()
);

alter table public.workflow_steps enable row level security;

create policy "Anyone can view workflow steps" on public.workflow_steps
    for select using (true);
create policy "Admins can manage workflow steps" on public.workflow_steps
    for all using (public.has_role(auth.uid(), 'admin'));

create index workflow_steps_workflow_id_idx on public.workflow_steps(workflow_id);

-- ----------------------------------------------------------------------------
-- 6. favorites, prompt_history, workflow_step_progress — per-user activity
-- ----------------------------------------------------------------------------
create table public.favorites (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    template_id uuid references public.prompt_templates(id) on delete cascade not null,
    created_at timestamptz not null default now(),
    unique (user_id, template_id)
);

alter table public.favorites enable row level security;

create policy "Users can manage their own favorites" on public.favorites
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table public.prompt_history (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    template_id uuid references public.prompt_templates(id) on delete cascade not null,
    created_at timestamptz not null default now()
);

alter table public.prompt_history enable row level security;

create policy "Users can view their own history" on public.prompt_history
    for select using (auth.uid() = user_id);
create policy "Users can insert their own history" on public.prompt_history
    for insert with check (auth.uid() = user_id);
create policy "Users can delete their own history" on public.prompt_history
    for delete using (auth.uid() = user_id);

create index prompt_history_user_id_idx on public.prompt_history(user_id, created_at desc);

create table public.workflow_step_progress (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    workflow_id uuid references public.workflows(id) on delete cascade not null,
    step_id uuid references public.workflow_steps(id) on delete cascade not null,
    completed_at timestamptz not null default now(),
    unique (user_id, step_id)
);

alter table public.workflow_step_progress enable row level security;

create policy "Users can manage their own workflow progress" on public.workflow_step_progress
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- 7. subscriptions — Stripe event log (webhook writes via service role)
-- ----------------------------------------------------------------------------
create table public.subscriptions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    stripe_customer_id text,
    stripe_subscription_id text,
    plan text not null default 'free' check (plan in ('free', 'pro')),
    status text not null default 'inactive'
        check (status in ('inactive', 'trialing', 'active', 'past_due', 'canceled')),
    current_period_end timestamptz,
    cancel_at_period_end boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "Users can view their own subscriptions" on public.subscriptions
    for select using (auth.uid() = user_id);
create policy "Admins can view all subscriptions" on public.subscriptions
    for select using (public.has_role(auth.uid(), 'admin'));
create policy "Admins can manage subscriptions" on public.subscriptions
    for all using (public.has_role(auth.uid(), 'admin'));

create trigger update_subscriptions_updated_at before update on public.subscriptions
    for each row execute function public.update_updated_at_column();

-- ----------------------------------------------------------------------------
-- 8. New-user bootstrap: create profiles row on signup
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.profiles (user_id, email, first_name)
    values (new.id, new.email, new.raw_user_meta_data->>'first_name');
    return new;
end;
$$;

create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();
