-- Run AFTER the admin user with email litbang.himatif@gmail.com has registered.
UPDATE public.profiles p
SET is_admin = true
FROM auth.users u
WHERE u.email = 'litbang.himatif@gmail.com' AND p.id = u.id;
