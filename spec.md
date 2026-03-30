# Sunrise Public School

## Current State
- Admin Panel has a Teacher Management table with basic fields: name, subject, class assigned, phone, active status
- No dedicated teacher profile page exists
- Teachers have limited data (no designation, qualification, account info, personal details)

## Requested Changes (Diff)

### Add
- New TeacherProfile page at `/teacher/:id` showing full teacher details
- Extended Teacher data model with: name, designation, qualification, mobile, account number, branch name, IFSC code, Aadhar number, caste, gender, marital status, DOB, joining date, father's name, mother's name, subject, class assigned, active status
- "View Profile" button in Admin Panel teacher table rows that opens the teacher's full profile page
- "Add Teacher" button in Admin Panel to add new teachers with all fields
- Edit teacher functionality in the profile page
- Teacher profile page is separate from school profile

### Modify
- AdminPanel.tsx: extend Teacher interface with all new fields; add View Profile button per row; add Add Teacher modal with all fields
- App.tsx: add route for `/teacher/:id`
- Sidebar.tsx: add "Teachers" nav item linking to a teachers list page or keep Admin Panel access

### Remove
- Nothing removed

## Implementation Plan
1. Create extended Teacher interface with all required fields
2. Create TeacherProfile.tsx page showing all teacher info in a professional layout with edit capability
3. Create Teachers.tsx list page accessible from sidebar
4. Update AdminPanel.tsx to use extended teacher model and add View Profile + Add Teacher buttons
5. Update App.tsx to add new routes
6. Update Sidebar.tsx to add Teachers link
