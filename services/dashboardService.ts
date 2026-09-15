// services/dashboardService.ts
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from './firebase';

export interface DashboardStats {
  totalClasses: number;
  totalStudents: number;
  attendanceToday: number;
  pendingResults: number;
}

export interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  icon: string;
  bg: string;
  color: string;
}

export const getDashboardStats = async (teacherId: string): Promise<DashboardStats> => {
  try {
    const classesSnap = await getDocs(
      query(collection(db, 'classes'), where('teacherId', '==', teacherId))
    );
    const classIds = classesSnap.docs.map(d => d.id);

    let totalStudents = 0;
    for (const classId of classIds) {
      const s = await getDocs(
        query(collection(db, 'students'), where('classId', '==', classId))
      );
      totalStudents += s.size;
    }

    const today = new Date().toISOString().split('T')[0];
    let present = 0;
    let totalMarked = 0;
    for (const classId of classIds) {
      const snap = await getDocs(
        query(
          collection(db, 'attendance'),
          where('classId', '==', classId),
          where('date', '==', today)
        )
      );
      snap.forEach(d => {
        totalMarked++;
        if (d.data().status === 'present') present++;
      });
    }
    const attendanceToday = totalMarked > 0 ? Math.round((present / totalMarked) * 100) : 0;

    let pendingResults = 0;
    for (const classId of classIds) {
      const snap = await getDocs(
        query(
          collection(db, 'results'),
          where('classId', '==', classId),
          where('enteredBy', '==', teacherId)
        )
      );
      pendingResults += snap.size;
    }

    return {
      totalClasses: classesSnap.size,
      totalStudents,
      attendanceToday,
      pendingResults,
    };
  } catch (error) {
    console.error('getDashboardStats error:', error);
    return { totalClasses: 0, totalStudents: 0, attendanceToday: 0, pendingResults: 0 };
  }
};

// ✅ Get real recent activity from Firestore
export const getRecentActivity = async (teacherId: string): Promise<ActivityItem[]> => {
  try {
    const items: ActivityItem[] = [];

    // 1. Recent attendance
    const attSnap = await getDocs(
      query(collection(db, 'attendance'), where('markedBy', '==', teacherId))
    );
    const att = attSnap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .sort((a: any, b: any) => {
        const aT = a.markedAt?.seconds || 0;
        const bT = b.markedAt?.seconds || 0;
        return bT - aT;
      })
      .slice(0, 2);

    att.forEach((a: any) => {
      items.push({
        id: `att-${a.id}`,
        title: 'Attendance recorded',
        subtitle: a.className || 'Class',
        time: timeAgo(a.markedAt),
        icon: 'checkbox-outline',
        bg: '#E0E7FF',
        color: '#1A237E',
      });
    });

    // 2. Recent results
    const resSnap = await getDocs(
      query(collection(db, 'results'), where('enteredBy', '==', teacherId))
    );
    const res = resSnap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .sort((a: any, b: any) => {
        const aT = a.enteredAt?.seconds || 0;
        const bT = b.enteredAt?.seconds || 0;
        return bT - aT;
      })
      .slice(0, 2);

    res.forEach((r: any) => {
      items.push({
        id: `res-${r.id}`,
        title: 'Results entered',
        subtitle: r.subject || 'Subject',
        time: timeAgo(r.enteredAt),
        icon: 'document-text-outline',
        bg: '#DCFCE7',
        color: '#16A34A',
      });
    });

    // Sort combined + return top 4
    return items.slice(0, 4);
  } catch (error) {
    console.error('getRecentActivity error:', error);
    return [];
  }
};

const timeAgo = (ts: any): string => {
  if (!ts) return 'just now';
  const seconds = ts.seconds || 0;
  const diff = Math.floor(Date.now() / 1000) - seconds;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
};