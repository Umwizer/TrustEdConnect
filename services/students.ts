import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';

import { db } from './firebase';

export type Student = {
  id: string;
  fullName: string;
  studentId: string;
  dateOfBirth?: string;
  gender?: string;
  classId?: string;
  className?: string;
  bloodGroup?: string;
  parentId?: string;
  parentName?: string;
  parentPhone?: string;
  status?: string;
  createdAt?: any;
  updatedAt?: any;
};

export const listenToStudents = (
  onChange: (students: Student[]) => void,
  onError?: (error: Error) => void
) => {
  const studentsRef = collection(
    db,
    'students'
  );

  const studentsQuery = query(
    studentsRef,
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(
    studentsQuery,
    (snapshot) => {
      const students: Student[] =
        snapshot.docs.map((studentDoc) => {
          const data = studentDoc.data();

          return {
            id: studentDoc.id,
            fullName: data.fullName || '',
            studentId: data.studentId || '',
            dateOfBirth:
              data.dateOfBirth || '',
            gender: data.gender || '',
            classId: data.classId || '',
            className:
              data.className || '',
            bloodGroup:
              data.bloodGroup || '',
            parentId:
              data.parentId || '',
            parentName:
              data.parentName || '',
            parentPhone:
              data.parentPhone || '',
            status:
              data.status || 'active',
            createdAt:
              data.createdAt || null,
            updatedAt:
              data.updatedAt || null,
          };
        });

      onChange(students);
    },
    (error) => {
      console.error(
        'Student listener error:',
        error
      );

      if (onError) {
        onError(error);
      }
    }
  );
};