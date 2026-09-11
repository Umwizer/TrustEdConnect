// services/academicService.ts
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface AcademicStats {
  averageScore: number;
  totalResults: number;
  gradeDistribution: { A: number; B: number; C: number; D: number; F: number };
}

export const getTeacherAcademicStats = async (teacherId: string): Promise<AcademicStats> => {
  try {
    const snap = await getDocs(
      query(collection(db, 'results'), where('enteredBy', '==', teacherId))
    );
    const dist = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    let sum = 0;
    let count = 0;
    snap.forEach(doc => {
      const d = doc.data();
      const score = Number(d.score) || 0;
      sum += score;
      count++;
      const g = (d.grade || 'F').toUpperCase();
      if (g in dist) dist[g as keyof typeof dist]++;
    });
    return {
      averageScore: count ? Math.round(sum / count) : 0,
      totalResults: count,
      gradeDistribution: dist,
    };
  } catch (error) {
    console.error('getTeacherAcademicStats error:', error);
    return { averageScore: 0, totalResults: 0, gradeDistribution: { A: 0, B: 0, C: 0, D: 0, F: 0 } };
  }
};

export const calculateGrade = (score: number): string => {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
};

// ✅ SAVE RESULTS for a class
export const saveResults = async (params: {
  classId: string;
  subject: string;
  term: string;
  assessmentName: string;
  enteredBy: string;
  results: { studentId: string; studentName: string; score: number }[];
}) => {
  const promises = params.results.map(r =>
    addDoc(collection(db, 'results'), {
      studentId: r.studentId,
      studentName: r.studentName,
      classId: params.classId,
      subject: params.subject,
      term: params.term,
      assessmentName: params.assessmentName,
      score: r.score,
      grade: calculateGrade(r.score),
      enteredBy: params.enteredBy,
      enteredAt: serverTimestamp(),
    })
  );
  return await Promise.all(promises);
};