# Tax Slip Upload & User Display - Implementation Plan

## Overview
This plan outlines the implementation of:
1. Polished upload tax slip page with glassy, animated inputs
2. Database migration for tax_slips table
3. Server actions for file uploads to Supabase Storage
4. TanStack Query integration for server-side data fetching
5. User data display in navbar (server-side)

---

## Phase 1: Database Migration

### 1.1 Create Migration File
**File**: `supabase/migrations/[timestamp]_create_tax_slips_table.sql`

**Table Structure**:
```sql
CREATE TABLE IF NOT EXISTS public.tax_slips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_tax_slips_user_id ON public.tax_slips(user_id);
CREATE INDEX IF NOT EXISTS idx_tax_slips_category ON public.tax_slips(category);
CREATE INDEX IF NOT EXISTS idx_tax_slips_date ON public.tax_slips(date);
CREATE INDEX IF NOT EXISTS idx_tax_slips_created_at ON public.tax_slips(created_at);

-- Row Level Security
ALTER TABLE public.tax_slips ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own tax slips" ON public.tax_slips
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own tax slips" ON public.tax_slips
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own tax slips" ON public.tax_slips
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own tax slips" ON public.tax_slips
    FOR DELETE USING (auth.uid()::text = user_id::text);
```

**Actions**:
- Run: `npx supabase migration new create_tax_slips_table`
- Add SQL schema above
- Test migration locally

---

## Phase 2: Update Validation Schema

### 2.1 Update Tax Slip Schema
**File**: `src/lib/validations/tax-slip.ts`

**Changes**:
- Update schema to handle FormData properly
- Add proper number conversion for amount
- Ensure file validation matches storage requirements
- Add proper date validation

**Implementation**:
```typescript
export const taxSlipSchema = z.object({
    category: z.enum([...]),
    amount: z.coerce.number().positive("Amount must be greater than 0"),
    date: z.string().min(1, "Date is required"),
    description: z.string().optional(),
    file: z
        .instanceof(File)
        .refine((file) => file.size <= MAX_FILE_SIZE, "File size must be less than 5MB")
        .refine(
            (file) => ACCEPTED_FILE_TYPES.includes(file.type),
            "Only .jpg, .jpeg, .png, and .pdf files are accepted"
        ),
});
```

---

## Phase 3: Server Actions

### 3.1 Create Tax Slip Actions
**File**: `src/actions/tax-slip.actions.ts`

**Functions to Create**:

1. **`uploadTaxSlip(formData: FormData)`**
   - Validate form data using Zod
   - Get authenticated user
   - Upload file to Supabase Storage bucket "tax-slips"
   - Generate unique file path: `{userId}/{timestamp}-{filename}`
   - Insert record into tax_slips table
   - Return success/error response

2. **`getUserTaxSlips(userId: string)`**
   - Query tax_slips table filtered by user_id
   - Order by created_at DESC
   - Return array of tax slips

3. **`getTaxSlipById(id: string)`**
   - Get single tax slip by ID
   - Verify user ownership
   - Return tax slip data

4. **`deleteTaxSlip(id: string)`**
   - Verify user ownership
   - Delete file from storage
   - Delete record from database
   - Return success/error

**Storage Upload Pattern**:
```typescript
// Generate unique file path
const fileExt = file.name.split('.').pop();
const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

// Upload to Supabase Storage
const { data: uploadData, error: uploadError } = await supabase
    .storage
    .from('tax-slips')
    .upload(fileName, file, {
        contentType: file.type,
        upsert: false
    });

// Get public URL
const { data: urlData } = supabase
    .storage
    .from('tax-slips')
    .getPublicUrl(fileName);
```

---

## Phase 4: TanStack Query Setup

### 4.1 Create Query Functions
**File**: `src/lib/queries/tax-slip.queries.ts`

**Functions**:
- `getUserTaxSlipsQuery(userId: string)` - Query function
- `uploadTaxSlipMutation()` - Mutation function
- Query keys for cache management

