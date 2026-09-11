// services/studentService.ts
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export interface StudentData {
  id: string;
  fullName: string;
  studentId: string;
  classId: string;
  parentPhone: string;
  parentEmail?: string;
  status: 'active' | 'inactive';
}

export const getTeacherStudents = async (
  classIds: string[]
): Promise<StudentData[]> => {
  try {
    if (!classIds.length) return [];
    const results: StudentData[] = [];
    for (const classId of classIds) {
      const snap = await getDocs(
        query(collection(db, 'students'), where('classId', '==', classId))
      );
      snap.forEach(doc => {
        const d = doc.data();
        results.push({
          id: doc.id,
          fullName: d.fullName || d.name || '',
          studentId: d.studentId || '',
          classId: d.classId || '',
          parentPhone: d.parentPhone || '',
          parentEmail: d.parentEmail || '',
          status: d.status || 'active',
        });
      });
    }
    return results;
  } catch (error) {
    console.error('getTeacherStudents error:', error);
    return [];
  }
};

export const addStudent = async (data: {
  fullName: string;
  studentId: string;
  classId: string;
  parentPhone: string;
  parentEmail?: string;
  addedBy: string;
}) => {
  return await addDoc(collection(db, 'students'), {
    fullName: data.fullName.trim(),
    studentId: data.studentId.trim(),
    classId: data.classId,
    parentPhone: data.parentPhone.trim(),
    parentEmail: data.parentEmail?.trim() || '',
    status: 'active',
    addedBy: data.addedBy,
    createdAt: serverTimestamp(),
  });
};