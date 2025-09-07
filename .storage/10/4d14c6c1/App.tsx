import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Public pages
import Index from './pages/Index';
import About from './pages/About';
import Activities from './pages/Activities';
import Team from './pages/Team';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import PreRegistration from './pages/PreRegistration';
import Login from './pages/Login';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import ChildrenManagement from './pages/admin/ChildrenManagement';
import DocumentsManagement from './pages/admin/DocumentsManagement';
import CoursesManagement from './pages/admin/CoursesManagement';
import EducatorsManagement from './pages/admin/EducatorsManagement';
import ScheduleManagement from './pages/admin/ScheduleManagement';
import ExpensesManagement from './pages/admin/ExpensesManagement';
import PaymentsManagement from './pages/admin/PaymentsManagement';

// Parent pages
import ParentDashboard from './pages/parent/Dashboard';
import ChildInfo from './pages/parent/ChildInfo';
import Payments from './pages/parent/Payments';
import Remarks from './pages/parent/Remarks';

import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/team" element={<Team />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/pre-registration" element={<PreRegistration />} />
            <Route path="/login" element={<Login />} />

            {/* Admin routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin', 'educator']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/children" element={
              <ProtectedRoute allowedRoles={['admin', 'educator']}>
                <ChildrenManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/documents" element={
              <ProtectedRoute allowedRoles={['admin', 'educator']}>
                <DocumentsManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/courses" element={
              <ProtectedRoute allowedRoles={['admin', 'educator']}>
                <CoursesManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/educators" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <EducatorsManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/schedule" element={
              <ProtectedRoute allowedRoles={['admin', 'educator']}>
                <ScheduleManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/expenses" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ExpensesManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/payments" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <PaymentsManagement />
              </ProtectedRoute>
            } />

            {/* Parent routes */}
            <Route path="/parent" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ParentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/parent/child" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ChildInfo />
              </ProtectedRoute>
            } />
            <Route path="/parent/payments" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <Payments />
              </ProtectedRoute>
            } />
            <Route path="/parent/remarks" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <Remarks />
              </ProtectedRoute>
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;