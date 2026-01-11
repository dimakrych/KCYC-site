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

// Deep clean function to recursively remove undefined values
const deepClean = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(v => deepClean(v));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const value = obj[key];
      if (value !== undefined) {
        acc[key] = deepClean(value);
      } else {
        acc[key] = ""; // Replace undefined with empty string
      }
      return acc;
    }, {} as any);
  }
  return obj;
};

// Функція відправки форми контактів
export const submitContactForm = async (data: ContactFormData): Promise<{ success: boolean; message: string }> => {
  try {
    const cleanedPayload = deepClean(data);
    await addDoc(collection(db, "submissions"), {
      ...cleanedPayload,
      formType: 'general_contact', // Маркер типу
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
    const cleanedPayload = deepClean(data);
    
    // Змінено: пишемо в 'submissions' замість 'applications', щоб використовувати існуючі правила безпеки
    // та бачити всі заявки в одній таблиці в адмінці.
    await addDoc(collection(db, "submissions"), {
      ...cleanedPayload,
      formType: 'opportunity_application', // Маркер типу
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

// Функція підписки на розсилку
export const subscribeToNewsletter = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    await addDoc(collection(db, "newsletter_subscribers"), {
      email,
      createdAt: serverTimestamp()
    });
    return { success: true, message: 'Ви успішно підписалися!' };
  } catch (error) {
    console.error("Error subscribing:", error);
    throw error;
  }
};