### 4.2 Update Query Provider
**File**: `src/providers/query-provider.tsx`
- Ensure proper setup for server-side queries
- Configure query client options

---

## Phase 5: Upload Page Redesign

### 5.1 Update Upload Page
**File**: `src/app/upload/page.tsx`

**Design Requirements**:
- Glassy card with backdrop blur
- Animated input fields with blue accents
- Smooth transitions and hover effects
- Responsive design (mobile-first)
- Dark mode support with blue color scheme
- File upload with drag-and-drop visual feedback
- Loading states with skeleton loaders

**Input Styling**:
```typescript
className="dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-100 
          transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 
          focus:border-blue-500 hover:border-blue-400/50"
```

**Components to Use**:
- LoadingButton for submit button
- Animated file upload area
- Success/error alerts with animations
- Recent uploads list with skeleton loader

---

## Phase 6: Navbar User Display

### 6.1 Create User Data Server Component
**File**: `src/components/layout/navbar-user.tsx`

**Functionality**:
- Server component that fetches user data
- Display user name/email
- User dropdown menu (if needed)
- Sign out button
- Show only when authenticated

### 6.2 Update Navbar
**File**: `src/components/layout/navbar.tsx`

**Changes**:
- Import and use NavbarUser component
- Conditionally show Sign In button or user info
- Server-side user data fetching
- Proper loading states

**Implementation Pattern**:
```typescript
// Server component wrapper
import { NavbarUser } from "./navbar-user";

// In navbar
{user ? <NavbarUser user={user} /> : <SignInButton />}
```

---

## Phase 7: File Structure

```
src/
├── actions/
│   └── tax-slip.actions.ts          [NEW]
├── app/
│   └── upload/
│       ├── page.tsx                 [UPDATE]
│       └── loading.tsx              [NEW]
├── components/
│   ├── layout/
│   │   ├── navbar.tsx               [UPDATE]
│   │   └── navbar-user.tsx          [NEW]
│   └── upload/
│       ├── upload-form.tsx          [NEW - Optional]
│       └── recent-uploads.tsx       [NEW - Optional]
├── lib/
│   ├── queries/
│   │   └── tax-slip.queries.ts      [NEW]
│   └── validations/
│       └── tax-slip.ts              [UPDATE]
└── types/
    └── index.ts                     [UPDATE - Add TaxSlip type]
```

---

## Phase 8: TypeScript Types

### 8.1 Create Types
**File**: `src/types/index.ts`

**Types to Add**:
```typescript
export type TaxSlip = {
    id: string;
    user_id: string;
    category: string;
    amount: number;
    date: string;
    description: string | null;
    file_url: string;
    file_name: string;
    file_size: number;
    file_type: string;
    created_at: string;
    updated_at: string;
};

export type TaxSlipFormData = {
    category: string;
    amount: number;
    date: string;
    description?: string;
    file: File;
};
```

---

## Phase 9: Implementation Steps

### Step 1: Database Setup
1. Create migration file
2. Run migration: `npx supabase db push`
3. Create storage bucket "tax-slips" in Supabase dashboard
4. Set bucket to public or configure policies

### Step 2: Storage Bucket Configuration
**In Supabase Dashboard**:
- Go to Storage
- Create bucket: `tax-slips`
- Set to public (or configure RLS policies)
- Allow file uploads

### Step 3: Server Actions
1. Create `tax-slip.actions.ts`
2. Implement file upload logic
3. Implement database insert
4. Add error handling
5. Test with sample data

### Step 4: Validation Updates
1. Update `tax-slip.ts` schema
2. Ensure proper type coercion
3. Test validation

### Step 5: TanStack Query Setup
1. Create query functions
2. Set up mutations
3. Configure query keys
4. Test data fetching

### Step 6: UI Updates
1. Redesign upload page
2. Add glassy, animated inputs
3. Implement file upload UI
4. Add loading states
5. Add success/error handling
6. Make responsive

