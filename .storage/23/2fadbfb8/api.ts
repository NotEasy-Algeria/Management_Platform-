// API configuration and utilities
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.maCreche.dz' 
  : 'http://localhost:3000/api';

// Types for API responses
export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  age: number;
  group: string;
  parentId: string;
  parentName: string;
  enrollmentDate: string;
  medicalInfo: string;
  allergies: string;
  emergencyContact: string;
  status: 'active' | 'inactive';
}

export interface Educator {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  specialties: string[];
  experience: string;
  status: 'active' | 'inactive';
}

export interface Course {
  id: string;
  name: string;
  description: string;
  ageGroup: string;
  duration: string;
  instructorId: string;
  instructorName: string;
  participants: number;
  schedule: string;
  maxParticipants: number;
}

export interface Payment {
  id: string;
  childId: string;
  childName: string;
  parentName: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'paid' | 'pending' | 'overdue';
  invoiceNumber: string;
}

export interface PreRegistration {
  id: string;
  childFirstName: string;
  childLastName: string;
  childBirthDate: string;
  parentFirstName: string;
  parentLastName: string;
  parentEmail: string;
  parentPhone: string;
  address: string;
  preferredStartDate: string;
  plan: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

// Mock data store (will be replaced with PostgreSQL)
class MockAPIStore {
  private children: Child[] = [
    {
      id: '1',
      firstName: 'Yasmine',
      lastName: 'Benali',
      birthDate: '2021-03-15',
      age: 3,
      group: 'Groupe Moyen',
      parentId: 'parent1',
      parentName: 'Fatima Benali',
      enrollmentDate: '2024-01-15',
      medicalInfo: 'RAS',
      allergies: 'Aucune',
      emergencyContact: 'Ahmed Benali - +213 555 654 321',
      status: 'active'
    },
    {
      id: '2',
      firstName: 'Rayan',
      lastName: 'Khelifi',
      birthDate: '2022-06-10',
      age: 2,
      group: 'Groupe Petit',
      parentId: 'parent2',
      parentName: 'Mohamed Khelifi',
      enrollmentDate: '2024-01-10',
      medicalInfo: 'Asthme léger',
      allergies: 'Arachides',
      emergencyContact: 'Samira Khelifi - +213 555 789 123',
      status: 'active'
    }
  ];

  private educators: Educator[] = [
    {
      id: '1',
      firstName: 'Amina',
      lastName: 'Bensaid',
      email: 'amina.bensaid@maCreche.dz',
      phone: '+213 555 123 456',
      role: 'Directrice & Éducatrice principale',
      specialties: ['Développement cognitif', 'Arts créatifs'],
      experience: '8 ans',
      status: 'active'
    }
  ];

  private courses: Course[] = [
    {
      id: '1',
      name: 'Arts Créatifs',
      description: 'Peinture, dessin et activités manuelles',
      ageGroup: '2-5 ans',
      duration: '45 min',
      instructorId: '1',
      instructorName: 'Amina Bensaid',
      participants: 12,
      schedule: 'Lundi, Mercredi, Vendredi 10h00',
      maxParticipants: 15
    }
  ];

  private payments: Payment[] = [
    {
      id: '1',
      childId: '1',
      childName: 'Yasmine Benali',
      parentName: 'Fatima Benali',
      amount: 15000,
      dueDate: '2024-01-31',
      paidDate: '2024-01-28',
      status: 'paid',
      invoiceNumber: 'INV-2024-001'
    }
  ];

  private preRegistrations: PreRegistration[] = [];

  // Children CRUD
  getChildren(): Child[] {
    return [...this.children];
  }

  addChild(child: Omit<Child, 'id'>): Child {
    const newChild = { ...child, id: Date.now().toString() };
    this.children.push(newChild);
    return newChild;
  }

  updateChild(id: string, updates: Partial<Child>): Child | null {
    const index = this.children.findIndex(c => c.id === id);
    if (index === -1) return null;
    this.children[index] = { ...this.children[index], ...updates };
    return this.children[index];
  }

  deleteChild(id: string): boolean {
    const index = this.children.findIndex(c => c.id === id);
    if (index === -1) return false;
    this.children.splice(index, 1);
    return true;
  }

  // Educators CRUD
  getEducators(): Educator[] {
    return [...this.educators];
  }

  addEducator(educator: Omit<Educator, 'id'>): Educator {
    const newEducator = { ...educator, id: Date.now().toString() };
    this.educators.push(newEducator);
    return newEducator;
  }

  updateEducator(id: string, updates: Partial<Educator>): Educator | null {
    const index = this.educators.findIndex(e => e.id === id);
    if (index === -1) return null;
    this.educators[index] = { ...this.educators[index], ...updates };
    return this.educators[index];
  }

