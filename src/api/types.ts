// Central API types

/**
 * Standard API error model returned by the backend or formatted by the API client
 */
export interface ApiError {
  message: string;
  status?: number;
  data?: any; // Additional error details provided by the backend
  isNetworkError?: boolean;
}

/**
 * Standard API response wrapper if the backend wraps responses
 */
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

export interface Trainer {
  id: string;
  email?: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  profileImage: string | null;
  bio?: string | null;
  specialization?: string | null;
  experience?: number | null;
  availability?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GymClass {
  id: string;
  name: string;
  description: string;
  type: string;
  capacity: number;
  duration: number;
  defaultTrainerId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  defaultTrainer: Trainer | null;
}

export interface Schedule {
  id: string;
  classId: string;
  trainerId: string;
  date: string;
  day: string;
  startTime: string;
  endTime: string;
  availableSlots: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  class: {
    name: string;
    type: string;
    duration: number;
    capacity: number;
  };
  trainer: Trainer;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Booking {
  id: string;
  memberId: string;
  scheduleId: string;
  status: BookingStatus;
  createdAt: string;
  schedule: {
    class: {
      name: string;
      type: string;
      duration?: number;
    };
    trainer: {
      firstName: string;
      lastName: string;
    };
    startTime?: string;
    endTime?: string;
    date?: string;
  };
}

export type WorkoutDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type WorkoutStatus = 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';

export interface Exercise {
  id: string;
  name: string;
  description?: string | null;
  sets: number;
  repetitions: number;
  duration?: number | null;
  restTime?: number | null;
  order: number;
  notes?: string | null;
  workoutId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Workout {
  id: string;
  title: string;
  description?: string | null;
  goal?: string | null;
  duration?: number | null;
  difficulty: WorkoutDifficulty;
  status: WorkoutStatus;
  memberId: string;
  trainerId: string;
  createdAt: string;
  updatedAt: string;
  member?: {
    firstName: string;
    lastName: string;
  };
  trainer?: {
    firstName: string;
    lastName: string;
  };
  exercises: Exercise[];
}

export interface Progress {
  id: string;
  memberId: string;
  weight: number;
  height: number;
  bodyFatPercentage?: number | null;
  chest?: number | null;
  waist?: number | null;
  hips?: number | null;
  arms?: number | null;
  thighs?: number | null;
  notes?: string | null;
  recordedAt: string;
  createdAt: string;
  updatedAt: string;
  member?: {
    firstName: string;
    lastName: string;
  };
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE';

export interface Attendance {
  id: string;
  bookingId: string;
  memberId: string;
  scheduleId: string;
  status: AttendanceStatus;
  checkInTime: string;
  checkOutTime?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  member?: {
    firstName: string;
    lastName: string;
  };
  schedule?: {
    date: string;
    startTime: string;
    endTime: string;
    class?: {
      name: string;
    };
  };
}