### Step 7: Navbar Updates
1. Create NavbarUser component
2. Fetch user data server-side
3. Update navbar to show user info
4. Add sign out functionality

### Step 8: Testing
1. Test file uploads
2. Test form validation
3. Test error handling
4. Test responsive design
5. Test dark mode
6. Test user display in navbar

---

## Phase 10: Key Implementation Details

### 10.1 File Upload Flow
```
User selects file
  ↓
Client-side validation (Zod)
  ↓
Form submission with FormData
  ↓
Server action receives FormData
  ↓
Extract file and validate
  ↓
Upload to Supabase Storage
  ↓
Get public URL
  ↓
Insert record to tax_slips table
  ↓
Return success/error
  ↓
Update UI with TanStack Query
```

### 10.2 Storage Path Structure
```
tax-slips/
  └── {userId}/
      ├── {timestamp}-{random}.pdf
      ├── {timestamp}-{random}.jpg
      └── ...
```

### 10.3 Error Handling
- File size validation
- File type validation
- Storage upload errors
- Database insert errors
- User authentication errors
- Network errors

### 10.4 Security Considerations
- RLS policies on tax_slips table
- User ownership verification
- File type restrictions
- File size limits
- Authenticated users only

---

## Phase 11: Styling Guidelines

### 11.1 Glassy Input Style
```css
- backdrop-blur-md
- bg-background/80
- border-blue-500/30
- focus:ring-2 focus:ring-blue-500/50
- transition-all duration-200
- hover effects
```

### 11.2 Animation Guidelines
- Smooth transitions (200ms)
- Hover scale effects
- Focus ring animations
- Loading spinner animations
- Success/error message animations

### 11.3 Color Scheme
- Light mode: Blue accents on light background
- Dark mode: Blue gradients (blue-950, blue-900)
- Input borders: blue-500/30
- Focus rings: blue-500/50
- Text: blue-100 to blue-300 in dark mode

---

## Phase 12: Testing Checklist

- [ ] Migration runs successfully
- [ ] Storage bucket created and accessible
- [ ] File uploads work (PDF, JPG, PNG)
- [ ] File size validation works
- [ ] File type validation works
- [ ] Database records created correctly
- [ ] User can view own tax slips
- [ ] User cannot view others' tax slips
- [ ] Form validation works
- [ ] Error messages display correctly
- [ ] Success messages display correctly
- [ ] Loading states work
- [ ] Responsive design works
- [ ] Dark mode works
- [ ] Navbar shows user data
- [ ] Sign out works
- [ ] Recent uploads display correctly

---

## Phase 13: Dependencies

**No new dependencies required** - All functionality can be implemented with:
- Existing Supabase client
- Existing TanStack Query setup
- Existing UI components
- Next.js FormData handling

---

## Phase 14: Performance Considerations

1. **File Upload**:
   - Client-side validation before upload
   - Progress indicators for large files
   - Optimistic UI updates

2. **Data Fetching**:
   - Use TanStack Query caching
   - Pagination for large lists
   - Lazy loading for recent uploads

3. **Images**:
   - Optimize images before upload (if needed)
   - Use Supabase image transformations (if needed)

---

## Phase 15: Future Enhancements

1. File preview before upload
2. Drag and drop file upload
3. Multiple file upload
4. Image compression
5. PDF thumbnail generation
6. Search and filter tax slips
7. Export tax slips
8. Bulk operations

---

## Notes

- All TypeScript types must be properly defined (no `any`)
- All server actions must be properly typed
- All queries must use server-side data fetching
- All components must be responsive
- All styling must support dark mode
- All error handling must be user-friendly

---

**Estimated Implementation Time**: 4-6 hours

**Priority Order**:
1. Migration & Storage Setup (30 min)
2. Server Actions (1 hour)
3. Validation Updates (15 min)
4. Upload Page Redesign (1.5 hours)
5. Navbar User Display (30 min)
6. TanStack Query Integration (30 min)
7. Testing & Polish (1 hour)

