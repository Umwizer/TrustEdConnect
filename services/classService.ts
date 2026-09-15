// services/classService.ts
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export interface ClassData {
  id: string;
  className: string;
  subject: string;
  gradeLevel: string;
  room: string;
  studentCount: number;
}

// ✅ Rwanda secondary school class levels
export const SECONDARY_CLASSES = [
  'S1A', 'S1B', 'S1C',
  'S2A', 'S2B', 'S2C',
  'S3A', 'S3B', 'S3C',
  'S4A', 'S4B', 'S4C',
  'S5A', 'S5B', 'S5C',
  'S6A', 'S6B', 'S6C',
];

export const SUBJECTS = [
  'Mathematics', 'English', 'Kinyarwanda', 'French',
  'Physics', 'Chemistry', 'Biology',
  'History', 'Geography', 'Computer Science',
  'Entrepreneurship', 'Religion',
];

export const getTeacherClasses = async (teacherId: string): Promise<ClassData[]> => {
  try {
    const snap = await getDocs(
      query(collection(db, 'classes'), where('teacherId', '==', teacherId))
    );
    return snap.docs.map(doc => {
      const d = doc.data();
      return {
        id: doc.id,
        className: d.className || d.name || '',
        subject: d.subject || '',
        gradeLevel: d.gradeLevel || '',
        room: d.room || '',
        studentCount: d.studentCount || 0,
      };
    });
  } catch (error) {
    console.error('getTeacherClasses error:', error);
    return [];
  }
};

// ✅ Teachers only read — no createClass here