  deleteEducator(id: string): boolean {
    const index = this.educators.findIndex(e => e.id === id);
    if (index === -1) return false;
    this.educators.splice(index, 1);
    return true;
  }

  // Courses CRUD
  getCourses(): Course[] {
    return [...this.courses];
  }

  addCourse(course: Omit<Course, 'id'>): Course {
    const newCourse = { ...course, id: Date.now().toString() };
    this.courses.push(newCourse);
    return newCourse;
  }

  updateCourse(id: string, updates: Partial<Course>): Course | null {
    const index = this.courses.findIndex(c => c.id === id);
    if (index === -1) return null;
    this.courses[index] = { ...this.courses[index], ...updates };
    return this.courses[index];
  }

  deleteCourse(id: string): boolean {
    const index = this.courses.findIndex(c => c.id === id);
    if (index === -1) return false;
    this.courses.splice(index, 1);
    return true;
  }

  // Payments CRUD
  getPayments(): Payment[] {
    return [...this.payments];
  }

  addPayment(payment: Omit<Payment, 'id'>): Payment {
    const newPayment = { ...payment, id: Date.now().toString() };
    this.payments.push(newPayment);
    return newPayment;
  }

  updatePayment(id: string, updates: Partial<Payment>): Payment | null {
    const index = this.payments.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.payments[index] = { ...this.payments[index], ...updates };
    return this.payments[index];
  }

  deletePayment(id: string): boolean {
    const index = this.payments.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.payments.splice(index, 1);
    return true;
  }

  // Pre-registrations CRUD
  getPreRegistrations(): PreRegistration[] {
    return [...this.preRegistrations];
  }

  addPreRegistration(preReg: Omit<PreRegistration, 'id' | 'submittedAt'>): PreRegistration {
    const newPreReg = { 
      ...preReg, 
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      status: 'pending' as const
    };
    this.preRegistrations.push(newPreReg);
    return newPreReg;
  }

  updatePreRegistration(id: string, updates: Partial<PreRegistration>): PreRegistration | null {
    const index = this.preRegistrations.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.preRegistrations[index] = { ...this.preRegistrations[index], ...updates };
    return this.preRegistrations[index];
  }
}

// Global store instance
const store = new MockAPIStore();

// API functions that simulate HTTP requests
export const api = {
  // Children
  children: {
    getAll: async (): Promise<Child[]> => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      return store.getChildren();
    },
    create: async (child: Omit<Child, 'id'>): Promise<Child> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return store.addChild(child);
    },
    update: async (id: string, updates: Partial<Child>): Promise<Child> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const result = store.updateChild(id, updates);
      if (!result) throw new Error('Child not found');
      return result;
    },
    delete: async (id: string): Promise<void> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const success = store.deleteChild(id);
      if (!success) throw new Error('Child not found');
    }
  },

  // Educators
  educators: {
    getAll: async (): Promise<Educator[]> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return store.getEducators();
    },
    create: async (educator: Omit<Educator, 'id'>): Promise<Educator> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return store.addEducator(educator);
    },
    update: async (id: string, updates: Partial<Educator>): Promise<Educator> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const result = store.updateEducator(id, updates);
      if (!result) throw new Error('Educator not found');
      return result;
    },
    delete: async (id: string): Promise<void> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const success = store.deleteEducator(id);
      if (!success) throw new Error('Educator not found');
    }
  },

  // Courses
  courses: {
    getAll: async (): Promise<Course[]> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return store.getCourses();
    },
    create: async (course: Omit<Course, 'id'>): Promise<Course> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return store.addCourse(course);
    },
    update: async (id: string, updates: Partial<Course>): Promise<Course> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const result = store.updateCourse(id, updates);
      if (!result) throw new Error('Course not found');
      return result;
    },
    delete: async (id: string): Promise<void> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const success = store.deleteCourse(id);
      if (!success) throw new Error('Course not found');
    }
  },

  // Payments
  payments: {
    getAll: async (): Promise<Payment[]> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return store.getPayments();
    },
    create: async (payment: Omit<Payment, 'id'>): Promise<Payment> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return store.addPayment(payment);
    },
    update: async (id: string, updates: Partial<Payment>): Promise<Payment> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const result = store.updatePayment(id, updates);
      if (!result) throw new Error('Payment not found');
      return result;
    }
  },

  // Pre-registrations
  preRegistrations: {
    getAll: async (): Promise<PreRegistration[]> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return store.getPreRegistrations();
    },
    create: async (preReg: Omit<PreRegistration, 'id' | 'submittedAt'>): Promise<PreRegistration> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return store.addPreRegistration(preReg);
    },
    update: async (id: string, updates: Partial<PreRegistration>): Promise<PreRegistration> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const result = store.updatePreRegistration(id, updates);
      if (!result) throw new Error('Pre-registration not found');
      return result;
    }
  }
};