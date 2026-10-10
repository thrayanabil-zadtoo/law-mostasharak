/**
 * خدمات وقواعد بيانات Firebase لمنصة مستشارك القانوني
 */

import { collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { db } from './config';
import { CaseFile, ConsultationBooking } from '../law/types';

export async function saveConsultationToFirebase(booking: {
  bookingCode: string;
  lawyerId: string;
  lawyerName: string;
  clientName: string;
  clientPhone: string;
  mode: string;
  fee: number;
  slot?: unknown;
}) {
  try {
    const colRef = collection(db, 'consultationBookings');
    const docRef = await addDoc(colRef, {
      ...booking,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (err: any) {
    console.warn('[Firebase] Fallback save: ', err.message);
    return { success: false, error: err.message };
  }
}

export async function saveCaseFileToFirebase(caseFile: CaseFile) {
  try {
    const colRef = collection(db, 'caseFiles');
    const docRef = await addDoc(colRef, {
      ...caseFile,
      savedAt: new Date().toISOString(),
      timestamp: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (err: any) {
    console.warn('[Firebase] Fallback save case file: ', err.message);
    return { success: false, error: err.message };
  }
}

export async function saveChatSessionToFirebase(messages: any[], caseCategory?: string) {
  try {
    const colRef = collection(db, 'chatSessions');
    const docRef = await addDoc(colRef, {
      messagesCount: messages.length,
      category: caseCategory || 'general',
      lastMessage: messages[messages.length - 1]?.text?.slice(0, 200) || '',
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (err: any) {
    console.warn('[Firebase] Fallback save chat: ', err.message);
    return { success: false, error: err.message };
  }
}
