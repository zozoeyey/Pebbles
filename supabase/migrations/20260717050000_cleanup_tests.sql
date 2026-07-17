-- Remove rows created while verifying the share RPC.
delete from public.reflections where session_id = 'patch-test';
