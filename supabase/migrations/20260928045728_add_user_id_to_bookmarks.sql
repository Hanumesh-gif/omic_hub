/*
# Add user_id to bookmarks and switch to owner-scoped RLS

## Purpose
The app now has authentication. Bookmarks must be scoped to each signed-in user so
one user's saved careers are not visible to another.

## Changes to existing tables

### bookmarks
- Added `user_id` column (uuid, NOT NULL, defaults to the authenticated user via `auth.uid()`).
  This column links each bookmark to the user who created it.
- Added a foreign key from `bookmarks.user_id` to `auth.users(id)` with `ON DELETE CASCADE`,
  so if a user is deleted, their bookmarks are removed automatically.

## Security changes
- Replaced the previous open `anon, authenticated` policies on `bookmarks` with
  owner-scoped policies using `auth.uid() = user_id`.
- SELECT: users can only view their own bookmarks.
- INSERT: users can only insert bookmarks for themselves (WITH CHECK enforces ownership).
- DELETE: users can only delete their own bookmarks.
- No UPDATE policy needed (bookmarks are created and deleted, never edited).

## Important notes
1. The `user_id` column has `DEFAULT auth.uid()` so frontend inserts that omit
   `user_id` will still satisfy the INSERT policy's `WITH CHECK`.
2. The `careers` table policies remain open (`TO anon, authenticated`) since career
   data is public reference content that all users should be able to read.
3. This migration is safe to re-run — it uses `IF NOT EXISTS` for the column
   addition and drops policies before recreating them.
*/

-- Add user_id column to bookmarks if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookmarks' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE bookmarks ADD COLUMN user_id uuid NOT NULL DEFAULT auth.uid();
  END IF;
END $$;

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'bookmarks_user_id_fkey'
  ) THEN
    ALTER TABLE bookmarks
    ADD CONSTRAINT bookmarks_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Replace policies: drop old open policies, add owner-scoped policies
DROP POLICY IF EXISTS "anon_select_bookmarks" ON bookmarks;
DROP POLICY IF EXISTS "anon_insert_bookmarks" ON bookmarks;
DROP POLICY IF EXISTS "anon_delete_bookmarks" ON bookmarks;

DROP POLICY IF EXISTS "select_own_bookmarks" ON bookmarks;
CREATE POLICY "select_own_bookmarks" ON bookmarks FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_bookmarks" ON bookmarks;
CREATE POLICY "insert_own_bookmarks" ON bookmarks FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_bookmarks" ON bookmarks;
CREATE POLICY "delete_own_bookmarks" ON bookmarks FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
