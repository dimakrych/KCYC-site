import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";

export interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  department: string;
  motivation: string;
}

export interface ApplicationFormData {
  name: string;
  phone: string;
  email: string;
  opportunityId: string;
  opportunityTitle: string;
  type: string;
  // Dynamic fields storage
  answers: Record<string, string>; 
  // Legacy support fields (optional)
  socialLink?: string;
}

// Helper to remove undefined values, as Firestore doesn't accept them
const cleanData = (data: any) => {
  const cleaned: any = {};
  Object.keys(data).forEach(key => {
    if (data[key] !== undefined) {
      cleaned[key] = data[key];
    } else {
      cleaned[key] = ""; // Replace undefined with empty string
    }
  });
  return cleaned;
};

// Функція відправки форми контактів
export const submitContactForm = async (data: ContactFormData): Promise<{ success: boolean; message: string }> => {
  try {
    const cleanedPayload = cleanData(data);
    await addDoc(collection(db, "submissions"), {
      ...cleanedPayload,
      formType: 'general_contact',
      status: 'new',
      createdAt: serverTimestamp()
    });

    return { 
      success: true, 
      message: 'Дякуємо! Ваша заявка успішно збережена.' 
    };
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

// Функція відправки форми на конкретну можливість
export const submitApplicationForm = async (data: ApplicationFormData): Promise<{ success: boolean; message: string }> => {
  try {
    const cleanedPayload = cleanData(data);
    
    // Ensure answers object is also clean
    if (cleanedPayload.answers) {
      cleanedPayload.answers = cleanData(cleanedPayload.answers);
    }

    await addDoc(collection(db, "applications"), {
      ...cleanedPayload,
      status: 'new',
      createdAt: serverTimestamp()
    });

    return { 
      success: true, 
      message: 'Заявка успішно надіслана!' 
    };
  } catch (error) {
    console.error("Error adding application: ", error);
    throw error;
  }
};